import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await auth();

        // Check if user is admin
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = params.id;
        const body = await req.json();
        const { frozen } = body;

        if (typeof frozen !== 'boolean') {
            return NextResponse.json({ error: "Invalid frozen status" }, { status: 400 });
        }

        // Update user's wallet frozen status
        const user = await prisma.user.update({
            where: { id: userId },
            data: { walletFrozen: frozen },
            select: {
                id: true,
                email: true,
                name: true,
                walletFrozen: true
            }
        });

        return NextResponse.json({
            success: true,
            user,
            message: frozen ? "Wallet frozen successfully" : "Wallet unfrozen successfully"
        });

    } catch (error) {
        console.error("Wallet freeze error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
