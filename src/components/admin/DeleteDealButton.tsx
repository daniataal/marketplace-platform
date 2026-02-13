'use client';

import { Trash2 } from "lucide-react";
import { deleteDeal } from "@/lib/actions";
import { useState } from "react";

interface DeleteDealButtonProps {
    id: string;
    title: string;
    hasPurchases: boolean;
}

export function DeleteDealButton({ id, title, hasPurchases }: DeleteDealButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete deal "${title}"? This action cannot be undone.`)) {
            setLoading(true);
            try {
                await deleteDeal(id);
            } catch (error) {
                alert("Failed to delete deal");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={hasPurchases ? "Warning: This deal has purchases" : `Delete ${title}`}
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
