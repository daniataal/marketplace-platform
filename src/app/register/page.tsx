'use client';

import { useActionState } from 'react';
import { register } from '@/lib/actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
    const [errorMessage, dispatch] = useActionState(register, undefined);

    return (
        <main className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
            {/* Ambient Lighting Engine */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/5 via-background/0 to-background/0 pointer-events-none z-0" />
            <div className="absolute top-0 right-1/4 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0 opacity-40 mix-blend-screen" />
            <div className="absolute bottom-0 left-1/4 w-[800px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />

            <div className="relative z-10 w-full max-w-md px-4">
                <Link
                    href="/login"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                </Link>

                <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center font-dancing text-2xl font-bold tracking-tight">
                            <span className="text-5xl text-primary">Dore</span>
                            <span className="text-5xl text-white/30">&</span>
                            <span className="text-5xl text-white">Market</span>
                        </div>
                        <h1 className="mt-5 text-2xl font-bold text-foreground">Create Account</h1>
                        <p className="text-muted-foreground mt-2 text-sm">Join the exclusive marketplace</p>
                    </div>

                    <form action={dispatch} className="space-y-4">
                        <div>
                            <label
                                className="block text-sm font-medium text-foreground mb-1.5"
                                htmlFor="name"
                            >
                                Full Name
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium text-foreground mb-1.5"
                                htmlFor="email"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium text-foreground mb-1.5"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Create a password"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div
                            className="flex items-center min-h-[24px]"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            {errorMessage && (
                                <p className="text-sm text-destructive font-medium">{errorMessage}</p>
                            )}
                        </div>

                        <button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium py-2.5 rounded-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            Create Account
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
