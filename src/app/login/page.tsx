"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Cpu, Github, Mail } from "lucide-react";
import { motion } from "framer-motion";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialTab = searchParams.get("tab") || "login";
    const [activeTab, setActiveTab] = useState(initialTab);
    const [isLoading, setIsLoading] = useState(false);

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema) as any,
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const registerForm = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema) as any,
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onLogin(values: z.infer<typeof loginSchema>) {
        setIsLoading(true);
        try {
            const result = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Invalid credentials. Try demo@novagear.com / demo123");
            } else {
                toast.success("Welcome back to NovaGear!");
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    async function onRegister(values: z.infer<typeof registerSchema>) {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Registration failed");
            } else {
                toast.success("Account created successfully! Please sign in.");
                setActiveTab("login");
                registerForm.reset();
            }
        } catch (error) {
            toast.error("An unexpected error occurred during registration");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 overflow-hidden bg-mesh">
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop"
                        alt="Auth Background"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover opacity-20 filter grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
                </div>
                <div className="relative z-20 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/20">
                        <Cpu className="h-8 w-8 text-primary" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter italic">NOVAGEAR.SYS</span>
                </div>
                <div className="relative z-20 mt-auto">
                    <motion.blockquote
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 max-w-lg p-8 rounded-3xl glass shadow-2xl"
                    >
                        <p className="text-2xl font-light italic leading-relaxed">
                            &ldquo;Accessing the next generation of commerce. The prepare-today directive is now active.&rdquo;
                        </p>
                        <footer className="text-primary font-bold tracking-widest uppercase text-sm">Central Repository // Node_01</footer>
                    </motion.blockquote>
                </div>
            </div>
            <div className="lg:p-8 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[450px]"
                >
                    <div className="flex flex-col space-y-2 text-center">
                        <h2 className="text-3xl font-black tracking-tighter text-gradient">IDENTIFICATION_REQUIRED</h2>
                        <p className="text-zinc-500 text-sm">Enter secure credentials to bypass protection.</p>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 p-1 bg-zinc-900 border border-white/5 rounded-2xl h-14">
                            <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-zinc-800 data-[state=active]:text-primary font-bold transition-all">SIGN IN</TabsTrigger>
                            <TabsTrigger value="register" className="rounded-xl data-[state=active]:bg-zinc-800 data-[state=active]:text-primary font-bold transition-all">INITIALIZE</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login" className="mt-8">
                            <Card className="border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-zinc-900/40 backdrop-blur-2xl rounded-3xl">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-2">
                                        <div className="h-1 w-4 bg-primary rounded-full" />
                                        Secure Channel
                                    </div>
                                    <CardTitle className="text-xl font-bold">Encrypted Login</CardTitle>
                                    <CardDescription className="text-zinc-500">
                                        Default Override: <span className="text-primary font-mono select-all">demo@novagear.com</span> / <span className="text-primary font-mono select-all">demo123</span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <Form {...loginForm}>
                                        <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                                            <FormField
                                                control={loginForm.control}
                                                name="email"
                                                render={({ field }: { field: any }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Entry Point</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="EMAIL_ADDRESS" {...field} className="h-12 bg-white/5 border-white/5 focus:border-primary/50 rounded-xl transition-all" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={loginForm.control}
                                                name="password"
                                                render={({ field }: { field: any }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Pass Key</FormLabel>
                                                        <FormControl>
                                                            <Input type="password" placeholder="••••••••" {...field} className="h-12 bg-white/5 border-white/5 focus:border-primary/50 rounded-xl transition-all" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" className="w-full h-12 rounded-xl font-black tracking-widest shadow-lg shadow-primary/20" disabled={isLoading}>
                                                {isLoading ? "AUTHENTICATING..." : "BYPASS_GUARD"}
                                            </Button>
                                        </form>
                                    </Form>

                                    <div className="relative py-2">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-white/5" />
                                        </div>
                                        <div className="relative flex justify-center text-[10px] uppercase tracking-tighter">
                                            <span className="bg-zinc-900 px-3 text-zinc-600 font-bold">
                                                External Auth Nodes
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        type="button"
                                        className="w-full h-12 rounded-xl border-white/5 bg-white/5 hover:bg-white/10 transition-all font-bold"
                                        onClick={() => signIn("google", { callbackUrl: "/" })}
                                    >
                                        <Mail className="mr-3 h-4 w-4 text-primary" />
                                        Auth via Google_Services
                                    </Button>
                                </CardContent>
                                <CardFooter>
                                    <p className="text-[10px] text-center text-zinc-600 uppercase tracking-widest leading-relaxed font-bold">
                                        System protocols active. Encryption standards: AES-256.
                                        Unauthorized access is strictly logged.
                                    </p>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="register" className="mt-8">
                            <Card className="border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-zinc-900/40 backdrop-blur-2xl rounded-3xl">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-2">
                                        <div className="h-1 w-4 bg-primary rounded-full" />
                                        New Directory Entry
                                    </div>
                                    <CardTitle className="text-xl font-bold">Identity Protocol</CardTitle>
                                    <CardDescription className="text-zinc-500">
                                        Initialize your digital signature for full terminal access.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...registerForm}>
                                        <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                                            <FormField
                                                control={registerForm.control}
                                                name="name"
                                                render={({ field }: { field: any }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Alias</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="FULL_NAME" {...field} className="h-12 bg-white/5 border-white/5 focus:border-primary/50 rounded-xl transition-all" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={registerForm.control}
                                                name="email"
                                                render={({ field }: { field: any }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Email Address</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="COMM_ADDR" {...field} className="h-12 bg-white/5 border-white/5 focus:border-primary/50 rounded-xl transition-all" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={registerForm.control}
                                                name="password"
                                                render={({ field }: { field: any }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Primary Key</FormLabel>
                                                        <FormControl>
                                                            <Input type="password" placeholder="••••••••" {...field} className="h-12 bg-white/5 border-white/5 focus:border-primary/50 rounded-xl transition-all" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={registerForm.control}
                                                name="confirmPassword"
                                                render={({ field }: { field: any }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Verify Key</FormLabel>
                                                        <FormControl>
                                                            <Input type="password" placeholder="••••••••" {...field} className="h-12 bg-white/5 border-white/5 focus:border-primary/50 rounded-xl transition-all" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" className="w-full h-14 rounded-xl font-black tracking-widest shadow-xl shadow-primary/20 mt-4" disabled={isLoading}>
                                                {isLoading ? "INITIALIZING..." : "EXECUTE_REGISTRATION"}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </div >
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full bg-mesh flex items-center justify-center text-primary font-mono animate-pulse uppercase tracking-[1em]">Establishing Connection...</div>}>
            <LoginContent />
        </Suspense>
    );
}
