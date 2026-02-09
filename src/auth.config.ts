import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

            // For now, let's protect the dashboard and settings
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            } else if (isLoggedIn) {
                // If logged in and on login/register page, redirect to dashboard
                if (nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")) {
                    return Response.redirect(new URL("/dashboard", nextUrl));
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        }
    },
    providers: [], // Add providers with an outer function
} satisfies NextAuthConfig;
