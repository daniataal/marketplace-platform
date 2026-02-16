'use client';

import { Wallet, TrendingUp, CreditCard } from "lucide-react";
import { WalletActions } from "./WalletActions";

interface WalletData {
    balance: number;
    portfolioValue: number;
    dealsCount: number;
}

export function WalletCard({ initialData }: { initialData: WalletData }) {
    const totalValue = initialData.balance + initialData.portfolioValue;

    return (
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden group">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-1000" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4 min-w-0">
                        <p className="text-[10px] sm:text-xs font-black text-zinc-500 uppercase tracking-[0.4em]">Total Net Worth</p>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-widest tabular-nums truncate leading-none" title={`$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}>
                            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="pt-0">
                            <WalletActions />
                        </div>
                        <div className="p-4 bg-zinc-800/80 backdrop-blur-md rounded-2xl border border-white/5 text-primary shadow-2xl shrink-0 group-hover:scale-110 transition-transform duration-500 hidden sm:block">
                            <Wallet className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    <div className="p-8 rounded-[2rem] bg-zinc-800/30 border border-white/5 hover:bg-zinc-800/50 transition-all duration-500 group/card overflow-hidden flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover/card:scale-110 transition-transform shrink-0">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] whitespace-nowrap">Available Balance</span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-white/70 tracking-widest tabular-nums truncate" title={`$${initialData.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}>
                            ${initialData.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-zinc-800/30 border border-white/5 hover:bg-zinc-800/50 transition-all duration-500 group/card overflow-hidden flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 group-hover/card:scale-110 transition-transform shrink-0">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] whitespace-nowrap">Portfolio Value</span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-white/70 tracking-widest tabular-nums truncate" title={`$${initialData.portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}>
                            ${initialData.portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
