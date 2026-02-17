'use client';

import { useActionState } from 'react';
import { createSeller } from '@/lib/actions';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function CreateSellerPage() {
    const initialState = "";
    const [state, dispatch] = useActionState(createSeller, initialState);

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <div className="mb-8">
                <Link
                    href="/admin/deals/create"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Deals
                </Link>
                <h1 className="text-3xl font-bold text-foreground">Create New Seller</h1>
                <p className="text-muted-foreground mt-1">Register a new seller identity for deals</p>
            </div>

            <form action={dispatch} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Company Name</label>
                    <input
                        name="companyName"
                        required
                        className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                        placeholder="e.g. Acme Mining Corp"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Internal Alias (Optional)</label>
                    <input
                        name="alias"
                        className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                        placeholder="e.g. Main Supplier - Uganda"
                    />
                </div>

                <div className="space-y-4 bg-secondary/10 p-4 rounded-lg border border-border/50">
                    <label className="block text-sm font-medium text-foreground">Company Logo</label>

                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Upload Image File</label>
                        <input
                            type="file"
                            name="logoFile"
                            accept="image/*"
                            className="w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or use URL</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Image URL</label>
                        <input
                            name="logo"
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none text-sm"
                            placeholder="https://example.com/logo.png"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Origin Country</label>
                        <input
                            name="originCountry"
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                            placeholder="e.g. Uganda"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Origin Port</label>
                        <input
                            name="originPort"
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                            placeholder="e.g. Kampala"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Business Address</label>
                    <input
                        name="address"
                        className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                        placeholder="Full Address"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Trade License No.</label>
                        <input
                            name="tradeLicense"
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Representative Name</label>
                        <input
                            name="representative"
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Passport Number</label>
                        <input
                            name="passportNumber"
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Passport Expiry</label>
                        <input
                            name="passportExpiry"
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                            placeholder="DD/MM/YYYY"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Country</label>
                        <input
                            name="country"
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Telephone</label>
                        <input
                            name="telephone"
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                        />
                    </div>
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                        />
                    </div>
                </div>

                {state && <p className="text-sm text-destructive">{state}</p>}

                <button
                    type="submit"
                    className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                    <Save className="w-5 h-5" />
                    Save Seller Profile
                </button>
            </form>
        </div>
    );
}
