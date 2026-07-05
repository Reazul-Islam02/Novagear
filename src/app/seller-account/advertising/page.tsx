"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SellerLayout } from "@/components/SellerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Megaphone, Plus, TrendingUp, Eye, MousePointerClick,
    DollarSign, Pause, Play, Trash2, BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";

interface Ad {
    _id: string;
    productId: string;
    productTitle: string;
    budget: number;
    duration: number;
    adType: string;
    status: string;
    impressions: number;
    clicks: number;
    spent: number;
    createdAt: string;
}

interface Product {
    id: string;
    title: string;
    price: number;
}

export default function AdvertisingPage() {
    const { status } = useSession();
    const router = useRouter();
    const [ads, setAds] = useState<Ad[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        productId: "",
        budget: "",
        duration: "7",
        adType: "search",
    });

    useEffect(() => {
        if (status === "unauthenticated") { router.push("/login"); return; }
        if (status === "authenticated") fetchData();
    }, [status, router]);

    async function fetchData() {
        try {
            const [adsRes, dashRes] = await Promise.all([
                fetch("/api/seller/ads"),
                fetch("/api/seller/dashboard"),
            ]);
            if (adsRes.status === 403 || dashRes.status === 403) { router.push("/seller-account"); return; }
            const adsData = await adsRes.json();
            const dashData = await dashRes.json();
            setAds(adsData.ads || []);
            setProducts(dashData.products || []);
        } catch { toast.error("Failed to load data"); }
        finally { setLoading(false); }
    }

    async function createAd() {
        const product = products.find((p) => p.id === formData.productId);
        if (!formData.productId || !formData.budget) {
            toast.error("Please fill all required fields");
            return;
        }
        try {
            const res = await fetch("/api/seller/ads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    productTitle: product?.title || "",
                    budget: Number(formData.budget),
                    duration: Number(formData.duration),
                }),
            });
            if (res.ok) {
                const ad = await res.json();
                setAds([ad, ...ads]);
                setDialogOpen(false);
                setFormData({ productId: "", budget: "", duration: "7", adType: "search" });
                toast.success("Ad campaign created!");
            } else toast.error("Failed to create ad");
        } catch { toast.error("Something went wrong"); }
    }

    const totalSpent = ads.reduce((a, b) => a + b.spent, 0);
    const totalImpressions = ads.reduce((a, b) => a + b.impressions, 0);
    const totalClicks = ads.reduce((a, b) => a + b.clicks, 0);

    if (loading) {
        return <SellerLayout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" /></div></SellerLayout>;
    }

    return (
        <SellerLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black">Advertising</h1>
                    <p className="text-sm text-zinc-500">Create and manage ad campaigns for your products</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-xl bg-orange-500 hover:bg-orange-600 font-bold">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Ad
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 rounded-2xl">
                        <DialogHeader>
                            <DialogTitle>Create Ad Campaign</DialogTitle>
                            <DialogDescription>Boost a product with paid advertising</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 block">Product</label>
                                <Select value={formData.productId} onValueChange={(v) => setFormData({ ...formData, productId: v })}>
                                    <SelectTrigger className="h-10 rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/5">
                                        <SelectValue placeholder="Select a product" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10">
                                        {products.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 block">Ad Type</label>
                                <Select value={formData.adType} onValueChange={(v) => setFormData({ ...formData, adType: v })}>
                                    <SelectTrigger className="h-10 rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/5">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10">
                                        <SelectItem value="search">Search Ads</SelectItem>
                                        <SelectItem value="banner">Banner Ads</SelectItem>
                                        <SelectItem value="featured">Featured Listing</SelectItem>
                                        <SelectItem value="social">Social Media Ads</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 block">Budget ($)</label>
                                    <Input
                                        type="number"
                                        placeholder="50"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                        className="h-10 rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/5"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 block">Duration (Days)</label>
                                    <Select value={formData.duration} onValueChange={(v) => setFormData({ ...formData, duration: v })}>
                                        <SelectTrigger className="h-10 rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/5">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10">
                                            <SelectItem value="3">3 Days</SelectItem>
                                            <SelectItem value="7">7 Days</SelectItem>
                                            <SelectItem value="14">14 Days</SelectItem>
                                            <SelectItem value="30">30 Days</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" className="rounded-xl" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button className="rounded-xl bg-orange-500 hover:bg-orange-600 font-bold" onClick={createAd}>Launch Campaign</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: "Active Campaigns", value: ads.filter((a) => a.status === "active").length, icon: Megaphone, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
                    { label: "Total Impressions", value: totalImpressions.toLocaleString(), icon: Eye, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
                    { label: "Total Clicks", value: totalClicks.toLocaleString(), icon: MousePointerClick, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
                    { label: "Total Spent", value: `$${totalSpent.toFixed(2)}`, icon: DollarSign, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
                ].map((stat) => (
                    <Card key={stat.label} className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl">
                        <CardContent className="p-4">
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <p className="text-2xl font-black">{stat.value}</p>
                            <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Ads List */}
            {ads.length === 0 ? (
                <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl">
                    <CardContent className="py-16 text-center">
                        <Megaphone className="h-12 w-12 mx-auto text-zinc-300 dark:text-zinc-600 mb-4" />
                        <h3 className="font-bold text-lg mb-2">No ad campaigns yet</h3>
                        <p className="text-sm text-zinc-500 mb-4">Create your first ad to boost product visibility.</p>
                        <Button className="rounded-xl bg-orange-500 hover:bg-orange-600 font-bold" onClick={() => setDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create First Ad
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {ads.map((ad) => (
                        <Card key={ad._id} className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl hover:border-orange-500/20 transition-colors">
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                                            <Megaphone className="h-5 w-5 text-orange-500" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm truncate">{ad.productTitle || "Product Ad"}</p>
                                            <p className="text-xs text-zinc-500">
                                                {ad.adType} &middot; {ad.duration} days &middot; Budget: ${ad.budget}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs">
                                        <div className="text-center">
                                            <p className="font-bold">{ad.impressions}</p>
                                            <p className="text-zinc-500">Views</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold">{ad.clicks}</p>
                                            <p className="text-zinc-500">Clicks</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold">${ad.spent.toFixed(2)}</p>
                                            <p className="text-zinc-500">Spent</p>
                                        </div>
                                        <Badge className={`border-0 text-[10px] font-bold ${ad.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                                            {ad.status}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </SellerLayout>
    );
}
