import LoginForm from '@/components/LoginForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
            {/* Ambient Lighting Engine */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/5 via-background/0 to-background/0 pointer-events-none z-0" />
            <div className="absolute top-0 left-1/4 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0 opacity-40 mix-blend-screen" />
            <div className="absolute bottom-0 right-1/4 w-[800px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />

            <div className="relative z-10 w-full max-w-md px-4">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4 shadow-lg shadow-primary/20">
                            <span className="text-white font-bold text-xl">M</span>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
                        <p className="text-muted-foreground mt-2 text-sm">Sign in to access the marketplace</p>
                    </div>
                    <LoginForm />
                </div>

                <p className="text-center mt-6 text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                        Sign up
                    </Link>
                </p>
            </div>
        </main>
    );
}
