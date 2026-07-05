"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SellerLayout } from "@/components/SellerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
    BarChart3, TrendingUp, TrendingDown, Eye, ShoppingCart,
    DollarSign, Users, Package, MousePointerClick, ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
    const { status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState({ totalProducts: 0, totalRevenue: 0, pendingOrders: 0, totalOrders: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") { router.push("/login"); return; }
        if (status === "authenticated") fetchData();
    }, [status, router]);

    async function fetchData() {
        try {
            const res = await fetch("/api/seller/dashboard");
            if (res.status === 403) { router.push("/seller-account"); return; }
            const data = await res.json();
            setStats(data.stats);
        } catch { toast.error("Failed to load analytics"); }
        finally { setLoading(false); }
    }

    if (loading) {
        return <SellerLayout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" /></div></SellerLayout>;
    }

    const analyticsCards = [
        { title: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, change: "+12.5%", up: true, icon: DollarSign, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
        { title: "Total Orders", value: stats.totalOrders, change: "+8.2%", up: true, icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
        { title: "Products Listed", value: stats.totalProducts, change: "+3", up: true, icon: Package, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
        { title: "Pending Orders", value: stats.pendingOrders, change: "0", up: false, icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
    ];

    const performanceMetrics = [
        { label: "Store Visits", value: "0", desc: "Total visits this month" },
        { label: "Conversion Rate", value: "0%", desc: "Visitors who purchased" },
        { label: "Avg. Order Value", value: stats.totalOrders > 0 ? `$${(stats.totalRevenue / stats.totalOrders).toFixed(2)}` : "$0", desc: "Average revenue per order" },
        { label: "Customer Rating", value: "N/A", desc: "Average product rating" },
    ];

    return (
        <SellerLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-black">Analytics & Insights</h1>
                <p className="text-sm text-zinc-500">Track your store performance and growth metrics</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {analyticsCards.map((card, i) => (
                    <motion.div key={card.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                                        <card.icon className={`h-5 w-5 ${card.color}`} />
                                    </div>
                                    <span className={`text-xs font-bold flex items-center gap-0.5 ${card.up ? "text-green-500" : "text-zinc-400"}`}>
                                        {card.up && <ArrowUpRight className="h-3 w-3" />}
                                        {card.change}
                                    </span>
                                </div>
                                <p className="text-2xl font-black">{card.value}</p>
                                <p className="text-xs text-zinc-500 mt-1">{card.title}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Revenue Chart Placeholder */}
            <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl mb-6">
                <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-orange-500" />
                        Revenue Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-xl">
                        <div className="text-center">
                            <BarChart3 className="h-10 w-10 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
                            <p className="text-sm font-bold text-zinc-400">Revenue Chart</p>
                            <p className="text-xs text-zinc-500 mt-1">Charts will appear as you get more sales data</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl mb-6">
                <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                        Performance Metrics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {performanceMetrics.map((m) => (
                            <div key={m.label} className="p-4 rounded-xl bg-zinc-50 dark:bg-white/5 text-center">
                                <p className="text-xl font-black text-orange-600 dark:text-orange-400">{m.value}</p>
                                <p className="text-xs font-bold mt-1">{m.label}</p>
                                <p className="text-[10px] text-zinc-500 mt-0.5">{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Package className="h-4 w-4 text-orange-500" />
                        Top Performing Products
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-xl">
                        <p className="text-sm text-zinc-400">Product performance data will appear as you start selling</p>
                    </div>
                </CardContent>
            </Card>
        </SellerLayout>
    );
}
