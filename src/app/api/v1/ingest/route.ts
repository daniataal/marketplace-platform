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
                pricePerKg: parseFloat(pricePerKg),
                discount: parseFloat(discount),
                // If it was previously CLOSED/EXPORTED, we might decide NOT to update status
                // For now, let's keep status as is if it exists, or update if needed.
                // But usually Mining Map sends updates. Let's assume updates from Mining Map
                // should re-open or update details. 
                // For simplicity: just update fields.
            },
            create: {
                externalId,
                company,
                commodity,
                quantity: parseFloat(quantity),
                pricePerKg: parseFloat(pricePerKg),
                discount: parseFloat(discount),
                status: "OPEN"
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
