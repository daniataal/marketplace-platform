import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const params = await props.params;
        const dealId = params.id;
        const body = await request.json();
        const { quantity, deliveryLocation } = body;

        if (!quantity || quantity <= 0) {
            return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
        }

        // 1. Verify Deal exists and is OPEN
        const deal = await prisma.deal.findUnique({
            where: { id: dealId }
        });

        if (!deal) {
            return NextResponse.json({ error: "Deal not found" }, { status: 404 });
        }

        if (deal.status !== "OPEN") {
            return NextResponse.json({ error: "Deal is not available" }, { status: 400 });
        }

        // 2. Check available quantity
        if (quantity > deal.availableQuantity) {
            return NextResponse.json({
                error: `Only ${deal.availableQuantity} kg available`
            }, { status: 400 });
        }

        // 3. Calculate cost
        const finalPrice = deal.pricePerKg * (1 - deal.discount / 100);
        const totalCost = quantity * finalPrice;

        // 4. Check user balance
        const buyer = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!buyer || buyer.balance < totalCost) {
            return NextResponse.json({
                error: "Insufficient balance"
            }, { status: 400 });
        }

        // 5. Create Purchase record and update deal/user in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Deduct from user balance
            await tx.user.update({
                where: { id: session.user.id },
                data: { balance: { decrement: totalCost } }
            });

            // Create Purchase record
            const purchase = await tx.purchase.create({
                data: {
                    dealId: deal.id,
                    buyerId: session.user.id,
                    quantity,
                    pricePerKg: finalPrice,
                    totalPrice: totalCost,
                    deliveryLocation: deliveryLocation || deal.deliveryLocation,
                    status: "CONFIRMED"
                }
            });

            // Update deal's available quantity
            const updatedDeal = await tx.deal.update({
                where: { id: dealId },
                data: {
                    availableQuantity: { decrement: quantity }
                }
            });

            // If deal is now fully sold, update status to CLOSED
            if (updatedDeal.availableQuantity <= 0) {
                await tx.deal.update({
                    where: { id: dealId },
                    data: {
                        status: "CLOSED",
                        buyerId: session.user.id // Last buyer becomes the deal owner
                    }
                });
            }

            return { purchase, updatedDeal, soldOut: updatedDeal.availableQuantity <= 0 };
        });

        // 6. Export to Crowdfunding ONLY if deal is fully closed
        let exportSuccess = false;
        if (result.soldOut) {
            const CROWDFUNDING_API = process.env.CROWDFUNDING_API_URL || "http://localhost:3000/api/marketplace/commodities";
            console.log(`[Marketplace] Deal ${dealId} sold out. Exporting to ${CROWDFUNDING_API}`);

            try {
                const exportPayload = {
                    type: "Metals",
                    name: `${deal.company} - ${deal.commodity}`,
                    icon: "gold-bar",
                    risk: "Low",
                    targetApy: 12.5,
                    duration: 12,
                    minInvestment: 500,
                    amountRequired: deal.quantity * finalPrice,
                    description: `Secured ${deal.commodity} deal from ${deal.company}. Total quantity: ${deal.quantity}kg.`,
                    origin: "Africa",
                    destination: deliveryLocation || deal.deliveryLocation,
                    transportMethod: "Air Freight",
                    metalForm: "Bar",
                    purityPercent: 99.9,
                    shipmentId: deal.id
                };

                const response = await fetch(CROWDFUNDING_API, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(exportPayload)
                });

                if (response.ok) {
                    exportSuccess = true;
                    console.log(`[Marketplace] Successfully exported deal ${dealId} to Crowdfunding`);
                } else {
                    console.error(`[Marketplace] Crowdfunding export failed:`, await response.text());
                }
            } catch (err: any) {
                console.error(`[Marketplace] Crowdfunding export error:`, err.message);
            }
        }

        return NextResponse.json({
            success: true,
            purchase: result.purchase,
            availableQuantity: result.updatedDeal.availableQuantity,
            soldOut: result.soldOut,
            exportedToCrowdfunding: exportSuccess
        });

    } catch (error) {
        console.error("Purchase error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
