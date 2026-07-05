"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SellerLayout } from "@/components/SellerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Megaphone, Target, Gift, Tag, Zap, TrendingUp,
    BarChart3, Users, Star, ArrowRight, Percent, Share2,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const marketingTools = [
    {
        title: "Promotions & Vouchers",
        desc: "Create discount codes and vouchers to attract more customers. Set min spend, expiry dates, and usage limits.",
        icon: Tag,
        color: "text-green-500",
        bg: "bg-green-50 dark:bg-green-500/10",
        href: "#",
    },
    {
        title: "Flash Sales",
        desc: "Set up time-limited deals with deep discounts to drive urgency and boost sales volume.",
        icon: Zap,
        color: "text-yellow-500",
        bg: "bg-yellow-50 dark:bg-yellow-500/10",
        href: "#",
    },
    {
        title: "Bundle Deals",
        desc: "Combine products into bundles at discounted prices to increase average order value.",
        icon: Gift,
        color: "text-purple-500",
        bg: "bg-purple-50 dark:bg-purple-500/10",
        href: "#",
    },
    {
        title: "Free Shipping",
        desc: "Offer free shipping on selected products or minimum order amounts to reduce cart abandonment.",
        icon: Target,
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-500/10",
        href: "#",
    },
    {
        title: "Paid Advertising",
        desc: "Boost product visibility with paid search ads, banner placements, and featured listings.",
        icon: Megaphone,
        color: "text-orange-500",
        bg: "bg-orange-50 dark:bg-orange-500/10",
        href: "/seller-account/advertising",
    },
    {
        title: "Social Media Sharing",
        desc: "Generate shareable product links and promotional content for social media platforms.",
        icon: Share2,
        color: "text-pink-500",
        bg: "bg-pink-50 dark:bg-pink-500/10",
        href: "#",
    },
];

const tips = [
    { title: "Optimize product titles with keywords buyers search for", icon: Star },
    { title: "Use high-quality images from multiple angles", icon: Star },
    { title: "Price competitively and run promotions regularly", icon: Star },
    { title: "Respond to customer messages within 1 hour", icon: Star },
];

export default function MarketingCenterPage() {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    return (
        <SellerLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-black">Marketing Center</h1>
                <p className="text-sm text-zinc-500">Tools to promote your products and grow your business</p>
            </div>

            {/* Performance Banner */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white mb-6"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black mb-1">Boost Your Sales</h2>
                        <p className="text-white/80 text-sm">Use marketing tools to increase visibility and drive more sales to your store.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="text-center px-4">
                            <p className="text-2xl font-black">0</p>
                            <p className="text-[10px] text-white/70 uppercase tracking-wider">Active Campaigns</p>
                        </div>
                        <div className="text-center px-4 border-l border-white/20">
                            <p className="text-2xl font-black">0</p>
                            <p className="text-[10px] text-white/70 uppercase tracking-wider">Total Reach</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Marketing Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                {marketingTools.map((tool, i) => (
                    <motion.div
                        key={tool.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl hover:border-orange-500/30 transition-colors h-full">
                            <CardContent className="p-5">
                                <div className={`w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center mb-4`}>
                                    <tool.icon className={`h-6 w-6 ${tool.color}`} />
                                </div>
                                <h3 className="font-bold text-sm mb-2">{tool.title}</h3>
                                <p className="text-xs text-zinc-500 mb-4 leading-relaxed">{tool.desc}</p>
                                <Button
                                    variant="outline"
                                    className="w-full rounded-xl text-xs font-bold border-zinc-200 dark:border-white/5 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:border-orange-300 dark:hover:border-orange-500/30 hover:text-orange-600"
                                    asChild={tool.href !== "#"}
                                >
                                    {tool.href !== "#" ? (
                                        <Link href={tool.href}>
                                            Set Up <ArrowRight className="h-3 w-3 ml-1" />
                                        </Link>
                                    ) : (
                                        <>Coming Soon</>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Tips */}
            <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                        Tips to Increase Your Sales
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tips.map((tip, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-white/5">
                                <Star className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-zinc-600 dark:text-zinc-400">{tip.title}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </SellerLayout>
    );
}
