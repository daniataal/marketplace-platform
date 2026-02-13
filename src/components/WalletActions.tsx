'use client';

import { useState } from 'react';
import { depositFunds, withdrawFunds } from '@/actions/wallet';
import { Plus, Minus, X, CreditCard, Banknote } from 'lucide-react';

export function WalletActions() {
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

    return (
        <div className="flex gap-2">
            <button
                onClick={() => setIsDepositOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
                <Plus className="w-4 h-4" />
                Deposit
            </button>
            <button
                onClick={() => setIsWithdrawOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
            >
                <Minus className="w-4 h-4" />
                Withdraw
            </button>

            <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
            <WithdrawModal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} />
        </div>
    );
}

function DepositModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await depositFunds(Number(amount));
            onClose();
            setAmount('');
        } catch (err) {
            setError('Failed to deposit funds. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary" />
                        Deposit Funds
                    </h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Amount ($)</label>
                        <input
                            type="number"
                            min="100"
                            step="100"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none text-2xl font-mono"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="p-3 bg-secondary/20 rounded-lg text-sm text-muted-foreground">
                        <p>Simulated Payment Gateway. Funds will be added instantly for testing.</p>
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Confirm Deposit'}
                    </button>
                </form>
            </div>
        </div>
    );
}

function WithdrawModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [amount, setAmount] = useState('');
    const [iban, setIban] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await withdrawFunds(Number(amount), iban);
            onClose();
            setAmount('');
            setIban('');
        } catch (err: any) {
            setError(err.message || 'Failed to withdraw funds.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-secondary-foreground" />
                        Withdraw Funds
                    </h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Amount ($)</label>
                        <input
                            type="number"
                            min="100"
                            step="0.01"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none text-2xl font-mono"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">IBAN / Bank Details</label>
                        <input
                            type="text"
                            required
                            value={iban}
                            onChange={(e) => setIban(e.target.value)}
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none uppercase"
                            placeholder="IBAN / Account Number"
                        />
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-secondary text-secondary-foreground rounded-lg font-bold hover:bg-secondary/80 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Request Withdrawal'}
                    </button>
                </form>
            </div>
        </div>
    );
}
