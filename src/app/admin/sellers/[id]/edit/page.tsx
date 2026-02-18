'use client';

import { useActionState, useEffect, useState, use } from 'react';
import { updateSeller, getSellerIdentity, deleteSeller } from '@/lib/actions';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SellerLogo } from '@/components/admin/SellerLogo';

export default function EditSellerPage() {
    const params = useParams();
    const id = params?.id as string;

    const [seller, setSeller] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const updateSellerWithId = updateSeller.bind(null, id);
    const deleteSellerWithId = deleteSeller.bind(null, id);
    const [state, dispatch] = useActionState(updateSellerWithId, "");
    const [deleteState, deleteAction] = useActionState(deleteSellerWithId, { message: '' });

    useEffect(() => {
        if (!id) return;
        getSellerIdentity(id).then(data => {
            setSeller(data);
            setIsLoading(false);
        });
    }, [id]);

    if (isLoading) {
        return <div className="p-10 text-center">Loading seller details...</div>;
    }

    if (!seller) {
        return <div className="p-10 text-center text-destructive">Seller not found</div>;
    }

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <div className="mb-8">
                <Link
                    href="/admin/deals/create"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Selection
                </Link>
                <h1 className="text-3xl font-bold text-foreground">Edit Seller</h1>
                <p className="text-muted-foreground mt-1">Update seller identity defaults</p>
            </div>

            <form action={dispatch} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Company Name</label>
                    <input
                        name="companyName"
                        required
                        defaultValue={seller.companyName}
                        className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Internal Alias (Optional)</label>
                    <input
                        name="alias"
                        defaultValue={seller.alias || ''}
                        className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                    />
                </div>

                <div className="space-y-4 bg-secondary/10 p-4 rounded-lg border border-border/50">
                    <label className="block text-sm font-medium text-foreground">Company Logo</label>

                    {seller.logo && (
                        <div className="mb-4 flex flex-col items-center p-4 bg-secondary/30 rounded-lg border border-border/50 w-fit">
                            <SellerLogo src={seller.logo} companyName={seller.companyName} className="w-24 h-24" />
                            <p className="text-xs text-muted-foreground mt-2 font-medium">Current Logo</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Upload New Image File</label>
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
                            defaultValue={seller.logo || ''}
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
                            defaultValue={seller.originCountry || ''}
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Origin Port</label>
                        <input
                            name="originPort"
                            defaultValue={seller.originPort || ''}
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Business Address</label>
                    <input
                        name="address"
                        defaultValue={seller.address || ''}
                        className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Trade License No.</label>
                        <input
                            name="tradeLicense"
                            defaultValue={seller.tradeLicense || ''}
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Representative Name</label>
                        <input
                            name="representative"
                            defaultValue={seller.representative || ''}
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Passport Number</label>
                        <input
                            name="passportNumber"
                            defaultValue={seller.passportNumber || ''}
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Passport Expiry</label>
                        <input
                            name="passportExpiry"
                            defaultValue={seller.passportExpiry || ''}
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Country</label>
                        <input
                            name="country"
                            defaultValue={seller.country || ''}
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Telephone</label>
                        <input
                            name="telephone"
                            defaultValue={seller.telephone || ''}
                            className="w-full p-3 bg-secondary/30 rounded-lg text-foreground border border-transparent focus:border-primary outline-none"
                        />
                    </div>
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            defaultValue={seller.email || ''}
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
                    Save Changes
                </button>
            </form>

            <div className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground">Permanently remove this seller.</p>
                    </div>
                    <form action={deleteAction}>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors font-medium flex items-center gap-2 border border-destructive/20"
                            onClick={(e) => {
                                if (!confirm('Are you sure? This cannot be undone.')) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Seller
                        </button>
                        {deleteState?.message && <p className="text-sm text-destructive mt-2">{deleteState.message}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}
