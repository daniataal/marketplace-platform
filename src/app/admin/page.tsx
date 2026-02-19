import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DeleteDealButton } from "@/components/admin/DeleteDealButton";
import { PlusCircle, Pencil, ShoppingBag } from "lucide-react";
import { Deal } from "@prisma/client";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const deals = await prisma.deal.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage platform deals and users</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Link
                        href="/admin/purchases"
                        className="flex items-center justify-center gap-2 bg-secondary text-foreground px-4 py-2.5 rounded-lg hover:bg-secondary/80 transition-colors font-medium border border-border"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Manage Logistics
                    </Link>
                    <Link
                        href="/admin/deals/create"
                        className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-lg shadow-primary/20"
                    >
                        <PlusCircle className="w-4 h-4" />
                        New Deal
                    </Link>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[600px]">
                        <thead className="bg-secondary/30 border-b border-border">
                            <tr>
                                <th className="px-4 md:px-6 py-4 font-medium text-muted-foreground">Company</th>
                                <th className="px-4 md:px-6 py-4 font-medium text-muted-foreground">Commodity</th>
                                <th className="px-4 md:px-6 py-4 font-medium text-muted-foreground">Quantity</th>
                                <th className="px-4 md:px-6 py-4 font-medium text-muted-foreground">Price/kg</th>
                                <th className="px-4 md:px-6 py-4 font-medium text-muted-foreground">Status</th>
                                <th className="px-4 md:px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {deals.map((deal: Deal) => (
                                <tr key={deal.id} className="hover:bg-secondary/10 transition-colors">
                                    <td className="px-4 md:px-6 py-4 font-medium text-foreground">{deal.company}</td>
                                    <td className="px-4 md:px-6 py-4 text-foreground">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                            {deal.commodity}
                                        </span>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-muted-foreground">{deal.quantity} kg</td>
                                    <td className="px-4 md:px-6 py-4 text-muted-foreground">${deal.pricePerKg.toLocaleString()}</td>
                                    <td className="px-4 md:px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${deal.status === 'OPEN'
                                            ? 'bg-emerald-500/10 text-emerald-500'
                                            : 'bg-muted text-muted-foreground'
                                            }`}>
                                            {deal.status}
                                        </span>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 md:gap-2">
                                            <Link
                                                href={`/admin/deals/${deal.id}/edit`}
                                                className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                                                title="Edit Deal"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <DeleteDealButton id={deal.id} title={deal.company} hasPurchases={false} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {deals.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                        No deals found. Create one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
