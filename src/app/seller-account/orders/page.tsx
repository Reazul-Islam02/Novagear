"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SellerLayout } from "@/components/SellerLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    ShoppingCart, Package, Clock, Truck, CheckCircle2,
    XCircle, ChevronRight, Search, Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Order {
    _id: string;
    productTitle: string;
    productId: string;
    customerName: string;
    customerEmail: string;
    quantity: number;
    totalAmount: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400", icon: Clock },
    processing: { label: "Processing", color: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400", icon: Package },
    shipped: { label: "Shipped", color: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400", icon: Truck },
    delivered: { label: "Delivered", color: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400", icon: CheckCircle2 },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400", icon: XCircle },
};

export default function SellerOrdersPage() {
    const { status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") { router.push("/login"); return; }
        if (status === "authenticated") fetchOrders();
    }, [status, router]);

    async function fetchOrders() {
        try {
            const res = await fetch("/api/seller/orders");
            if (res.status === 403) { router.push("/seller-account"); return; }
            const data = await res.json();
            setOrders(data.orders || []);
        } catch { toast.error("Failed to load orders"); }
        finally { setLoading(false); }
    }

    async function updateOrderStatus(orderId: string, newStatus: string) {
        try {
            const res = await fetch("/api/seller/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status: newStatus }),
            });
            if (res.ok) {
                setOrders(orders.map((o) =>
                    o._id === orderId ? { ...o, status: newStatus as Order["status"] } : o
                ));
                toast.success("Order status updated");
            } else toast.error("Failed to update order");
        } catch { toast.error("Something went wrong"); }
    }

    const filtered = orders.filter((o) => {
        const matchesStatus = statusFilter === "all" || o.status === statusFilter;
        const matchesSearch = o.productTitle?.toLowerCase().includes(searchQuery.toLowerCase()) || o.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const stats = {
        total: orders.length,
        pending: orders.filter((o) => o.status === "pending").length,
        processing: orders.filter((o) => o.status === "processing").length,
        shipped: orders.filter((o) => o.status === "shipped").length,
        delivered: orders.filter((o) => o.status === "delivered").length,
    };

    if (loading) {
        return <SellerLayout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" /></div></SellerLayout>;
    }

    return (
        <SellerLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-black">Orders</h1>
                <p className="text-sm text-zinc-500">Manage and track all your orders</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {[
                    { label: "Total", value: stats.total, color: "text-zinc-600 dark:text-zinc-400" },
                    { label: "Pending", value: stats.pending, color: "text-yellow-600" },
                    { label: "Processing", value: stats.processing, color: "text-blue-600" },
                    { label: "Shipped", value: stats.shipped, color: "text-purple-600" },
                    { label: "Delivered", value: stats.delivered, color: "text-green-600" },
                ].map((s) => (
                    <Card key={s.label} className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl">
                        <CardContent className="p-4 text-center">
                            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                            <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl mb-6">
                <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                            placeholder="Search orders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10 bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/5 rounded-xl"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px] h-10 bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/5 rounded-xl">
                            <Filter className="h-4 w-4 mr-2 text-zinc-400" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* Orders List */}
            {filtered.length === 0 ? (
                <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl">
                    <CardContent className="py-16 text-center">
                        <ShoppingCart className="h-12 w-12 mx-auto text-zinc-300 dark:text-zinc-600 mb-4" />
                        <h3 className="font-bold text-lg mb-2">No orders yet</h3>
                        <p className="text-sm text-zinc-500">When customers order your products, they&apos;ll appear here.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filtered.map((order) => {
                        const cfg = statusConfig[order.status] || statusConfig.pending;
                        const StatusIcon = cfg.icon;
                        return (
                            <Card key={order._id} className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl hover:border-orange-500/20 transition-colors">
                                <CardContent className="p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                                                <StatusIcon className="h-5 w-5 text-orange-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-sm truncate">{order.productTitle || "Product"}</p>
                                                <p className="text-xs text-zinc-500">
                                                    {order.customerName || order.customerEmail || "Customer"} &middot; Qty: {order.quantity || 1}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-orange-600 dark:text-orange-400">${(order.totalAmount || 0).toFixed(2)}</span>
                                            <Badge className={`${cfg.color} border-0 text-[10px] font-bold`}>{cfg.label}</Badge>
                                            <Select defaultValue={order.status} onValueChange={(v) => updateOrderStatus(order._id, v)}>
                                                <SelectTrigger className="w-[130px] h-8 text-xs rounded-lg bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/5">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10">
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="processing">Processing</SelectItem>
                                                    <SelectItem value="shipped">Shipped</SelectItem>
                                                    <SelectItem value="delivered">Delivered</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-zinc-400 mt-2">
                                        Order #{order._id?.toString().slice(-8)} &middot; {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </SellerLayout>
    );
}
