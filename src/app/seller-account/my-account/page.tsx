"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SellerLayout } from "@/components/SellerLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User, Mail, Shield, Calendar, Save, Key } from "lucide-react";
import { motion } from "framer-motion";

export default function MyAccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [seller, setSeller] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") { router.push("/login"); return; }
        if (status === "authenticated") fetchSeller();
    }, [status, router]);

    async function fetchSeller() {
        try {
            const res = await fetch("/api/seller");
            const data = await res.json();
            if (!data.isSeller) { router.push("/seller-account"); return; }
            setSeller(data.seller);
        } catch { toast.error("Failed to load account"); }
        finally { setLoading(false); }
    }

    if (loading) {
        return <SellerLayout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" /></div></SellerLayout>;
    }

    const statusColors: Record<string, string> = {
        active: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
        pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
        suspended: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    };

    return (
        <SellerLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-black">My Account</h1>
                <p className="text-sm text-zinc-500">Manage your seller account information</p>
            </div>

            <div className="max-w-2xl space-y-6">
                {/* Account Overview */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 rounded-2xl text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black">
                                    {session?.user?.name?.charAt(0) || "S"}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black">{session?.user?.name}</h2>
                                    <p className="text-white/70 text-sm">{session?.user?.email}</p>
                                    <Badge className={`mt-2 border-0 text-[10px] font-bold ${statusColors[seller?.status] || statusColors.active}`}>
                                        {seller?.status?.toUpperCase() || "ACTIVE"}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Account Details */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                    <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <User className="h-4 w-4 text-orange-500" />
                                Account Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1"><User className="inline h-3 w-3 mr-1" />Name</p>
                                    <p className="font-bold text-sm">{session?.user?.name || "N/A"}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1"><Mail className="inline h-3 w-3 mr-1" />Email</p>
                                    <p className="font-bold text-sm">{session?.user?.email || "N/A"}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1"><Shield className="inline h-3 w-3 mr-1" />Shop Name</p>
                                    <p className="font-bold text-sm">{seller?.shopName || "N/A"}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1"><Calendar className="inline h-3 w-3 mr-1" />Member Since</p>
                                    <p className="font-bold text-sm">{seller?.createdAt ? new Date(seller.createdAt).toLocaleDateString() : "N/A"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Security */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Key className="h-4 w-4 text-orange-500" />
                                Security
                            </CardTitle>
                            <CardDescription className="text-xs">Manage your password and security settings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-6 rounded-xl bg-zinc-50 dark:bg-white/5 border-2 border-dashed border-zinc-200 dark:border-white/5 text-center">
                                <Key className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
                                <p className="text-sm font-bold mb-1">Password Management</p>
                                <p className="text-xs text-zinc-500 mb-4">Change your password to keep your account secure</p>
                                <Button variant="outline" className="rounded-xl font-bold border-zinc-200 dark:border-white/5">
                                    Change Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </SellerLayout>
    );
}
