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
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-12 sm:p-16 lg:p-20 shadow-2xl relative overflow-hidden group min-h-[550px] flex flex-col justify-center">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-1000" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 space-y-16">
                <div className="flex items-start justify-between gap-8">
                    <div className="space-y-4 min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-black text-zinc-500 uppercase tracking-[0.4em]">Total Net Worth</p>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-widest tabular-nums truncate leading-none" title={`$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}>
                            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                    </div>
                    <div className="p-5 bg-zinc-800/80 backdrop-blur-md rounded-3xl border border-white/5 text-primary shadow-2xl shrink-0 group-hover:scale-110 transition-transform duration-500">
                        <Wallet className="w-10 h-10 sm:w-12 sm:h-12" />
                    </div>
                </div>

                <div className="pt-4">
                    <WalletActions />
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <div className="p-8 rounded-[2rem] bg-zinc-800/30 border border-white/5 hover:bg-zinc-800/50 transition-all duration-500 group/card overflow-hidden flex flex-col justify-center min-h-[120px]">
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

                    <div className="p-8 rounded-[2rem] bg-zinc-800/30 border border-white/5 hover:bg-zinc-800/50 transition-all duration-500 group/card overflow-hidden flex flex-col justify-center min-h-[120px]">
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
