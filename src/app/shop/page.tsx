"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useProductStore } from "@/store/useProductStore";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FilterX, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ShopContent() {
    const { products } = useProductStore();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        const cat = searchParams.get("cat");
        if (cat && cat !== selectedCategory) {
            setSelectedCategory(cat);
        }
    }, [searchParams]);

    const categories = ["All", "Smartphone", "Laptop", "Audio", "Wearable", "Camera", "Accessory"];

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    return (
        <div className="bg-mesh min-h-screen">
            <div className="container mx-auto px-4 py-24">
                <div className="mb-20 text-center relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none -z-10" />
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-gradient leading-none">THE_MARKETPLACE</h1>
                    <p className="text-zinc-400 text-xl max-w-2xl mx-auto leading-relaxed">
                        Access our encrypted repository of next-generation hardware and digital interfaces.
                        Performance is our primary directive.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row gap-8 mb-16 items-stretch"
                >
                    <div className="relative flex-1 group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-emerald-500/50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                        <div className="relative flex items-center h-16 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl px-6">
                            <Search className="h-6 w-6 text-zinc-500 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="IDENTIFY_GAUGE..."
                                className="border-none bg-transparent h-full text-lg focus-visible:ring-0 placeholder:text-zinc-700"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center justify-center p-2 rounded-2xl bg-zinc-900/30 border border-white/5 backdrop-blur-md">
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                variant={selectedCategory === cat ? "default" : "ghost"}
                                size="lg"
                                onClick={() => setSelectedCategory(cat)}
                                className={`rounded-xl px-8 font-bold tracking-widest uppercase text-xs h-12 transition-all ${selectedCategory === cat
                                    ? "shadow-lg shadow-primary/20"
                                    : "text-zinc-500 hover:text-white"
                                    }`}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </motion.div>

                {filteredProducts.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
                    >
                        <AnimatePresence>
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-40 border-2 border-dashed border-white/5 rounded-[3rem] bg-zinc-900/20 backdrop-blur-sm"
                    >
                        <div className="p-6 rounded-full bg-zinc-800/50 w-fit mx-auto mb-8">
                            <FilterX className="h-12 w-12 text-zinc-600" />
                        </div>
                        <p className="text-2xl font-bold text-zinc-500 mb-8 uppercase tracking-[0.2em]">Zero_Matches_Found</p>
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-2xl border-white/10 px-10 h-14 font-bold"
                            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                        >
                            Reset_Terminal_Search
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="bg-mesh min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-zinc-500 font-bold tracking-widest uppercase text-xs">Accessing_Inventory_Manifest...</p>
                </div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}
