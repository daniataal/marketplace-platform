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
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 mb-2">
                            {deal.commodity}
                        </span>
                        <h3 className="text-lg font-semibold text-slate-900">{deal.company}</h3>
                    </div>
                    <div className="text-right">
                        <span className="block text-2xl font-bold text-slate-900">${finalPrice.toLocaleString()}</span>
                        <span className="text-sm text-slate-500 line-through">${deal.pricePerKg.toLocaleString()}</span>
                        <span className="ml-2 text-xs font-medium text-emerald-600">-{deal.discount}% OFF</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="block text-xs text-slate-500 uppercase tracking-wider">Quantity</span>
                        <span className="font-medium text-slate-900">{deal.quantity} kg</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="block text-xs text-slate-500 uppercase tracking-wider">Total Value</span>
                        <span className="font-medium text-slate-900">${(deal.quantity * finalPrice).toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => onBuy(deal.id)}
                        disabled={deal.status !== 'OPEN'}
                        className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {deal.status === 'OPEN' ? 'Purchase Deal' : deal.status}
                    </button>
                    <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
