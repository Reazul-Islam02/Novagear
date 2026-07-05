"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Store, Package, ShoppingCart, TrendingUp, BarChart3,
    Settings, Bell, MessageSquare, Globe, DollarSign,
    Home, Users, FileText, LogOut, Megaphone, LayoutDashboard, Menu, X,
} from "lucide-react";
import { useState } from "react";

const sidebarLinks = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/seller-account/dashboard" },
    { name: "Products", icon: Package, href: "/seller-account/products" },
    { name: "Orders", icon: ShoppingCart, href: "/seller-account/orders" },
    { name: "Marketing Center", icon: Megaphone, href: "/seller-account/marketing" },
    { name: "Advertising", icon: TrendingUp, href: "/seller-account/advertising" },
    { name: "Analytics", icon: BarChart3, href: "/seller-account/analytics" },
    { name: "Finance", icon: DollarSign, href: "/seller-account/finance" },
    { name: "Store Settings", icon: Store, href: "/seller-account/store-settings" },
    { name: "My Account", icon: Users, href: "/seller-account/my-account" },
];

export function SellerLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-56 border-r border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/80 min-h-screen fixed left-0 top-0 z-40">
                <div className="p-4 border-b border-zinc-200 dark:border-white/5">
                    <Link href="/seller-account/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                            <Store className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <p className="font-black text-sm text-orange-500">NovaGear</p>
                            <p className="text-[9px] text-zinc-500 font-bold tracking-wider">SELLER CENTER</p>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors
                                    ${isActive
                                        ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500"
                                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"}`}
                            >
                                <link.icon className="h-4 w-4 flex-shrink-0" />
                                <span className="flex-1">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-zinc-200 dark:border-white/5">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <Home className="h-3.5 w-3.5" />
                        Back to Store
                    </Link>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
                    <aside className="relative w-64 h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-white/5 flex flex-col">
                        <div className="p-4 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between">
                            <Link href="/seller-account/dashboard" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                                    <Store className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="font-black text-sm text-orange-500">NovaGear</p>
                                    <p className="text-[9px] text-zinc-500 font-bold tracking-wider">SELLER CENTER</p>
                                </div>
                            </Link>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileMenuOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
                            {sidebarLinks.map((link) => {
                                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors
                                            ${isActive
                                                ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500"
                                                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"}`}
                                    >
                                        <link.icon className="h-4 w-4 flex-shrink-0" />
                                        <span className="flex-1">{link.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="p-3 border-t border-zinc-200 dark:border-white/5">
                            <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
                                <Home className="h-3.5 w-3.5" />
                                Back to Store
                            </Link>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-56">
                {/* Top Bar */}
                <header className="h-14 border-b border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 rounded-lg" onClick={() => setMobileMenuOpen(true)}>
                            <Menu className="h-4 w-4" />
                        </Button>
                        <div className="hidden lg:flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                <Store className="h-4 w-4 text-orange-500" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Seller Center</p>
                                <p className="text-[10px] text-zinc-500">{session?.user?.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline text-xs text-zinc-500 mr-2">
                            {session?.user?.name}
                        </span>
                        <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8 relative">
                            <Bell className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8">
                            <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Avatar className="h-8 w-8 border border-zinc-200 dark:border-white/10">
                            <AvatarImage src={session?.user?.image || ""} />
                            <AvatarFallback className="bg-orange-500/20 text-orange-600 text-xs font-bold">
                                {session?.user?.name?.charAt(0) || "S"}
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-lg h-8 w-8 text-zinc-500 hover:text-red-500"
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
