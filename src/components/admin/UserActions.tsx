'use client';

import { useState } from 'react';
import { updateUserRole, adminAdjustBalance } from '@/lib/actions';
import { Settings, DollarSign, X, Check } from 'lucide-react';

interface UserActionsProps {
    userId: string;
    currentRole: string;
    userName: string;
}

export function UserActions({ userId, currentRole, userName }: UserActionsProps) {
    const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRoleChange = async (newRole: string) => {
        if (newRole === currentRole) return;
        if (!confirm(`Are you sure you want to change ${userName}'s role to ${newRole}?`)) return;

        setLoading(true);
        try {
            await updateUserRole(userId, newRole as 'USER' | 'ADMIN');
        } catch (error) {
            alert("Failed to update role");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <select
                disabled={loading}
                value={currentRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="bg-secondary/50 border border-border rounded-lg text-xs py-1 px-2 focus:ring-1 focus:ring-primary outline-none cursor-pointer"
            >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
            </select>

            <button
                onClick={() => setIsBalanceModalOpen(true)}
                className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                title="Adjust Balance"
            >
                <DollarSign className="w-4 h-4" />
            </button>

            <AdjustBalanceModal
                isOpen={isBalanceModalOpen}
                onClose={() => setIsBalanceModalOpen(false)}
                userId={userId}
                userName={userName}
            />
        </div>
    );
}

function AdjustBalanceModal({ isOpen, onClose, userId, userName }: { isOpen: boolean; onClose: () => void; userId: string; userName: string }) {
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await adminAdjustBalance(userId, Number(amount), reason || "Admin Adjustment");
            onClose();
            setAmount('');
            setReason('');
        } catch (error) {
            alert("Failed to adjust balance");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-foreground">Adjust Balance</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                    Adjusting wallet balance for <span className="font-semibold text-foreground">{userName}</span>.
                    Use negative values to deduct funds.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Amount ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            placeholder="e.g. 1000 or -500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Reason / Reference</label>
                        <input
                            type="text"
                            required
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-2 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            placeholder="e.g. Correction, Bonus"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
                    >
                        {loading ? 'Processing...' : 'Confirm Adjustment'}
                    </button>
                </form>
            </div>
        </div>
    );
}
