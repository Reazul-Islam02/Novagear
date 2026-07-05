"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Store, MapPin, Phone, CheckCircle2, ArrowRight, ShieldCheck, TrendingUp, Package } from "lucide-react";
import { motion } from "framer-motion";

const sellerSchema = z.object({
    shopName: z.string().min(2, "Shop name must be at least 2 characters"),
    phone: z.string().min(7, "Enter a valid phone number"),
    address: z.string().min(10, "Address must be at least 10 characters"),
});

const steps = [
    { id: 1, title: "Email", icon: CheckCircle2, done: true },
    { id: 2, title: "Address", icon: MapPin, done: false },
    { id: 3, title: "ID Bank", icon: ShieldCheck, done: false },
    { id: 4, title: "Product", icon: Package, done: false },
];

export default function SellerAccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof sellerSchema>>({
        resolver: zodResolver(sellerSchema) as any,
        defaultValues: {
            shopName: "",
            phone: "",
            address: "",
        },
    });

    async function onSubmit(values: z.infer<typeof sellerSchema>) {
        setIsLoading(true);
        try {
            const response = await fetch("/api/seller/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Registration failed");
            } else {
                toast.success("Seller account created! Welcome to Seller Center.");
                router.push("/seller-account/dashboard");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-mesh">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-mesh px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6 max-w-md"
                >
                    <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Store className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Sign In Required</h1>
                    <p className="text-zinc-400">
                        You need to sign in to your NovaGear account before registering as a seller.
                    </p>
                    <Button className="rounded-xl font-bold px-8" asChild>
                        <Link href="/login?tab=login&redirect=/seller-account">
                            SIGN IN TO CONTINUE
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-mesh">
            {/* Header with Steps */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-6 px-4">
                <div className="container mx-auto">
                    <h1 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                        <Store className="h-7 w-7" />
                        Seller Center
                    </h1>
                    <div className="flex items-center justify-between max-w-2xl">
                        {steps.map((step, i) => (
                            <div key={step.id} className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 
                                    ${step.done ? "bg-white text-orange-500 border-white" : "border-white/50 text-white/80"}`}>
                                    {step.done ? <CheckCircle2 className="h-5 w-5" /> : step.id}
                                </div>
                                <span className="text-white/90 font-medium text-sm hidden sm:inline">{step.title}</span>
                                {i < steps.length - 1 && (
                                    <div className="w-8 sm:w-16 h-[2px] bg-white/30 mx-2" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Benefits */}
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-xl font-bold mb-4">Why sell on NovaGear?</h2>
                        {[
                            { icon: TrendingUp, title: "Grow Your Business", desc: "Reach millions of tech enthusiasts looking for premium gadgets." },
                            { icon: ShieldCheck, title: "Secure Platform", desc: "AES-256 encryption and fraud protection for all transactions." },
                            { icon: Package, title: "Easy Management", desc: "Powerful seller dashboard to manage products, orders, and analytics." },
                        ].map((benefit) => (
                            <div key={benefit.title} className="p-4 rounded-2xl glass border border-white/5 flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <benefit.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">{benefit.title}</h3>
                                    <p className="text-xs text-zinc-400 mt-1">{benefit.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Registration Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="border-white/5 bg-zinc-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl">
                                <CardHeader>
                                    <div className="flex items-center gap-2 text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">
                                        <div className="h-1 w-4 bg-orange-500 rounded-full" />
                                        Seller Registration
                                    </div>
                                    <CardTitle className="text-xl font-bold">Set Up Your Shop</CardTitle>
                                    <CardDescription className="text-zinc-500">
                                        Signed in as <span className="text-primary font-mono">{session.user?.email}</span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                            <FormField
                                                control={form.control}
                                                name="shopName"
                                                render={({ field }: { field: any }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                                                            <Store className="inline h-3 w-3 mr-1" />
                                                            Shop Name
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. TechWorld Store" {...field} className="h-12 bg-white/5 border-white/5 focus:border-orange-500/50 rounded-xl" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }: { field: any }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                                                            <Phone className="inline h-3 w-3 mr-1" />
                                                            Phone Number
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="+1 234 567 8900" {...field} className="h-12 bg-white/5 border-white/5 focus:border-orange-500/50 rounded-xl" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }: { field: any }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                                                            <MapPin className="inline h-3 w-3 mr-1" />
                                                            Pickup Address
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="Full address for order fulfillment" {...field} className="bg-white/5 border-white/5 focus:border-orange-500/50 rounded-xl min-h-[80px]" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button
                                                type="submit"
                                                className="w-full h-12 rounded-xl font-black tracking-widest bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? "CREATING SHOP..." : "CREATE SELLER ACCOUNT"}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                                <CardFooter>
                                    <p className="text-[10px] text-center text-zinc-600 uppercase tracking-widest leading-relaxed font-bold">
                                        By registering, you agree to NovaGear Seller Terms of Service and Privacy Policy.
                                    </p>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
