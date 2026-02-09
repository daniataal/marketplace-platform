import React from 'react';
import { Share2, ShoppingCart } from 'lucide-react';

interface DealProps {
    deal: {
        id: string;
        company: string;
        commodity: string;
        quantity: number;
        pricePerKg: number;
        discount: number;
        status: string;
    };
    onBuy: (id: string) => void;
}

export function DealCard({ deal, onBuy }: DealProps) {
    const finalPrice = deal.pricePerKg * (1 - deal.discount / 100);

    return (
        <div className="group relative rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary via-accent to-secondary opacity-20 group-hover:opacity-40 transition-opacity" />

            <div className="relative h-full bg-card rounded-xl p-1 m-[1px] overflow-hidden">
                <div className="h-full bg-gradient-to-br from-background to-secondary/30 rounded-lg p-5">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3 shadow-[0_0_10px_rgba(220,38,38,0.2)]">
                                {deal.commodity}
                            </div>
                            <h3 className="text-xl font-bold text-foreground tracking-tight">{deal.company}</h3>
                        </div>
                        <div className="text-right">
                            <span className="block text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                ${finalPrice.toLocaleString()}
                            </span>
                            <div className="flex items-center justify-end gap-2 text-sm">
                                <span className="text-muted-foreground line-through decoration-destructive/50">
                                    ${deal.pricePerKg.toLocaleString()}
                                </span>
                                <span className="text-accent font-medium">-{deal.discount}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="p-3 bg-secondary/30 rounded-lg border border-white/5">
                            <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Quantity</span>
                            <span className="font-mono text-lg text-foreground">{deal.quantity} <span className="text-sm text-muted-foreground">kg</span></span>
                        </div>
                        <div className="p-3 bg-secondary/30 rounded-lg border border-white/5">
                            <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Value</span>
                            <span className="font-mono text-lg text-foreground">${(deal.quantity * finalPrice).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-auto">
                        <button
                            onClick={() => onBuy(deal.id)}
                            disabled={deal.status !== 'OPEN'}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:to-primary text-white py-3 px-4 rounded-lg font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            {deal.status === 'OPEN' ? 'Purchase Deal' : deal.status}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
