'use client';

import { useActionState } from 'react';
import { register } from '@/lib/actions';

export default function RegisterPage() {
    const [errorMessage, dispatch] = useActionState(register, undefined);

    return (
        <main className="flex items-center justify-center md:h-screen bg-background">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex w-full items-end rounded-lg bg-primary p-3 md:h-36">
                    <div className="w-32 text-white md:w-36 font-bold text-xl">
                        Register
                    </div>
                </div>
                <form action={dispatch} className="space-y-3">
                    <div className="flex-1 rounded-lg bg-card border border-border px-6 pb-4 pt-8 shadow-sm">
                        <h1 className="mb-3 text-2xl font-bold text-foreground">
                            Create an account
                        </h1>
                        <div className="w-full">
                            <div>
                                <label
                                    className="mb-3 mt-5 block text-xs font-medium text-muted-foreground"
                                    htmlFor="name"
                                >
                                    Name
                                </label>
                                <input
                                    className="peer block w-full rounded-md border border-input bg-background py-[9px] pl-3 text-sm outline-none focus:ring-1 focus:ring-primary text-foreground"
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <label
                                    className="mb-3 mt-5 block text-xs font-medium text-muted-foreground"
                                    htmlFor="email"
                                >
                                    Email
                                </label>
                                <input
                                    className="peer block w-full rounded-md border border-input bg-background py-[9px] pl-3 text-sm outline-none focus:ring-1 focus:ring-primary text-foreground"
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <label
                                    className="mb-3 mt-5 block text-xs font-medium text-muted-foreground"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <input
                                    className="peer block w-full rounded-md border border-input bg-background py-[9px] pl-3 text-sm outline-none focus:ring-1 focus:ring-primary text-foreground"
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
                            className="flex h-8 items-end space-x-1"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            {errorMessage && (
                                <p className="text-sm text-destructive">{errorMessage}</p>
                            )}
                        </div>
                        <button className="mt-4 w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors font-medium">
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
