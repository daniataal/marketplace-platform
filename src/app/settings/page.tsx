import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/SettingsForm";
import Navbar from "@/components/Navbar";

export default async function SettingsPage() {
    const session = await auth();
    const user = session?.user?.email
        ? await prisma.user.findUnique({ where: { email: session.user.email } })
        : session?.user;

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Ambient Lighting Engine */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/5 via-background/0 to-background/0 pointer-events-none z-0" />
            <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none z-0 opacity-40" />

            <Navbar user={session?.user} />

            <main className="max-w-4xl mx-auto px-4 py-12 relative z-10">
                <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

                <div className="bg-card/50 backdrop-blur-xl border border-white/5 rounded-xl shadow-2xl overflow-hidden">
                    <div className="px-8 py-6 border-b border-white/5 bg-white/5">
                        <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
                        <p className="text-sm text-muted-foreground mt-1">Update your account details and password</p>
                    </div>
                    <div className="p-8">
                        <SettingsForm user={user} />
                    </div>
                </div>
            </main>
        </div>
    );
}
