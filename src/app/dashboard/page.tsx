import { prisma } from "@/lib/prisma";
import { DealCard } from "@/components/DealCard";
import { RefreshCcw, LogOut, User } from "lucide-react";
import ClientBuyButton from "@/components/ClientBuyWrapper";
import { auth, signOut } from "@/auth";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
    const session = await auth();
    const deals = await prisma.deal.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Ambient Lighting Engine */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/5 via-background/0 to-background/0 pointer-events-none z-0" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0 opacity-40 mix-blend-screen" />
            <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen" />
            <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />

            <Navbar user={session?.user} />

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
