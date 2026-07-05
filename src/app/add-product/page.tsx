"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useProductStore } from "@/store/useProductStore";
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
import { PlusCircle, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

const productSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    shortDesc: z.string().min(10, "Minimum 10 characters").max(120, "Maximum 120 characters"),
    fullDesc: z.string().min(20, "Please provide a detailed description"),
    price: z.coerce.number().positive("Price must be a positive number"),
    category: z.string().min(1, "Please select a category"),
    image: z.string().url("Please enter a valid image URL").or(z.string().length(0)),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AddProductPage() {
    const router = useRouter();
    const { addProduct } = useProductStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ProductFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    const previewImage = form.watch("image");

    async function onSubmit(values: ProductFormValues) {
        setIsSubmitting(true);
        try {
            const newProductData = {
                ...values,
                id: nanoid(),
                price: Number(values.price),
                image: values.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
                createdAt: new Date(),
            };

            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProductData),
            });

            if (!response.ok) {
                throw new Error("Failed to save product to database");
            }

            const savedProduct = await response.json();
            addProduct(savedProduct);

            toast.success("Product added to NovaGear inventory!");
            router.push("/shop");
            router.refresh();
        } catch (error) {
            toast.error("Failed to add product. Please try again.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-mesh min-h-screen">
            <div className="container mx-auto px-4 py-24 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Card className="border-white/5 shadow-2xl overflow-hidden bg-zinc-900/40 backdrop-blur-2xl rounded-[3rem]">
                        <CardHeader className="bg-white/5 pb-12 pt-12 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-primary rounded-full" />
                            <div className="flex flex-col items-center gap-6 mb-4 relative z-10">
                                <div className="p-4 rounded-3xl bg-primary/10 border border-primary/20">
                                    <PlusCircle className="h-10 w-10 text-primary" />
                                </div>
                                <CardTitle className="text-5xl font-black tracking-tighter text-gradient leading-none">REGISTRATION_PORTAL</CardTitle>
                            </div>
                            <CardDescription className="text-xl text-zinc-500 font-light max-w-lg mx-auto relative z-10">
                                Connect new hardware entities to the global NovaGear nexus. Complete all fields to initialize sync.
                            </CardDescription>
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                        </CardHeader>
                        <CardContent className="p-12">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }: { field: any }) => (
                                                <FormItem>
                                                    <FormLabel className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.25em] mb-3">Entity_Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="SPECIFY_HARDWARE..." {...field} className="h-14 bg-white/5 border-white/5 focus:border-primary/50 rounded-2xl transition-all text-lg font-bold" />
                                                    </FormControl>
                                                    <FormMessage className="font-bold text-[10px] uppercase tracking-wider" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }: { field: any }) => (
                                                <FormItem>
                                                    <FormLabel className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.25em] mb-3">Unit_Valuation ($)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="00.00" {...field} className="h-14 bg-white/5 border-white/5 focus:border-primary/50 rounded-2xl transition-all text-lg font-bold" />
                                                    </FormControl>
                                                    <FormMessage className="font-bold text-[10px] uppercase tracking-wider" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.25em] mb-3">Hardware_Class</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-14 bg-white/5 border-white/5 focus:border-primary/50 rounded-2xl transition-all text-lg font-bold">
                                                            <SelectValue placeholder="IDENTIFY_CATEGORY" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-zinc-900 border-white/10 rounded-2xl">
                                                        <SelectItem value="Smartphone" className="font-bold p-3">Smartphone</SelectItem>
                                                        <SelectItem value="Laptop" className="font-bold p-3">Laptop</SelectItem>
                                                        <SelectItem value="Audio" className="font-bold p-3">Audio</SelectItem>
                                                        <SelectItem value="Wearable" className="font-bold p-3">Wearable</SelectItem>
                                                        <SelectItem value="Camera" className="font-bold p-3">Camera</SelectItem>
                                                        <SelectItem value="Accessory" className="font-bold p-3">Accessory</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className="font-bold text-[10px] uppercase tracking-wider" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="shortDesc"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.25em] mb-3">Manifest_Summary</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="BRIEF_CHARACTER_STRING (MAX_120)" {...field} className="h-14 bg-white/5 border-white/5 focus:border-primary/50 rounded-2xl transition-all text-md font-medium" />
                                                </FormControl>
                                                <FormDescription className="text-right text-[10px] font-black uppercase text-zinc-600 mt-2 tracking-widest">
                                                    {field.value.length}_OF_120_CHUNKS_USED
                                                </FormDescription>
                                                <FormMessage className="font-bold text-[10px] uppercase tracking-wider" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="fullDesc"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.25em] mb-3">Complete_Log_Data</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="EXECUTE_FULL_DOCUMENTATION_ROUTINE..."
                                                        className="min-h-[200px] bg-white/5 border-white/5 focus:border-primary/50 rounded-2xl transition-all text-md font-medium p-6 resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="font-bold text-[10px] uppercase tracking-wider" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="image"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.25em] mb-3">Visual_Asset_Link (OPTIONAL)</FormLabel>
                                                <FormControl>
                                                    <div className="flex gap-6 items-start">
                                                        <div className="flex-grow">
                                                            <Input placeholder="HTTPS://ASSET_STORAGE..." {...field} className="h-14 bg-white/5 border-white/5 focus:border-primary/50 rounded-2xl transition-all font-mono text-xs" />
                                                        </div>
                                                        <div className="h-14 w-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden shrink-0 shadow-lg group">
                                                            {previewImage ? (
                                                                <Image
                                                                    src={previewImage}
                                                                    alt="Preview"
                                                                    width={56}
                                                                    height={56}
                                                                    className="object-cover h-full w-full group-hover:scale-125 transition-transform"
                                                                    onError={(e) => {
                                                                        (e.target as any).src = "https://via.placeholder.com/56?text=ERR";
                                                                    }}
                                                                />
                                                            ) : (
                                                                <ImageIcon className="h-6 w-6 text-zinc-700" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormDescription className="text-[10px] font-bold text-zinc-600 mt-2 uppercase tracking-widest leading-relaxed">
                                                    推奨: USE_UNSPLASH_OR_PIXABAY_ASSET_REPOSITORY_FOR_OPTIMAL_RESOLUTION.
                                                </FormDescription>
                                                <FormMessage className="font-bold text-[10px] uppercase tracking-wider" />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex flex-col sm:flex-row justify-end gap-6 pt-8 border-t border-white/5">
                                        <Button variant="ghost" type="button" size="lg" className="h-16 px-10 rounded-2xl font-bold uppercase tracking-widest text-xs text-zinc-500 hover:text-white" onClick={() => router.push("/manage-products")} disabled={isSubmitting}>
                                            ABORT_PROCESS
                                        </Button>
                                        <Button type="submit" size="lg" className="h-16 px-12 rounded-2xl font-black tracking-[0.2em] shadow-2xl shadow-primary/30 min-w-[200px]" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                                    INITIATING...
                                                </>
                                            ) : "SUBMIT_DATA"}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
