"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ShoppingCart, Zap } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const addToCart = useCartStore((state) => state.addToCart);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
        >
            <Card className="overflow-hidden glass border-primary/10 shadow-lg hover:shadow-primary/5 transition-all">
                <CardHeader className="p-0 relative aspect-[4/3] overflow-hidden">
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <Badge className="absolute top-2 right-2 bg-primary/80 hover:bg-primary">
                        {product.category}
                    </Badge>
                </CardHeader>
                <CardContent className="p-4">
                    <h3 className="text-lg font-bold line-clamp-1 mb-1">{product.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] mb-4">
                        {product.shortDesc}
                    </p>
                    <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button variant="outline" className="flex-1 gap-2 border-primary/30 text-primary hover:bg-primary/10" asChild>
                        <Link href={`/shop/${product.id}`}>
                            <Zap className="h-4 w-4" />
                            Buy Now
                        </Link>
                    </Button>
                    <Button
                        className="flex-1 gap-2"
                        onClick={() => {
                            addToCart(product);
                            toast.success(`Added ${product.title} to cart`);
                        }}
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
