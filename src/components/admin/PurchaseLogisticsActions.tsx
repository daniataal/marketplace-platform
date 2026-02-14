'use client';

import { useState } from 'react';
import { Truck } from 'lucide-react';
import LogisticsUpdateModal from './LogisticsUpdateModal';

interface PurchaseLogisticsActionsProps {
    purchaseId: string;
    currentStatus: string;
    currentLogistics?: {
        company: string | null;
        trackingNumber: string | null;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        notes: string | null;
    };
}

export default function PurchaseLogisticsActions({
    purchaseId,
    currentStatus,
    currentLogistics
}: PurchaseLogisticsActionsProps) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
                <Truck className="w-4 h-4" />
                Update Logistics
            </button>

            {showModal && (
                <LogisticsUpdateModal
                    purchaseId={purchaseId}
                    currentStatus={currentStatus}
                    currentLogistics={currentLogistics}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}
