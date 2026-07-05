import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb"
import { authConfig } from "@/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const client = await clientPromise
                const db = client.db()
                const user = await db.collection("users").findOne({ email: credentials.email as string })

                if (!user || !user.password) {
                    return null
                }

                const isPasswordMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (!isPasswordMatch) return null

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image || "https://github.com/shadcn.png",
                }
            },
        }),
    ],
})
