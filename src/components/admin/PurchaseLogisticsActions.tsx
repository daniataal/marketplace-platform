'use client';

import { useState } from 'react';
import { Truck, CheckCircle } from 'lucide-react';
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
    const [isDelivering, setIsDelivering] = useState(false);

    const handleMarkDelivered = async () => {
        if (!confirm('Are you sure you want to mark this purchase as DELIVERED? This will trigger a re-push for periodic deals.')) {
            return;
        }

        setIsDelivering(true);
        try {
            const res = await fetch(`/api/admin/purchases/${purchaseId}/logistics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'DELIVERED',
                    deliveredAt: new Date().toISOString(),
                    // Preserve existing logistics info
                    logisticsCompany: currentLogistics?.company,
                    trackingNumber: currentLogistics?.trackingNumber,
                    shippedAt: currentLogistics?.shippedAt?.toISOString(),
                    logisticsNotes: currentLogistics?.notes
                })
            });

            if (!res.ok) throw new Error('Failed to update status');

            alert('Purchase marked as DELIVERED successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error marking as delivered:', error);
            alert('Failed to update delivery status');
        } finally {
            setIsDelivering(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {(currentStatus === 'SHIPPED' || currentStatus === 'CONFIRMED') && (
                <button
                    onClick={handleMarkDelivered}
                    disabled={isDelivering}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                    <CheckCircle className="w-4 h-4" />
                    {isDelivering ? 'Delivering...' : 'Mark Delivered'}
                </button>
            )}

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
        </div>
    );
}
