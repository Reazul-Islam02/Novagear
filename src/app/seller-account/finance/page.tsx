"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SellerLayout } from "@/components/SellerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { DollarSign, TrendingUp, ArrowUpRight, Wallet, CreditCard, Receipt, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function FinancePage() {
    const { status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0 });
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
        } catch { toast.error("Failed to load finance data"); }
        finally { setLoading(false); }
    }

    if (loading) {
        return <SellerLayout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" /></div></SellerLayout>;
    }

    const platformFee = stats.totalRevenue * 0.05;
    const netEarnings = stats.totalRevenue - platformFee;

    return (
        <SellerLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black">Finance</h1>
                    <p className="text-sm text-zinc-500">Track your earnings, payouts, and financial statements</p>
                </div>
                <Button variant="outline" className="rounded-xl font-bold border-zinc-200 dark:border-white/5">
                    <Download className="h-4 w-4 mr-2" />
                    Export Statement
                </Button>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 rounded-2xl text-white">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <Wallet className="h-6 w-6 text-white/80" />
                                <Badge className="bg-white/20 text-white border-0 text-[10px]">Available</Badge>
                            </div>
                            <p className="text-3xl font-black">${netEarnings.toFixed(2)}</p>
                            <p className="text-sm text-white/70 mt-1">Net Earnings</p>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                    <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <DollarSign className="h-6 w-6 text-green-500" />
                                <span className="text-xs font-bold text-green-500 flex items-center"><ArrowUpRight className="h-3 w-3" />+12%</span>
                            </div>
                            <p className="text-3xl font-black">${stats.totalRevenue.toFixed(2)}</p>
                            <p className="text-sm text-zinc-500 mt-1">Total Revenue</p>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <Receipt className="h-6 w-6 text-red-500" />
                                <span className="text-[10px] text-zinc-500">5% platform fee</span>
                            </div>
                            <p className="text-3xl font-black">${platformFee.toFixed(2)}</p>
                            <p className="text-sm text-zinc-500 mt-1">Platform Fees</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Payout Settings */}
            <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl mb-6">
                <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-orange-500" />
                        Payout Settings
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-6 rounded-xl bg-zinc-50 dark:bg-white/5 border-2 border-dashed border-zinc-200 dark:border-white/5 text-center">
                        <CreditCard className="h-10 w-10 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
                        <h3 className="font-bold mb-1">No Payment Method Added</h3>
                        <p className="text-xs text-zinc-500 mb-4">Add a bank account or payment method to receive payouts</p>
                        <Button className="rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-sm">
                            Add Payment Method
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Transaction History */}
            <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-orange-500" />
                        Transaction History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="py-12 text-center">
                        <Receipt className="h-10 w-10 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
                        <p className="text-sm text-zinc-400">No transactions yet</p>
                        <p className="text-xs text-zinc-500 mt-1">Your transaction history will appear here</p>
                    </div>
                </CardContent>
            </Card>
        </SellerLayout>
    );
}
