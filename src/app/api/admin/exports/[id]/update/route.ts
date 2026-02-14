import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: exportId } = await params;
        const body = await request.json();

        // Get the pending export
        const pendingExport = await prisma.pendingExport.findUnique({
            where: { id: exportId }
        });

        if (!pendingExport) {
            return NextResponse.json({ error: 'Export not found' }, { status: 404 });
        }

        if (pendingExport.status !== 'PENDING') {
            return NextResponse.json({ error: 'Cannot update a processed export' }, { status: 400 });
        }

        // Update the pending export with new parameters
        const updated = await prisma.pendingExport.update({
            where: { id: exportId },
            data: {
                cfName: body.cfName,
                cfIcon: body.cfIcon,
                cfRisk: body.cfRisk,
                cfTargetApy: body.cfTargetApy,
                cfDuration: body.cfDuration,
                cfMinInvestment: body.cfMinInvestment,
                cfDescription: body.cfDescription,
                cfOrigin: body.cfOrigin,
                cfDestination: body.cfDestination,
                cfTransportMethod: body.cfTransportMethod,
                // Note: We don't update cfAmountRequired, cfMetalForm, cfPurityPercent
                // as those are derived from the purchase/deal
            }
        });

        console.log(`[Admin] Export ${exportId} parameters updated by ${session.user.email}`);

        return NextResponse.json({
            success: true,
            data: updated,
            message: 'Export parameters updated'
        });

    } catch (error) {
        console.error('[Admin] Update export error:', error);
        return NextResponse.json({
            error: 'Internal server error'
        }, { status: 500 });
    }
}
