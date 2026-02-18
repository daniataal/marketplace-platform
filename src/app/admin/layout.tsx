'use client';

import Link from "next/link";
import { LayoutDashboard, PlusCircle, LogOut, Settings, FileCheck, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const navLinks = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/deals/create", label: "Create Deal", icon: PlusCircle },
        { href: "/admin/exports", label: "Pending Exports", icon: FileCheck },
        { href: "/admin/users", label: "Manage Users", icon: LayoutDashboard },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-50">
                <div className="flex items-center font-dancing text-xl font-bold tracking-tight">
                    <span className="text-primary">Dore</span>
                    <span className="text-white/30">&</span>
                    <span className="text-white">Market</span>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                >
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 transform
                md:relative md:translate-x-0 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 border-b border-border hidden md:block">
                    <div className="flex items-center font-dancing text-2xl font-bold tracking-tight">
                        <span className="text-primary">Dore</span>
                        <span className="text-white/30">&</span>
                        <span className="text-white">Market</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/50 hover:text-foreground rounded-lg transition-colors"
                        >
                            <link.icon className="w-5 h-5" />
                            {link.label}
                        </Link>
                    ))}

                    <Link
                        href="/dashboard"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-primary hover:bg-primary/10 transition-colors mt-4 border-t border-border pt-4"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Back to Dore & Market
                    </Link>
                </nav>

                <div className="p-4 border-t border-border mt-auto">
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors w-full"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full overflow-x-hidden">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
