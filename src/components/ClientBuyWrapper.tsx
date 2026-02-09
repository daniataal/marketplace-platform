'use client';

import { DealCard } from "./DealCard";
import { useRouter } from "next/navigation";

export default function ClientBuyButton({ deal }: { deal: any }) {
    const router = useRouter();

    const handleBuy = async (id: string) => {
        // Optimistic update or loading state could go here
        if (!confirm("Are you sure you want to purchase this deal and send it to Crowdfunding?")) return;

        try {
            const res = await fetch(`/api/v1/deals/${id}/purchase`, {
                method: 'POST'
            });
            const data = await res.json();

            if (data.success) {
                alert("Deal Purchased & Exported to Crowdfunding!");
                router.refresh();
            } else {
                alert("Error: " + data.error);
            }
        } catch (e) {
            alert("Error processing purchase");
        }
    };

    return <DealCard deal={deal} onBuy={handleBuy} />;
}
