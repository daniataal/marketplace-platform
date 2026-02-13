import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditDealForm from "./EditDealForm";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditDealPage({ params }: PageProps) {
    const { id } = await params;

    const deal = await prisma.deal.findUnique({
        where: { id }
    });

    if (!deal) {
        notFound();
    }

    // Transform Decimal to number if needed, but Prisma Float is number in JS.
    // deal object should be serializable.

    return <EditDealForm deal={deal} />;
}
