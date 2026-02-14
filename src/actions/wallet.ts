'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getWalletData() {
    const session = await auth();
    if (!session?.user?.email) {
        return { balance: 0, portfolioValue: 0, dealsCount: 0 };
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { deals: true }
    });

    if (!user) {
        return { balance: 0, portfolioValue: 0, dealsCount: 0 };
    }

    // Calculate portfolio value based on deals owned
    const portfolioValue = user.deals.reduce((sum, deal) => {
        return sum + (deal.quantity * deal.pricePerKg);
    }, 0);

    return {
        balance: user.balance,
        portfolioValue,
        dealsCount: user.deals.length
    };
}

export async function depositFunds(amount: number, reference: string = "Manual Deposit") {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) throw new Error("User not found");
    // @ts-ignore - Check if wallet is frozen (property may be missing in types until regen)
    if (user.walletFrozen) throw new Error("Wallet is frozen. Cannot deposit funds.");

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Update User Balance
            await tx.user.update({
                where: { email: session.user.email! },
                data: { balance: { increment: amount } }
            });

            // 2. Create Transaction Record
            // @ts-ignore - Transaction model access (type issue)
            await tx.transaction.create({
                data: {
                    userId: session.user.id!,
                    type: "DEPOSIT",
                    amount: amount,
                    status: "COMPLETED",
                    reference: reference
                }
            });
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        console.error("Deposit failed:", error);
        throw new Error(error.message || "Deposit failed");
    }
}

export async function withdrawFunds(amount: number, iban: string) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) throw new Error("User not found");
        // @ts-ignore - Check if wallet is frozen
        if (user.walletFrozen) throw new Error("Wallet is frozen. Cannot withdraw funds.");

        if (user.balance < amount) {
            throw new Error("Insufficient funds");
        }

        await prisma.$transaction(async (tx) => {
            // 1. Deduct User Balance
            await tx.user.update({
                where: { email: session.user.email! },
                data: { balance: { decrement: amount } }
            });

            // 2. Create Transaction Record
            // @ts-ignore - Transaction model access
            await tx.transaction.create({
                data: {
                    userId: session.user.id!,
                    type: "WITHDRAWAL",
                    amount: amount,
                    status: "PENDING", // Withdrawals often need approval
                    reference: `IBAN: ${iban}`
                }
            });
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        console.error("Withdrawal failed:", error);
        throw new Error(error.message || "Withdrawal failed");
    }
}

export async function getTransactions() {
    const session = await auth();
    if (!session?.user?.email) return [];

    // @ts-ignore - Transaction model access
    return await prisma.transaction.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 10
    });
}
