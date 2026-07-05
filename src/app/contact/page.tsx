"use client";

import { motion } from "framer-motion";
import {
    Clock,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    Send,
    Loader2
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success("COMMUNICATION_ESTABLISHED: Message successfully sent to the NovaGear nexus.");
        setIsSubmitting(false);
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="bg-mesh min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-bold uppercase tracking-widest mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Secure_Communication_Terminal
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-gradient uppercase">
                        Link with the <span className="text-gradient-primary">Nexus</span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
                        Initiate a direct uplink to our engineering and support collectives.
                        Response protocols are optimized for rapid resolution.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 rounded-[2.5rem] p-8">
                                <CardContent className="p-0 space-y-8">
                                    <div className="flex items-start gap-6 group">
                                        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors shrink-0">
                                            <Mail className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-600 mb-2">Direct_Uplink</p>
                                            <p className="text-lg font-bold text-white">support@novagear.com</p>
                                            <p className="text-sm text-zinc-500 font-medium">Encrypted broadcast channel</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6 group">
                                        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors shrink-0">
                                            <MapPin className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-600 mb-2">Nexus_Location</p>
                                            <p className="text-lg font-bold text-white">Market St, San Francisco</p>
                                            <p className="text-sm text-zinc-500 font-medium">Silicon Valley Sector 7</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6 group">
                                        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors shrink-0">
                                            <ShieldCheck className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-600 mb-2">Data_Protection</p>
                                            <p className="text-lg font-bold text-white">Full AES-256 Encryption</p>
                                            <p className="text-sm text-zinc-500 font-medium">Compliance-standard protocols</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8 flex items-center gap-6"
                        >
                            <Clock className="h-10 w-10 text-primary animate-pulse shrink-0" />
                            <div>
                                <h3 className="font-bold text-white uppercase tracking-wider mb-1">Response_Vigilance</h3>
                                <p className="text-sm text-zinc-400 font-medium leading-tight">
                                    Our live support stream is active 24/7/365.
                                    Average processing time: 4.8 minutes.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <CardContent className="p-10">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Entity_Identifier</label>
                                        <Input
                                            required
                                            placeholder="ENTER_YOUR_NAME"
                                            className="h-14 bg-white/5 border-white/5 focus:border-primary/50 rounded-2xl font-bold transition-all text-lg"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Comm_Address</label>
                                        <Input
                                            required
                                            type="email"
                                            placeholder="ENTER_EMAIL_ADDRESS"
                                            className="h-14 bg-white/5 border-white/5 focus:border-primary/50 rounded-2xl font-bold transition-all text-lg"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Message_Data_Buffer</label>
                                        <Textarea
                                            required
                                            placeholder="TRANSMIT_DETAILED_QUERY..."
                                            className="min-h-[160px] bg-white/5 border-white/5 focus:border-primary/50 rounded-2xl font-medium transition-all text-md resize-none p-6"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-primary/20"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                                TRANSMITTING...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-3 h-4 w-4" />
                                                EXECUTE_DUMPLINK
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
