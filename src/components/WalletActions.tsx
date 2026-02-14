'use client';

import { useState } from 'react';
import { depositFunds, withdrawFunds } from '@/actions/wallet';
import { Plus, Minus, X, CreditCard, Banknote } from 'lucide-react';

export function WalletActions() {
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

    return (
        <div className="flex gap-2 mt-4">
            <button
                onClick={() => setIsDepositOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 active:scale-95"
            >
                <Plus className="w-4 h-4" />
                Deposit
            </button>
            <button
                onClick={() => setIsWithdrawOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-all active:scale-95"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 transition-all animate-in fade-in duration-200">
            <div
                className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-[101] animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary" />
                        Deposit Funds
                    </h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors p-1 hover:bg-zinc-800 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-zinc-400">Amount ($)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-lg">$</span>
                            <input
                                type="number"
                                min="100"
                                step="100"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full p-4 pl-8 bg-zinc-900/50 rounded-xl text-white border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-2xl font-mono transition-all placeholder:text-zinc-700"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-400">
                        <p className="flex gap-2">
                            <span className="text-lg">💡</span>
                            Simulated Payment Gateway. Funds will be added instantly for testing purposes.
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Confirm Deposit'}
                        </button>
                    </div>
                </form>
            </div>
            {/* Click outside to close */}
            <div className="absolute inset-0 z-[99]" onClick={onClose} />
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 transition-all animate-in fade-in duration-200">
            <div
                className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-[101] animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-zinc-400" />
                        Withdraw Funds
                    </h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors p-1 hover:bg-zinc-800 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-zinc-400">Amount ($)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-lg">$</span>
                            <input
                                type="number"
                                min="100"
                                step="0.01"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full p-4 pl-8 bg-zinc-900/50 rounded-xl text-white border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-2xl font-mono transition-all placeholder:text-zinc-700"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-zinc-400">IBAN / Bank Details</label>
                        <input
                            type="text"
                            required
                            value={iban}
                            onChange={(e) => setIban(e.target.value)}
                            className="w-full p-4 bg-zinc-900/50 rounded-xl text-white border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none uppercase font-mono text-sm placeholder:text-zinc-700"
                            placeholder="IBAN / Account Number"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-zinc-800 text-white rounded-xl font-bold text-lg hover:bg-zinc-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Request Withdrawal'}
                        </button>
                    </div>
                </form>
            </div>
            {/* Click outside to close */}
            <div className="absolute inset-0 z-[99]" onClick={onClose} />
        </div>
    );
}
