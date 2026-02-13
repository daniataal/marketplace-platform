'use client';

import { useActionState } from 'react';
import { adminCreateUser } from '@/lib/actions';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function CreateUserForm() {
    const [state, dispatch, isPending] = useActionState(adminCreateUser, undefined);

    return (
        <div className="max-w-2xl mx-auto py-10">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/users" className="p-2 hover:bg-secondary rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Create New User</h1>
                    <p className="text-muted-foreground mt-1">Manually add a user to the platform</p>
                </div>
            </div>

            <form action={dispatch} className="bg-card border border-border rounded-xl p-8 shadow-sm space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">Full Name</label>
                    <input
                        name="name"
                        type="text"
                        required
                        className="w-full p-3 bg-secondary/50 rounded-lg text-foreground border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="e.g. Jane Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">Email Address</label>
                    <input
                        name="email"
                        type="email"
                        required
                        className="w-full p-3 bg-secondary/50 rounded-lg text-foreground border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="e.g. jane@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">Password</label>
                    <input
                        name="password"
                        type="text" // Visible for admin convenience
                        required
                        minLength={6}
                        className="w-full p-3 bg-secondary/50 rounded-lg text-foreground border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
                        placeholder="Minimum 6 characters"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">Role</label>
                    <select
                        name="role"
                        defaultValue="USER"
                        className="w-full p-3 bg-secondary/50 rounded-lg text-foreground border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
                    >
                        <option value="USER">User (Standard)</option>
                        <option value="ADMIN">Administrator</option>
                    </select>
                </div>

                {state && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive font-medium">
                        Error: {state}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        'Creating User...'
                    ) : (
                        <>
                            <UserPlus className="w-5 h-5" />
                            Create User
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
