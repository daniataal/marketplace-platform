'use client';

import { useState, useEffect } from "react";
import { Wallet, TrendingUp, CreditCard, ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";
import { WalletActions } from "./WalletActions";

interface WalletData {
    balance: number;
    portfolioValue: number;
    dealsCount: number;
}

export function WalletCard({ initialData }: { initialData: WalletData }) {
    const [isMinimized, setIsMinimized] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('wallet-minimized');
        if (saved !== null) setIsMinimized(JSON.parse(saved));
    }, []);

    const toggleMinimize = () => {
        const newState = !isMinimized;
        setIsMinimized(newState);
        localStorage.setItem('wallet-minimized', JSON.stringify(newState));
    };

    const totalValue = initialData.balance + initialData.portfolioValue;

    const formatPremiumCurrency = (value: number, wholeSize: string, decimalSize: string, opacity: string = "opacity-40") => {
        const parts = value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).split('.');

        return (
            <span className="inline-flex items-baseline gap-1">
                <span className={wholeSize}>${parts[0]}</span>
                <span className={`${decimalSize} ${opacity} font-medium tracking-normal`}>.{parts[1]}</span>
                <span className={`text-[10px] ml-1 uppercase tracking-widest ${opacity} font-black`}>USD</span>
            </span>
        );
    };

    return (
        <div className={`bg-card/10 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden group transition-all duration-500 ease-in-out ${isMinimized ? 'rounded-[2rem] p-6' : 'rounded-[3rem] p-8 sm:p-10'}`}>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-1000" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            {/* Minimize Toggle */}
            <button
                onClick={toggleMinimize}
                className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all duration-300"
            >
                {isMinimized ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
            </button>

            <div className={`relative z-10 transition-all duration-500 ${isMinimized ? 'space-y-4' : 'space-y-10'}`}>
                <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 ${isMinimized ? 'md:gap-10 pr-14' : 'gap-10'}`}>
                    <div className="space-y-2 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            {!isMinimized && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]" />}
                            <p className={`${isMinimized ? 'text-[9px]' : 'text-[11px]'} font-black text-zinc-500 uppercase tracking-[0.4em]`}>Total Net Worth</p>
                        </div>
                        <h2 className="text-white tabular-nums leading-none tracking-tight">
                            {isMinimized
                                ? formatPremiumCurrency(totalValue, "text-3xl sm:text-4xl font-black", "text-xl sm:text-2xl")
                                : formatPremiumCurrency(totalValue, "text-5xl sm:text-6xl lg:text-8xl font-black", "text-3xl sm:text-4xl lg:text-5xl")
                            }
                        </h2>
                    </div>

                    <div className={`flex items-center gap-4 bg-zinc-950/40 backdrop-blur-2xl p-2 rounded-[2.5rem] border border-white/5 shadow-2xl transition-all duration-500 ${isMinimized ? '' : 'p-2.5'}`}>
                        <WalletActions />
                        {!isMinimized && (
                            <div className="p-4 bg-primary text-white rounded-3xl shadow-[0_0_30px_rgba(244,63,94,0.4)] shrink-0 group-hover:scale-105 transition-all duration-500 hidden sm:flex items-center justify-center border border-white/10">
                                <Wallet className="w-7 h-7" />
                            </div>
                        )}
                    </div>
                </div>

                {!isMinimized && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="p-8 rounded-[2.5rem] bg-card/20 border border-white/5 hover:bg-card/30 transition-all duration-500 group/card overflow-hidden flex flex-col justify-center">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 group-hover/card:scale-110 transition-transform shrink-0 border border-amber-500/20">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] whitespace-nowrap">Available Balance</span>
                            </div>
                            <div className="text-white tabular-nums">
                                {formatPremiumCurrency(initialData.balance, "text-3xl sm:text-4xl font-black", "text-lg sm:text-xl", "opacity-30")}
                            </div>
                        </div>

                        <div className="p-8 rounded-[2.5rem] bg-card/20 border border-white/5 hover:bg-card/30 transition-all duration-500 group/card overflow-hidden flex flex-col justify-center">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 group-hover/card:scale-110 transition-transform shrink-0 border border-amber-500/20">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] whitespace-nowrap">Portfolio Value</span>
                            </div>
                            <div className="text-white tabular-nums">
                                {formatPremiumCurrency(initialData.portfolioValue, "text-3xl sm:text-4xl font-black", "text-lg sm:text-xl", "opacity-30")}
                            </div>
                        </div>
                    </div>
                )}

                {isMinimized && (
                    <div className="flex items-center gap-6 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-3.5 h-3.5 text-zinc-500" />
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Balance:</span>
                            <span className="text-xs font-bold text-white">${initialData.balance.toLocaleString()}</span>
                        </div>
                        <div className="w-px h-3 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-3.5 h-3.5 text-zinc-500" />
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Portfolio:</span>
                            <span className="text-xs font-bold text-white">${initialData.portfolioValue.toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
