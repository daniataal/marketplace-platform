import { auth } from "@/auth";

export default async function SettingsPage() {
    const session = await auth();

    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-border bg-muted/30">
                        <h2 className="text-lg font-medium text-foreground">Profile Information</h2>
                        <p className="text-sm text-muted-foreground">Your account details</p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                                <div className="p-3 bg-muted/50 rounded-lg text-foreground border border-transparent">
                                    {session?.user?.name}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Email Address</label>
                                <div className="p-3 bg-muted/50 rounded-lg text-foreground border border-transparent">
                                    {session?.user?.email}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Role</label>
                                <div className="p-3 bg-muted/50 rounded-lg text-foreground border border-transparent">
                                    USER
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">User ID</label>
                                <div className="p-3 bg-muted/50 rounded-lg text-muted-foreground text-sm font-mono border border-transparent truncate">
                                    {session?.user?.id}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
