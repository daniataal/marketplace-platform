import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            externalId,
            company,
            commodity,
            quantity,
            pricePerKg,
            discount
        } = body;

        // specific validation could go here
        if (!externalId || !company || !commodity) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Upsert the deal based on externalId
        const deal = await prisma.deal.upsert({
            where: { externalId },
            update: {
                company,
                commodity,
                quantity: parseFloat(quantity),
                availableQuantity: parseFloat(quantity), // Reset available quantity on update
                pricePerKg: parseFloat(pricePerKg),
                discount: parseFloat(discount),
                deliveryLocation: "Dubai", // Default from mining exports
                incoterms: "CIF"
            },
            create: {
                externalId,
                company,
                commodity,
                quantity: parseFloat(quantity),
                availableQuantity: parseFloat(quantity), // Initialize with full quantity
                pricePerKg: parseFloat(pricePerKg),
                discount: parseFloat(discount),
                status: "OPEN",
                deliveryLocation: "Dubai", // Default for mining exports
                incoterms: "CIF" // Cost, Insurance, and Freight
            }
        });

        return NextResponse.json({ success: true, deal });
    } catch (error) {
        console.error("Error ingesting deal:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
