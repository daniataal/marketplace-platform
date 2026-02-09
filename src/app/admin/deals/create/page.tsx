'use client';

import { useActionState } from 'react';
import { createDeal } from '@/lib/actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CreateDealPage() {
    const [errorMessage, dispatch] = useActionState(createDeal, undefined);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link href="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-foreground">Create New Deal</h1>
                <p className="text-muted-foreground mt-1">Manually list a commodity deal</p>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm p-6">
                <form action={dispatch} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1" htmlFor="company">Company Name</label>
                        <input
                            type="text"
                            name="company"
                            id="company"
                            required
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                            placeholder="e.g. Acme Mining Corp"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1" htmlFor="commodity">Commodity</label>
                            <select
                                name="commodity"
                                id="commodity"
                                className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                            >
                                <option value="Gold">Gold</option>
                                <option value="Silver">Silver</option>
                                <option value="Copper">Copper</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1" htmlFor="quantity">Quantity (kg)</label>
                            <input
                                type="number"
                                name="quantity"
                                id="quantity"
                                required
                                min="0.1"
                                step="0.1"
                                className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1" htmlFor="pricePerKg">Price per kg ($)</label>
                            <input
                                type="number"
                                name="pricePerKg"
                                id="pricePerKg"
                                required
                                min="0"
                                step="0.01"
                                className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1" htmlFor="discount">Discount (%)</label>
                            <input
                                type="number"
                                name="discount"
                                id="discount"
                                required
                                min="0"
                                max="100"
                                step="0.1"
                                defaultValue="0"
                                className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                        {errorMessage && (
                            <p className="text-sm text-destructive mb-4">{errorMessage}</p>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
                        >
                            Create Deal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
