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

        // 2. Update Status to CLOSED locally and assign to buyer
        const updatedDeal = await prisma.deal.update({
            where: { id: dealId },
            data: {
                status: "CLOSED",
                buyerId: session.user.id
            }
        });

        // 3. Export to Crowdfunding
        // We need the Crowdfunding API URL. For now, let's assume localhost:3000 (standard Next.js port)
        // But wait, Marketplace is probably 3001 or something.
        // Let's assume Crowdfunding is running on http://localhost:3000 (default) and Marketplace on 3001.

        const CROWDFUNDING_API = process.env.CROWDFUNDING_API_URL || "http://localhost:3000/api/marketplace/commodities";

        try {
            const exportPayload = {
                // Map to CrowdFunding Commodity Schema
                type: "Metals", // Defaulting for now since we don't have exact mapping
                name: `${updatedDeal.company} - ${updatedDeal.commodity}`,
                icon: "gold-bar", // specific to gold, or map based on commodity
                risk: "Low",
                targetApy: 12.5, // Mock default
                duration: 12,
                minInvestment: 500,
                amountRequired: updatedDeal.quantity * updatedDeal.pricePerKg * (1 - updatedDeal.discount / 100),
                description: `Secured ${updatedDeal.commodity} deal from ${updatedDeal.company}. Quantity: ${updatedDeal.quantity}kg.`,
                origin: "Africa", // We don't have country in Deal model yet! We should probably add it.
                destination: "Dubai",
                transportMethod: "Air Freight",
                metalForm: "Bar",
                purityPercent: 99.9,
                // Passing external Marketplace ID reference
                shipmentId: updatedDeal.id
            };

            const response = await fetch(CROWDFUNDING_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(exportPayload)
            });

            if (!response.ok) {
                console.error("Failed to export to Crowdfunding", await response.text());
                // We might want to revert status or mark as "CLOSED_FAILED_EXPORT"
                // For MVP, just log error.
            } else {
                const result = await response.json();
                // Maybe save the crowdfunding ID?
                // await prisma.deal.update({ where: { id: dealId }, data: { crowdfundingId: result.data.id } });
            }

        } catch (err) {
            console.error("Error calling Crowdfunding API", err);
        }

        return NextResponse.json({ success: true, deal: updatedDeal });

    } catch (error) {
        console.error("Purchase error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
