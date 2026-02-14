'use client';

import { useState } from 'react';
import { Package, Truck, CheckCircle, X, Calendar } from 'lucide-react';

interface LogisticsUpdateModalProps {
    purchaseId: string;
    currentStatus: string;
    currentLogistics?: {
        company: string | null;
        trackingNumber: string | null;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        notes: string | null;
    };
    onClose: () => void;
}

const LOGISTICS_COMPANIES = [
    'Loomis International',
    'Brinks',
    'G4S',
    'Malca-Amit',
    'Dunbar Armored',
    'Prosegur',
    'Securitas',
    'Other'
];

export default function LogisticsUpdateModal({
    purchaseId,
    currentStatus,
    currentLogistics,
    onClose
}: LogisticsUpdateModalProps) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(currentStatus);
    const [logisticsCompany, setLogisticsCompany] = useState(currentLogistics?.company || '');
    const [trackingNumber, setTrackingNumber] = useState(currentLogistics?.trackingNumber || '');
    const [shippedAt, setShippedAt] = useState(
        currentLogistics?.shippedAt ? new Date(currentLogistics.shippedAt).toISOString().slice(0, 16) : ''
    );
    const [deliveredAt, setDeliveredAt] = useState(
        currentLogistics?.deliveredAt ? new Date(currentLogistics.deliveredAt).toISOString().slice(0, 16) : ''
    );
    const [logisticsNotes, setLogisticsNotes] = useState(currentLogistics?.notes || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/admin/purchases/${purchaseId}/logistics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    logisticsCompany: logisticsCompany || null,
                    trackingNumber: trackingNumber || null,
                    shippedAt: shippedAt ? new Date(shippedAt).toISOString() : null,
                    deliveredAt: deliveredAt ? new Date(deliveredAt).toISOString() : null,
                    logisticsNotes: logisticsNotes || null
                })
            });

            if (!res.ok) throw new Error('Failed to update logistics');

            alert('Logistics updated successfully!');
            window.location.reload();
        } catch (error) {
            alert('Failed to update logistics information');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Truck className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground">Update Logistics</h3>
                            <p className="text-xs text-muted-foreground">Purchase ID: {purchaseId.slice(0, 8)}...</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Delivery Status *
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            required
                        >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                        </select>
                    </div>

                    {/* Logistics Company */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Logistics Company
                        </label>
                        <select
                            value={logisticsCompany}
                            onChange={(e) => setLogisticsCompany(e.target.value)}
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        >
                            <option value="">Select Company...</option>
                            {LOGISTICS_COMPANIES.map((company) => (
                                <option key={company} value={company}>
                                    {company}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-muted-foreground mt-1">
                            🔒 Admin-only field - not visible to buyers
                        </p>
                    </div>

                    {/* Tracking Number */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Tracking Number
                        </label>
                        <input
                            type="text"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            placeholder="e.g. LOM123456789"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Shipped Date */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Shipped Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                value={shippedAt}
                                onChange={(e) => setShippedAt(e.target.value)}
                                className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>

                        {/* Delivered Date */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Delivered Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                value={deliveredAt}
                                onChange={(e) => setDeliveredAt(e.target.value)}
                                className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>
                    </div>

                    {/* Logistics Notes */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Internal Notes (Admin Only)
                        </label>
                        <textarea
                            value={logisticsNotes}
                            onChange={(e) => setLogisticsNotes(e.target.value)}
                            rows={4}
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                            placeholder="Add any internal notes about this shipment..."
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-secondary text-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <Package className="w-4 h-4" />
                                    Update Logistics
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
