'use client';

import { useState } from 'react';
import { X, CheckCircle, XCircle, Edit2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ExportData = {
    id: string;
    cfType: string;
    cfName: string;
    cfIcon: string;
    cfRisk: string;
    cfTargetApy: number;
    cfDuration: number;
    cfMinInvestment: number;
    cfAmountRequired: number;
    cfDescription: string;
    cfOrigin: string;
    cfDestination: string;
    cfTransportMethod: string;
    cfMetalForm: string;
    cfPurityPercent: number;
    purchase: {
        id: string;
        quantity: number;
        totalPrice: number;
    };
    deal: {
        company: string;
        commodity: string;
    };
};

export default function ExportReviewModal({
    exportData,
    onClose
}: {
    exportData: ExportData;
    onClose: () => void;
}) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(exportData);

    const handleUpdate = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/admin/exports/${exportData.id}/update`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsEditing(false);
                alert('Parameters updated successfully!');
            } else {
                alert('Failed to update parameters');
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleApprove = async () => {
        if (!confirm('Approve and export this purchase to crowdfunding?')) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/admin/exports/${exportData.id}/approve`, {
                method: 'POST'
            });

            if (response.ok) {
                alert('Export approved and sent to crowdfunding platform!');
                router.refresh();
                onClose();
            } else {
                const data = await response.json();
                alert(`Failed to approve: ${data.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Approve error:', error);
            alert('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!confirm('Reject this export? This cannot be undone.')) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/admin/exports/${exportData.id}/reject`, {
                method: 'POST'
            });

            if (response.ok) {
                alert('Export rejected');
                router.refresh();
                onClose();
            } else {
                alert('Failed to reject export');
            }
        } catch (error) {
            console.error('Reject error:', error);
            alert('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">Review Export</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Purchase Info */}
                    <div className="bg-secondary/30 rounded-lg p-4">
                        <h3 className="font-semibold text-foreground mb-3">Purchase Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Company</p>
                                <p className="font-medium text-foreground">{exportData.deal.company}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Commodity</p>
                                <p className="font-medium text-foreground">{exportData.deal.commodity}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Quantity</p>
                                <p className="font-medium text-foreground">{exportData.purchase.quantity} kg</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Total Price</p>
                                <p className="font-medium text-foreground">${exportData.purchase.totalPrice.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Crowdfunding Parameters */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-foreground">Crowdfunding Parameters</h3>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Campaign Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.cfName}
                                        onChange={(e) => setFormData({ ...formData, cfName: e.target.value })}
                                        className="w-full p-2 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                                    />
                                ) : (
                                    <p className="text-foreground p-2">{formData.cfName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Risk Level</label>
                                {isEditing ? (
                                    <select
                                        value={formData.cfRisk}
                                        onChange={(e) => setFormData({ ...formData, cfRisk: e.target.value })}
                                        className="w-full p-2 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                ) : (
                                    <p className="text-foreground p-2">{formData.cfRisk}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Target APY (%)</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={formData.cfTargetApy}
                                        onChange={(e) => setFormData({ ...formData, cfTargetApy: parseFloat(e.target.value) })}
                                        className="w-full p-2 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                                    />
                                ) : (
                                    <p className="text-foreground p-2">{formData.cfTargetApy}%</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Duration (months)</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={formData.cfDuration}
                                        onChange={(e) => setFormData({ ...formData, cfDuration: parseInt(e.target.value) })}
                                        className="w-full p-2 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                                    />
                                ) : (
                                    <p className="text-foreground p-2">{formData.cfDuration} months</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Min Investment ($)</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={formData.cfMinInvestment}
                                        onChange={(e) => setFormData({ ...formData, cfMinInvestment: parseFloat(e.target.value) })}
                                        className="w-full p-2 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                                    />
                                ) : (
                                    <p className="text-foreground p-2">${formData.cfMinInvestment.toLocaleString()}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Origin</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.cfOrigin}
                                        onChange={(e) => setFormData({ ...formData, cfOrigin: e.target.value })}
                                        className="w-full p-2 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                                    />
                                ) : (
                                    <p className="text-foreground p-2">{formData.cfOrigin}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Destination</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.cfDestination}
                                        onChange={(e) => setFormData({ ...formData, cfDestination: e.target.value })}
                                        className="w-full p-2 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                                    />
                                ) : (
                                    <p className="text-foreground p-2">{formData.cfDestination}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Transport Method</label>
                                {isEditing ? (
                                    <select
                                        value={formData.cfTransportMethod}
                                        onChange={(e) => setFormData({ ...formData, cfTransportMethod: e.target.value })}
                                        className="w-full p-2 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                                    >
                                        <option value="Air Freight">Air Freight</option>
                                        <option value="Sea Freight">Sea Freight</option>
                                        <option value="Road Transport">Road Transport</option>
                                        <option value="Rail Transport">Rail Transport</option>
                                    </select>
                                ) : (
                                    <p className="text-foreground p-2">{formData.cfTransportMethod}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
                                {isEditing ? (
                                    <textarea
                                        value={formData.cfDescription}
                                        onChange={(e) => setFormData({ ...formData, cfDescription: e.target.value })}
                                        rows={3}
                                        className="w-full p-2 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                                    />
                                ) : (
                                    <p className="text-foreground p-2">{formData.cfDescription}</p>
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={handleUpdate}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    onClick={() => {
                                        setFormData(exportData);
                                        setIsEditing(false);
                                    }}
                                    className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-3">
                    <button
                        onClick={handleApprove}
                        disabled={isSubmitting || isEditing}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                        ) : (
                            <><CheckCircle className="w-5 h-5" /> Approve & Export</>
                        )}
                    </button>
                    <button
                        onClick={handleReject}
                        disabled={isSubmitting || isEditing}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <XCircle className="w-5 h-5" /> Reject
                    </button>
                </div>
            </div>
        </div>
    );
}
