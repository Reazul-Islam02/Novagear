"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useProductStore } from "@/store/useProductStore";
import { SellerLayout } from "@/components/SellerLayout";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { motion } from "framer-motion";
import { ArrowLeft, Image as ImageIcon, Loader2, Package } from "lucide-react";

const productSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    shortDesc: z.string().min(10, "Minimum 10 characters").max(120, "Maximum 120 characters"),
    fullDesc: z.string().min(20, "Please provide a detailed description"),
    price: z.coerce.number().positive("Price must be a positive number"),
    category: z.string().min(1, "Please select a category"),
    image: z.string().url("Please enter a valid image URL").or(z.string().length(0)),
});

type ProductFormValues = z.infer<typeof productSchema>;

const categories = ["Smartphone", "Laptop", "Audio", "Wearable", "Camera", "Accessory"];

export default function SellerAddProductPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { addProduct } = useProductStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSeller, setIsSeller] = useState<boolean | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }
        if (status === "authenticated") {
            fetch("/api/seller")
                .then((r) => r.json())
                .then((d) => {
                    if (!d.isSeller) router.push("/seller-account");
                    else setIsSeller(true);
                });
        }
    }, [status, router]);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            title: "",
            shortDesc: "",
            fullDesc: "",
            price: 0,
            category: "",
            image: "",
        },
    });

    const watchImage = form.watch("image");
    const watchShortDesc = form.watch("shortDesc");

    async function onSubmit(values: ProductFormValues) {
        setIsSubmitting(true);
        try {
            const newProduct = {
                id: nanoid(),
                ...values,
                image: values.image || "https://via.placeholder.com/400x300?text=NovaGear+Product",
            };

            const res = await fetch("/api/seller/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to add product");
            }

            const savedProduct = await res.json();
            addProduct(savedProduct);
            toast.success("Product added to your shop!");
            router.push("/seller-account/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Failed to add product");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isSeller === null) {
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
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Button variant="ghost" size="icon" className="rounded-xl" asChild>
                        <Link href="/seller-account/dashboard">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black">Add New Product</h1>
                        <p className="text-sm text-zinc-500">List a new product in your shop</p>
                    </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 rounded-3xl shadow-xl">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">
                                <div className="h-1 w-4 bg-orange-500 rounded-full" />
                                New Listing
                            </div>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Package className="h-5 w-5 text-orange-500" />
                                Product Details
                            </CardTitle>
                            <CardDescription className="text-zinc-500">
                                Fill in the details to list a new product in your shop.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Product Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Nova Pro Max X" {...field} className="h-12 bg-white/5 border-white/5 focus:border-orange-500/50 rounded-xl" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }: { field: any }) => (
                                                <FormItem>
                                                    <FormLabel className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Price (USD)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" step="0.01" placeholder="0.00" {...field} className="h-12 bg-white/5 border-white/5 focus:border-orange-500/50 rounded-xl" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="category"
                                            render={({ field }: { field: any }) => (
                                                <FormItem>
                                                    <FormLabel className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Category</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-12 bg-white/5 border-white/5 rounded-xl">
                                                                <SelectValue placeholder="Select category" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-zinc-900 border-white/10">
                                                            {categories.map((cat) => (
                                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="shortDesc"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Short Description</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Brief product summary" {...field} className="h-12 bg-white/5 border-white/5 focus:border-orange-500/50 rounded-xl" />
                                                </FormControl>
                                                <FormDescription className="text-[10px] text-zinc-600">
                                                    {watchShortDesc?.length || 0}/120 characters
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="fullDesc"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Full Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Detailed product description..." {...field} className="min-h-[120px] bg-white/5 border-white/5 focus:border-orange-500/50 rounded-xl" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="image"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                                                    <ImageIcon className="inline h-3 w-3 mr-1" />
                                                    Image URL
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://images.unsplash.com/..." {...field} className="h-12 bg-white/5 border-white/5 focus:border-orange-500/50 rounded-xl" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {watchImage && watchImage.startsWith("http") && (
                                        <div className="relative h-48 rounded-2xl overflow-hidden border border-white/10">
                                            <Image src={watchImage} alt="Preview" fill className="object-cover" />
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-2">
                                        <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl font-bold border-white/10" asChild>
                                            <Link href="/seller-account/dashboard">Cancel</Link>
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1 h-12 rounded-xl font-black tracking-widest bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Publishing...
                                                </>
                                            ) : (
                                                "PUBLISH PRODUCT"
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </SellerLayout>
    );
}
