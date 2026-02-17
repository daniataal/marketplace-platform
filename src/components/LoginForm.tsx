'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';

export default function LoginForm() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);

    return (
        <form action={dispatch} className="space-y-4">
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
                        placeholder="Enter your password"
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
            <LoginButton />
        </form>
    );
}

import { useFormStatus } from 'react-dom';

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium py-2.5 rounded-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
            {pending ? 'Signing In...' : 'Sign In'}
        </button>
    );
}
