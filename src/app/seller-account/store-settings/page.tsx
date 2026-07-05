"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SellerLayout } from "@/components/SellerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Store, MapPin, Phone, Globe, Save, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

interface SellerInfo {
    shopName: string;
    email: string;
    phone: string;
    address: string;
    status: string;
}

export default function StoreSettingsPage() {
    const { status } = useSession();
    const router = useRouter();
    const [seller, setSeller] = useState<SellerInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ shopName: "", phone: "", address: "", description: "", logo: "" });

    useEffect(() => {
        if (status === "unauthenticated") { router.push("/login"); return; }
        if (status === "authenticated") fetchSeller();
    }, [status, router]);

    async function fetchSeller() {
        try {
            const res = await fetch("/api/seller");
            const data = await res.json();
            if (!data.isSeller) { router.push("/seller-account"); return; }
            setSeller(data.seller);
            setForm({
                shopName: data.seller.shopName || "",
                phone: data.seller.phone || "",
                address: data.seller.address || "",
                description: data.seller.description || "",
                logo: data.seller.logo || "",
            });
        } catch { toast.error("Failed to load settings"); }
        finally { setLoading(false); }
    }

    async function handleSave() {
        setSaving(true);
        try {
            const res = await fetch("/api/seller/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Store settings updated!");
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to update settings");
            }
        } catch { toast.error("Something went wrong"); }
        finally { setSaving(false); }
    }

    if (loading) {
        return <SellerLayout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" /></div></SellerLayout>;
    }

    return (
        <SellerLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-black">Store Settings</h1>
                <p className="text-sm text-zinc-500">Customize your shop profile and appearance</p>
            </div>

            <div className="max-w-2xl space-y-6">
                {/* Store Profile */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Store className="h-4 w-4 text-orange-500" />
                                Store Profile
                            </CardTitle>
                            <CardDescription className="text-xs">This info will be visible to customers</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 block">
                                    <Store className="inline h-3 w-3 mr-1" />Shop Name
                                </label>
                                <Input
                                    value={form.shopName}
                                    onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                                    className="h-11 rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/5"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 block">
                                    <ImageIcon className="inline h-3 w-3 mr-1" />Logo URL
                                </label>
                                <Input
                                    value={form.logo}
                                    onChange={(e) => setForm({ ...form, logo: e.target.value })}
                                    placeholder="https://..."
                                    className="h-11 rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/5"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 block">Store Description</label>
                                <Textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Tell customers about your store..."
                                    className="min-h-[100px] rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/5"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Contact Info */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                    <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Phone className="h-4 w-4 text-orange-500" />
                                Contact Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 block">
                                    <Phone className="inline h-3 w-3 mr-1" />Phone
                                </label>
                                <Input
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="h-11 rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/5"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 block">
                                    <MapPin className="inline h-3 w-3 mr-1" />Address
                                </label>
                                <Textarea
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    className="min-h-[80px] rounded-xl bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/5"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Save Button */}
                <Button
                    className="w-full h-12 rounded-xl font-black bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20"
                    onClick={handleSave}
                    disabled={saving}
                >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </SellerLayout>
    );
}
