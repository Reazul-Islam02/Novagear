"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useProductStore } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ChevronLeft,
    ChevronRight,
    ShoppingCart,
    Share2,
    Heart,
    Star,
    Truck,
    RotateCcw,
    ShieldCheck,
    Minus,
    Plus,
    Zap
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ProductDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { getProductById, products } = useProductStore();
    const { addToCart } = useCartStore();
    const product = getProductById(id as string);
    const [quantity, setQuantity] = useState(1);
    const [liked, setLiked] = useState(false);

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-32 text-center">
                <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
                <p className="text-muted-foreground mb-8 text-lg">
                    The gadget you&apos;re looking for doesn&apos;t exist or has been removed.
                </p>
                <Button asChild>
                    <Link href="/shop">Back to Shop</Link>
                </Button>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
    };

    const originalPrice = product.price * 1.15;
    const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);
    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    const handleBuyNow = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        toast.success(`Added ${quantity} × ${product.title} to cart`);
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        toast.success(`Added ${quantity} × ${product.title} to cart`);
    };

    return (
        <div className="bg-mesh min-h-screen">
            <div className="container mx-auto px-4 py-24">
                {/* Breadcrumb */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-zinc-400 mb-8 flex-wrap"
                >
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-zinc-500">{product.category}</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-white font-medium truncate max-w-[200px]">{product.title}</span>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Product Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-5"
                    >
                        <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 shadow-2xl">
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-110"
                                priority
                            />
                            <Badge className="absolute top-4 left-4 bg-red-500/90 text-white border-0 px-3 py-1 font-bold">
                                -{discount}%
                            </Badge>
                        </div>
                    </motion.div>

                    {/* Middle: Product Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-4"
                    >
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                                    {product.title}
                                </h1>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <span className="text-sm text-zinc-400">Ratings 4.8</span>
                                    <span className="text-sm text-zinc-600">|</span>
                                    <span className="text-sm text-primary">12 Answered Questions</span>
                                </div>
                                <p className="text-sm text-zinc-500">Brand: <span className="text-primary">NovaGear</span> | Category: {product.category}</p>
                            </div>

                            {/* Price */}
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-black text-primary">
                                        {formatPrice(product.price)}
                                    </span>
                                    <span className="text-lg text-zinc-500 line-through">
                                        {formatPrice(originalPrice)}
                                    </span>
                                    <Badge className="bg-red-500/20 text-red-400 border-red-500/20 font-bold">
                                        -{discount}%
                                    </Badge>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-3">Description</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    {product.fullDesc || product.shortDesc}
                                </p>
                            </div>

                            {/* Quantity */}
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-zinc-400">Quantity</span>
                                <div className="flex items-center gap-0 border border-white/10 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="h-10 w-10 flex items-center justify-center hover:bg-white/10 transition-colors text-zinc-400"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="h-10 w-12 flex items-center justify-center border-x border-white/10 font-bold text-sm">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="h-10 w-10 flex items-center justify-center hover:bg-white/10 transition-colors text-zinc-400"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="flex-1 h-14 text-base font-bold rounded-xl border-primary/30 text-primary hover:bg-primary/10 gap-2"
                                    onClick={handleBuyNow}
                                >
                                    <Zap className="h-5 w-5" />
                                    Buy Now
                                </Button>
                                <Button
                                    size="lg"
                                    className="flex-1 h-14 text-base font-bold rounded-xl shadow-lg shadow-primary/20 gap-2"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    Add to Cart
                                </Button>
                            </div>

                            {/* Wishlist & Share */}
                            <div className="flex gap-3">
                                <Button
                                    variant="ghost"
                                    className="flex-1 gap-2 text-zinc-400 hover:text-red-400"
                                    onClick={() => {
                                        setLiked(!liked);
                                        toast.success(liked ? "Removed from wishlist" : "Added to wishlist");
                                    }}
                                >
                                    <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
                                    Wishlist
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="flex-1 gap-2 text-zinc-400 hover:text-primary"
                                    onClick={() => toast.success("Link copied!")}
                                >
                                    <Share2 className="h-5 w-5" />
                                    Share
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Delivery & Seller Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-3"
                    >
                        <div className="space-y-4">
                            {/* Delivery Options */}
                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5 space-y-4">
                                <h3 className="font-bold text-sm text-zinc-300">Delivery Options</h3>
                                <div className="flex items-start gap-3">
                                    <Truck className="h-5 w-5 text-zinc-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold">Standard Delivery</p>
                                        <p className="text-xs text-zinc-500">Estimated 3-5 business days</p>
                                    </div>
                                    <span className="ml-auto text-sm font-bold text-primary">$4.99</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Zap className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold">Express Delivery</p>
                                        <p className="text-xs text-zinc-500">Get by tomorrow</p>
                                    </div>
                                    <span className="ml-auto text-sm font-bold text-primary">$12.99</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <ShoppingCart className="h-5 w-5 text-zinc-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold">Cash on Delivery</p>
                                        <p className="text-xs text-zinc-500">Available</p>
                                    </div>
                                </div>
                            </div>

                            {/* Return & Warranty */}
                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5 space-y-4">
                                <h3 className="font-bold text-sm text-zinc-300">Return & Warranty</h3>
                                <div className="flex items-center gap-3">
                                    <RotateCcw className="h-5 w-5 text-primary flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-primary">14 days easy return</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold">2 Year Warranty</p>
                                    </div>
                                </div>
                            </div>

                            {/* Seller Info */}
                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5 space-y-4">
                                <h3 className="text-xs text-zinc-500">Sold by</h3>
                                <p className="font-bold text-lg">NovaGear Official</p>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-primary/20 text-primary border-primary/20 text-xs">Official Store</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                                    <div className="text-center">
                                        <p className="text-xs text-zinc-500">Positive Seller</p>
                                        <p className="text-lg font-bold text-primary">95%</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-zinc-500">Ship on Time</p>
                                        <p className="text-lg font-bold text-primary">100%</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full rounded-xl border-primary/20 text-primary hover:bg-primary/10 font-bold" asChild>
                                    <Link href="/shop">GO TO STORE</Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-20">
                        <h2 className="text-2xl font-bold mb-8">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <Link key={p.id} href={`/shop/${p.id}`} className="group">
                                    <div className="rounded-2xl border border-white/5 bg-zinc-900/50 overflow-hidden hover:border-primary/30 transition-all">
                                        <div className="relative aspect-square overflow-hidden">
                                            <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <div className="p-4">
                                            <p className="font-semibold text-sm truncate mb-1">{p.title}</p>
                                            <p className="text-primary font-bold">{formatPrice(p.price)}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
