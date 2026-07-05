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
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Package, Plus, Trash2, Eye, Search, Edit, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Product {
    id: string;
    title: string;
    shortDesc: string;
    price: number;
    category: string;
    image: string;
    createdAt: string;
}

export default function SellerProductsPage() {
    const { status } = useSession();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    useEffect(() => {
        if (status === "unauthenticated") { router.push("/login"); return; }
        if (status === "authenticated") fetchProducts();
    }, [status, router]);

    async function fetchProducts() {
        try {
            const res = await fetch("/api/seller/dashboard");
            if (res.status === 403) { router.push("/seller-account"); return; }
            const data = await res.json();
            setProducts(data.products || []);
        } catch { toast.error("Failed to load products"); }
        finally { setLoading(false); }
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
                toast.success("Product deleted");
            } else toast.error("Failed to delete product");
        } catch { toast.error("Something went wrong"); }
    }

    const categories = [...new Set(products.map((p) => p.category))];
    const filtered = products.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return <SellerLayout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" /></div></SellerLayout>;
    }

    return (
        <SellerLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black">Products</h1>
                    <p className="text-sm text-zinc-500">{products.length} total products in your shop</p>
                </div>
                <Button asChild className="rounded-xl bg-orange-500 hover:bg-orange-600 font-bold">
                    <Link href="/seller-account/add-product">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl mb-6">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                                placeholder="Search products by name or category..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-10 bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/5 rounded-xl"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[180px] h-10 rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/5">
                                <Filter className="h-4 w-4 mr-2 text-zinc-400" />
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10">
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Products Grid */}
            {filtered.length === 0 ? (
                <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl">
                    <CardContent className="py-16 text-center">
                        <Package className="h-12 w-12 mx-auto text-zinc-300 dark:text-zinc-600 mb-4" />
                        <h3 className="font-bold text-lg mb-2">No products found</h3>
                        <p className="text-sm text-zinc-500 mb-4">
                            {searchQuery || categoryFilter !== "all" ? "Try changing your filters." : "Start adding products to your shop."}
                        </p>
                        <Button asChild className="rounded-xl bg-orange-500 hover:bg-orange-600 font-bold">
                            <Link href="/seller-account/add-product"><Plus className="h-4 w-4 mr-2" />Add Product</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((product) => (
                        <Card key={product.id} className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden group hover:border-orange-500/30 transition-colors">
                            <div className="relative h-48 bg-zinc-100 dark:bg-white/5">
                                <Image src={product.image} alt={product.title} fill className="object-cover" />
                                <Badge className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-300 text-[10px]">
                                    {product.category}
                                </Badge>
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-bold text-sm truncate mb-1">{product.title}</h3>
                                <p className="text-xs text-zinc-500 truncate mb-3">{product.shortDesc}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-black text-orange-600 dark:text-orange-400">${product.price.toFixed(2)}</span>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10" asChild>
                                            <Link href={`/shop/${product.id}`}><Eye className="h-4 w-4 text-blue-500" /></Link>
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
                                                    <DialogDescription>Delete &quot;{product.title}&quot;? This cannot be undone.</DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <Button variant="outline" className="rounded-xl">Cancel</Button>
                                                    <Button className="rounded-xl bg-red-500 hover:bg-red-600" onClick={() => handleDelete(product.id)}>Delete</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
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
