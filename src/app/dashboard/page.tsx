import { prisma } from "@/lib/prisma";
import { DealCard } from "@/components/DealCard";
import { RefreshCcw, LogOut, User } from "lucide-react";
import ClientBuyButton from "@/components/ClientBuyWrapper";
import { auth, signOut } from "@/auth";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
    const session = await auth();
    const deals = await prisma.deal.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="min-h-screen bg-background">
            <nav className="bg-card border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">M</span>
                            </div>
                            <span className="text-xl font-bold text-foreground">Marketplace</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-sm text-muted-foreground hidden md:block">
                            {deals.length} Active Deals
                        </div>
                        <div className="flex items-center gap-3 pl-6 border-l border-border">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-medium text-foreground">{session?.user?.name || "Trader"}</div>
                                <div className="text-xs text-muted-foreground">{session?.user?.email}</div>
                            </div>
                            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-secondary-foreground" />
                            </div>
                            <form action={async () => {
                                'use server';
                                await signOut();
                            }}>
                                <button className="p-2 text-muted-foreground hover:text-destructive transition-colors" title="Sign Out">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Markets</h1>
                        <p className="text-muted-foreground mt-1">Real-time commodity listings from verification mines</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                        <RefreshCcw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {deals.length === 0 ? (
                        <div className="col-span-full py-12 text-center border border-dashed border-border rounded-xl">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                                <RefreshCcw className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground">No deals available</h3>
                            <p className="text-muted-foreground mt-1">Waiting for incoming shipments from Mining Map...</p>
                        </div>
                    ) : (
                        deals.map((deal) => (
                            <ClientBuyButton key={deal.id} deal={deal} />
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
