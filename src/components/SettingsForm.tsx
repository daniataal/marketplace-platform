'use client';

import { useActionState } from 'react';
import { updateProfile } from '@/lib/actions';

export default function SettingsForm({ user }: { user: any }) {
    const [message, dispatch, isPending] = useActionState(updateProfile, undefined);

    return (
        <form action={dispatch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1" htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        defaultValue={user?.name || ''}
                        className="w-full p-3 bg-secondary/50 rounded-lg text-foreground border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                        placeholder="Enter your full name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1" htmlFor="email">Email Address</label>
                    <div className="p-3 bg-secondary/30 rounded-lg text-muted-foreground border border-transparent cursor-not-allowed">
                        {user?.email}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1" htmlFor="password">New Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className="w-full p-3 bg-secondary/50 rounded-lg text-foreground border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                        placeholder="Leave blank to keep current"
                        minLength={6}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Role</label>
                    <div className="p-3 bg-secondary/30 rounded-lg text-muted-foreground border border-transparent cursor-not-allowed">
                        {user?.role || 'USER'}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">User ID</label>
                    <div className="p-3 bg-secondary/30 rounded-lg text-muted-foreground text-sm font-mono border border-transparent truncate cursor-not-allowed">
                        {user?.id}
                    </div>
                </div>
            </div>

            <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm">
                    {message && (
                        <span className={message.includes('success') ? "text-emerald-500" : "text-destructive"}>
                            {message}
                        </span>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full sm:w-auto bg-primary text-primary-foreground py-2.5 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}
