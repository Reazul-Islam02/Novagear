"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SellerLayout } from "@/components/SellerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
    Package, DollarSign, ShoppingCart,
    Plus, Trash2, Eye, Search, BarChart3, Settings,
    Tag, Truck, Star, ChevronRight, CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

interface DashboardProduct {
    id: string;
    title: string;
    shortDesc: string;
    price: number;
    category: string;
    image: string;
    createdAt: string;
}

interface DashboardStats {
    totalProducts: number;
    totalRevenue: number;
    pendingOrders: number;
    totalOrders: number;
}

export default function SellerDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [products, setProducts] = useState<DashboardProduct[]>([]);
    const [stats, setStats] = useState<DashboardStats>({ totalProducts: 0, totalRevenue: 0, pendingOrders: 0, totalOrders: 0 });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }
        if (status === "authenticated") {
            fetchDashboard();
        }
    }, [status, router]);

    async function fetchDashboard() {
        try {
            const res = await fetch("/api/seller/dashboard");
            if (res.status === 403) {
                router.push("/seller-account");
                return;
            }
            const data = await res.json();
            setProducts(data.products || []);
            setStats(data.stats);
        } catch {
            toast.error("Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        try {
            const res = await fetch("/api/seller/products", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                setProducts(products.filter((p) => p.id !== id));
                setStats((s) => ({ ...s, totalProducts: s.totalProducts - 1 }));
                toast.success("Product deleted");
            } else {
                toast.error("Failed to delete product");
            }
        } catch {
            toast.error("Something went wrong");
        }
    }

    const filteredProducts = products.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <SellerLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
                </div>
            </SellerLayout>
        );
    }

    return (
        <SellerLayout>
                    {/* Important Notification */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-5 text-white"
                        >
                            <h1 className="text-xl font-black mb-1">Welcome, {session?.user?.name || "Seller"}!</h1>
                            <p className="text-white/80 text-sm">Manage your products, track orders, and grow your business.</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:w-80 bg-white dark:bg-zinc-900/50 rounded-2xl p-4 border border-zinc-200 dark:border-white/5"
                        >
                            <h3 className="font-bold text-sm mb-2">Important Notification</h3>
                            <p className="text-xs text-zinc-500">You are updated! No new important notification for you.</p>
                        </motion.div>
                    </div>

                    {/* To Do Steps */}
                    <Card className="bg-gradient-to-r from-orange-500 to-orange-600 border-0 rounded-2xl mb-6 text-white">
                        <CardContent className="p-5">
                            <h3 className="font-bold text-sm mb-4">To Do</h3>
                            <div className="flex items-center justify-between max-w-xl">
                                {[
                                    { label: "Email", done: true, count: 0 },
                                    { label: "Address", done: false, count: 2 },
                                    { label: "ID Bank", done: false, count: 3 },
                                    { label: "Product", done: false, count: 4 },
                                ].map((step, i, arr) => (
                                    <div key={step.label} className="flex items-center gap-2">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 
                                                ${step.done ? "bg-white text-orange-500 border-white" : "border-white/50"}`}>
                                                {step.done ? <CheckCircle2 className="h-4 w-4" /> : step.count}
                                            </div>
                                            <span className="text-white/90 text-[11px] font-medium">{step.label}</span>
                                        </div>
                                        {i < arr.length - 1 && (
                                            <div className="w-10 sm:w-20 h-[2px] bg-white/30 mb-5" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {[
                            { label: "Total Products", value: stats.totalProducts, icon: Package, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
                            { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
                            { label: "Pending Orders", value: stats.pendingOrders, icon: Truck, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
                            { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
                        ].map((stat) => (
                            <Card key={stat.label} className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-zinc-400" />
                                    </div>
                                    <p className="text-2xl font-black">{stat.value}</p>
                                    <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl mb-6">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Star className="h-4 w-4 text-orange-500" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <Button asChild variant="outline" className="h-20 rounded-xl border-zinc-200 dark:border-white/5 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:border-orange-300 dark:hover:border-orange-500/30 flex-col gap-2">
                                    <Link href="/seller-account/add-product">
                                        <Plus className="h-5 w-5 text-orange-500" />
                                        <span className="text-xs font-bold">Add Product</span>
                                    </Link>
                                </Button>
                                <Button variant="outline" className="h-20 rounded-xl border-zinc-200 dark:border-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500/30 flex-col gap-2">
                                    <Tag className="h-5 w-5 text-blue-500" />
                                    <span className="text-xs font-bold">Promotions</span>
                                </Button>
                                <Button variant="outline" className="h-20 rounded-xl border-zinc-200 dark:border-white/5 hover:bg-green-50 dark:hover:bg-green-500/10 hover:border-green-300 dark:hover:border-green-500/30 flex-col gap-2">
                                    <BarChart3 className="h-5 w-5 text-green-500" />
                                    <span className="text-xs font-bold">Analytics</span>
                                </Button>
                                <Button variant="outline" className="h-20 rounded-xl border-zinc-200 dark:border-white/5 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:border-purple-300 dark:hover:border-purple-500/30 flex-col gap-2">
                                    <Settings className="h-5 w-5 text-purple-500" />
                                    <span className="text-xs font-bold">Settings</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products Section */}
                    <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl">
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Package className="h-4 w-4 text-orange-500" />
                                    My Products ({filteredProducts.length})
                                </CardTitle>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                        <Input
                                            placeholder="Search products..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 h-9 w-60 bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/5 rounded-xl text-sm"
                                        />
                                    </div>
                                    <Button asChild className="h-9 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-sm">
                                        <Link href="/seller-account/add-product">
                                            <Plus className="h-4 w-4 mr-1" />
                                            Add New
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {filteredProducts.length === 0 ? (
                                <div className="text-center py-16">
                                    <Package className="h-12 w-12 mx-auto text-zinc-300 dark:text-zinc-600 mb-4" />
                                    <h3 className="font-bold text-lg mb-2">No products yet</h3>
                                    <p className="text-sm text-zinc-500 mb-4">Start adding products to your shop.</p>
                                    <Button asChild className="rounded-xl bg-orange-500 hover:bg-orange-600 font-bold">
                                        <Link href="/seller-account/add-product">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Your First Product
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    {/* Desktop Table */}
                                    <table className="w-full hidden md:table">
                                        <thead>
                                            <tr className="text-left text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-200 dark:border-white/5">
                                                <th className="pb-3 pr-4">Product</th>
                                                <th className="pb-3 pr-4">Category</th>
                                                <th className="pb-3 pr-4">Price</th>
                                                <th className="pb-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProducts.map((product) => (
                                                <tr key={product.id} className="border-b border-zinc-100 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="py-3 pr-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10 relative flex-shrink-0">
                                                                <Image src={product.image} alt={product.title} fill className="object-cover" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-bold text-sm truncate">{product.title}</p>
                                                                <p className="text-xs text-zinc-500 truncate">{product.shortDesc}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        <span className="px-2 py-1 rounded-lg bg-zinc-100 dark:bg-white/5 text-xs font-medium">{product.category}</span>
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        <span className="font-bold text-orange-600 dark:text-orange-400">${product.price.toFixed(2)}</span>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-2">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10" asChild>
                                                                <Link href={`/shop/${product.id}`}>
                                                                    <Eye className="h-4 w-4 text-blue-500" />
                                                                </Link>
                                                            </Button>
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10">
                                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 rounded-2xl">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Delete Product</DialogTitle>
                                                                        <DialogDescription>
                                                                            Are you sure you want to delete &quot;{product.title}&quot;? This action cannot be undone.
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <DialogFooter>
                                                                        <Button variant="outline" className="rounded-xl">Cancel</Button>
                                                                        <Button
                                                                            className="rounded-xl bg-red-500 hover:bg-red-600"
                                                                            onClick={() => handleDelete(product.id)}
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Mobile Cards */}
                                    <div className="md:hidden space-y-3">
                                        {filteredProducts.map((product) => (
                                            <div key={product.id} className="p-4 rounded-xl border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/5 flex items-center gap-3">
                                                <div className="w-14 h-14 rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10 relative flex-shrink-0">
                                                    <Image src={product.image} alt={product.title} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm truncate">{product.title}</p>
                                                    <p className="text-xs text-zinc-500">{product.category}</p>
                                                    <p className="text-sm text-orange-600 dark:text-orange-400 font-bold">${product.price.toFixed(2)}</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" asChild>
                                                        <Link href={`/shop/${product.id}`}>
                                                            <Eye className="h-4 w-4 text-blue-500" />
                                                        </Link>
                                                    </Button>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 rounded-2xl">
                                                            <DialogHeader>
                                                                <DialogTitle>Delete Product</DialogTitle>
                                                                <DialogDescription>
                                                                    Delete &quot;{product.title}&quot;? This cannot be undone.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <DialogFooter>
                                                                <Button variant="outline" className="rounded-xl">Cancel</Button>
                                                                <Button className="rounded-xl bg-red-500 hover:bg-red-600" onClick={() => handleDelete(product.id)}>Delete</Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
        </SellerLayout>
    );
}
