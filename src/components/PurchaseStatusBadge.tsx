'use client';

import { Package, Truck, CheckCircle, Clock, Calendar } from 'lucide-react';

interface PurchaseStatusBadgeProps {
    status: string;
    trackingNumber?: string | null;
    shippedAt?: Date | null;
    deliveredAt?: Date | null;
    createdAt: Date;
}

export default function PurchaseStatusBadge({
    status,
    trackingNumber,
    shippedAt,
    deliveredAt,
    createdAt
}: PurchaseStatusBadgeProps) {
    const getStatusDisplay = () => {
        switch (status) {
            case 'DELIVERED':
                return {
                    icon: <CheckCircle className="w-5 h-5" />,
                    label: 'Delivered',
                    color: 'bg-green-500/10 text-green-500 border-green-500/20',
                    message: 'Your purchase has been delivered'
                };
            case 'SHIPPED':
                return {
                    icon: <Truck className="w-5 h-5" />,
                    label: 'Shipped',
                    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                    message: 'Your purchase is on the way'
                };
            case 'CONFIRMED':
                return {
                    icon: <Package className="w-5 h-5" />,
                    label: 'Confirmed',
                    color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
                    message: 'Your purchase is being prepared for shipment'
                };
            default:
                return {
                    icon: <Clock className="w-5 h-5" />,
                    label: 'Pending',
                    color: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
                    message: 'Your purchase is being processed'
                };
        }
    };

    const statusDisplay = getStatusDisplay();

    return (
        <div className={`border rounded-lg p-4 ${statusDisplay.color}`}>
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    {statusDisplay.icon}
                </div>
                <div className="flex-1">
                    <div className="font-semibold text-sm mb-1">
                        {statusDisplay.label}
                    </div>
                    <div className="text-xs opacity-90 mb-2">
                        {statusDisplay.message}
                    </div>

                    {/* Tracking Number (if available) */}
                    {trackingNumber && (
                        <div className="text-xs font-mono bg-background/50 rounded px-2 py-1 inline-block mb-2">
                            Tracking: {trackingNumber}
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>Ordered: {new Date(createdAt).toLocaleDateString()}</span>
                        </div>

                        {shippedAt && (
                            <div className="flex items-center gap-2">
                                <Truck className="w-3 h-3" />
                                <span>Shipped: {new Date(shippedAt).toLocaleDateString()}</span>
                            </div>
                        )}

                        {deliveredAt && (
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3" />
                                <span>Delivered: {new Date(deliveredAt).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
