'use client';

import { TrendingUp, TrendingDown, Activity, Info, RefreshCcw, Gauge } from "lucide-react";
import { useEffect, useState } from "react";

interface MarketData {
    price: number;
    change24h: number;
    changePercent24h: number;
    high24h: number;
    low24h: number;
    volatility: 'Low' | 'Medium' | 'High';
    sentiment: 'Bullish' | 'Stable' | 'Bearish';
    path: string;
    areaPath: string;
}

export function MarketIntelligence({ currentPrice }: { currentPrice: number }) {
    const [data, setData] = useState<MarketData | null>(null);

    useEffect(() => {
        const basePrice = currentPrice;
        const mockChange = (Math.random() * 2 - 1) * 0.005 * basePrice;

        // Generate a stable smooth path for the sparkline
        const points = Array.from({ length: 10 }, (_, i) => ({
            x: (i / 9) * 100,
            y: 30 + Math.random() * 40
        }));

        // Ensure last point matches sentiment
        points[9].y = mockChange >= 0 ? 25 : 75;

        const path = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
        const areaPath = `${path} V 100 H 0 Z`;

        setData({
            price: basePrice,
            change24h: mockChange,
            changePercent24h: (mockChange / basePrice) * 100,
            high24h: basePrice * (1 + Math.random() * 0.01),
            low24h: basePrice * (1 - Math.random() * 0.01),
            volatility: Math.random() > 0.7 ? 'High' : 'Medium',
            sentiment: mockChange > 0 ? 'Bullish' : 'Bearish',
            path,
            areaPath
        });
    }, [currentPrice]);

    if (!data) return null;

    const isPositive = data.change24h >= 0;

    return (
        <div className="bg-card/10 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group max-h-[500px] flex flex-col">
            {/* Background Ambient Glow */}
            <div className={`absolute top-0 right-0 w-64 h-64 ${isPositive ? 'bg-emerald-500/10' : 'bg-rose-500/10'} rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-colors duration-1000`} />

            <div className="relative z-10 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Market Intelligence</h3>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Real-time Terminal</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/20 border border-white/5 backdrop-blur-md">
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isPositive ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`} />
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Live Feed</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-6">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest opacity-50">24h Performance</p>
                        <div className={`flex items-center gap-2 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                            <div className={`p-1 rounded-lg ${isPositive ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            </div>
                            <span className="text-2xl font-black tabular-nums tracking-tight">
                                {isPositive ? '+' : ''}{data.changePercent24h.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest opacity-50">Global Sentiment</p>
                        <div className="flex items-center gap-2 text-white">
                            <div className="p-1 rounded-lg bg-primary/10">
                                <Gauge className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-2xl font-black tracking-tight">{data.sentiment}</span>
                        </div>
                    </div>
                </div>

                {/* Animated Sparkline */}
                <div className="relative h-[140px] mb-6 bg-card/20 rounded-[2rem] border border-white/5 overflow-hidden flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="chart-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity="0.2" />
                                <stop offset="100%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            d={data.areaPath}
                            fill="url(#chart-gradient)"
                            className="transition-all duration-1000 ease-in-out"
                        />
                        <path
                            d={data.path}
                            fill="none"
                            stroke={isPositive ? '#10b981' : '#f43f5e'}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-all duration-1000 ease-in-out drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                        />
                    </svg>
                    <div className="absolute top-4 left-4 flex gap-4">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-zinc-600 uppercase">Volatility</span>
                            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{data.volatility}</span>
                        </div>
                    </div>
                    <div className="absolute bottom-4 left-6 right-6 flex justify-between text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                        <span>T-24H</span>
                        <span>ACTUAL</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-card/10 border border-white/5 space-y-2 hover:bg-card/20 transition-colors group/stat">
                        <div className="flex items-center justify-between">
                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">Day High</p>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20 group-hover/stat:bg-emerald-500/40 transition-colors" />
                        </div>
                        <p className="text-sm font-bold text-white tabular-nums">${data.high24h.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-card/10 border border-white/5 space-y-2 hover:bg-card/20 transition-colors group/stat">
                        <div className="flex items-center justify-between">
                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">Day Low</p>
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500/20 group-hover/stat:bg-rose-500/40 transition-colors" />
                        </div>
                        <p className="text-sm font-bold text-white tabular-nums">${data.low24h.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5">
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-card/20">
                            <Info className="w-4 h-4 text-zinc-500" />
                        </div>
                        <p className="text-[11px] font-medium leading-[1.6] text-zinc-400">
                            Market summary: Current price action is <span className="text-white font-bold">{data.sentiment.toLowerCase()}</span>.
                            Expect <span className="text-white font-bold">{data.volatility.toLowerCase()}</span> volatility for the upcoming European session.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
