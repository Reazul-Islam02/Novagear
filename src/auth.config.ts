import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    trustHost: true,
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isProtectedRoute = nextUrl.pathname.startsWith("/add-product") ||
                nextUrl.pathname.startsWith("/manage-products") ||
                nextUrl.pathname.startsWith("/seller-account")

            if (isProtectedRoute) {
                if (isLoggedIn) return true
                return false
            }
            return true
        },
    },
    providers: [],
} satisfies NextAuthConfig
