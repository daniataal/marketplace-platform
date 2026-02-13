'use client';

import { updateKycStatus } from "@/lib/actions";
import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

export function KycActions({ userId, currentStatus }: { userId: string, currentStatus: string }) {
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (status: 'APPROVED' | 'REJECTED') => {
        if (!confirm(`Are you sure you want to mark this user as ${status}?`)) return;
        setLoading(true);
        try {
            await updateKycStatus(userId, status);
        } catch (error) {
            alert("Failed to update KYC status");
        } finally {
            setLoading(false);
        }
    };

    if (currentStatus === 'APPROVED') {
        return (
            <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <CheckCircle className="w-4 h-4" /> User is Verified
                <button
                    onClick={() => handleUpdate('REJECTED')}
                    disabled={loading}
                    className="ml-auto text-xs text-muted-foreground underline hover:text-destructive"
                >
                    Revoke
                </button>
            </div>
        );
    }

    return (
        <div className="flex gap-3 mt-4">
            <button
                onClick={() => handleUpdate('APPROVED')}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
                <CheckCircle className="w-4 h-4" />
                Approve KYC
            </button>
            <button
                onClick={() => handleUpdate('REJECTED')}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
                <XCircle className="w-4 h-4" />
                Reject
            </button>
        </div>
    );
}
