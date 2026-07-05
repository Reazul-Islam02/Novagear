'use client';

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { SeedInitializer } from "./SeedInitializer";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                {children}
                <SeedInitializer />
                <Toaster position="top-center" richColors />
            </ThemeProvider>
        </SessionProvider>
    );
}
