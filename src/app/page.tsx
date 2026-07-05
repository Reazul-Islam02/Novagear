"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { useProductStore } from "@/store/useProductStore";
import {
  ShieldCheck,
  Truck,
  Clock,
  CreditCard,
  Star,
  ChevronRight,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Camera,
  Zap,
  Flame,
  Tag
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const { products } = useProductStore();
  const featuredProducts = products.slice(0, 4);

  const categories = [
    { name: "Smartphones", icon: <Smartphone className="h-8 w-8" />, color: "from-blue-500/20 to-blue-600/10" },
    { name: "Laptops", icon: <Laptop className="h-8 w-8" />, color: "from-purple-500/20 to-purple-600/10" },
    { name: "Audio", icon: <Headphones className="h-8 w-8" />, color: "from-pink-500/20 to-pink-600/10" },
    { name: "Wearables", icon: <Watch className="h-8 w-8" />, color: "from-amber-500/20 to-amber-600/10" },
    { name: "Cameras", icon: <Camera className="h-8 w-8" />, color: "from-cyan-500/20 to-cyan-600/10" },
  ];

  const features = [
    {
      title: "Free Shipping",
      desc: "On all orders over $500",
      icon: <Truck className="h-10 w-10 text-primary" />,
    },
    {
      title: "2-Year Warranty",
      desc: "Comprehensive protection",
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    },
    {
      title: "Secure Checkout",
      desc: "100% encrypted payments",
      icon: <CreditCard className="h-10 w-10 text-primary" />,
    },
    {
      title: "24/7 Support",
      desc: "Always here to help",
      icon: <Clock className="h-10 w-10 text-primary" />,
    },
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Tech Enthusiast",
      content: "NovaGear has the best selection of premium gadgets. My new Nova Pro Max X is incredible!",
      avatar: "https://i.pravatar.cc/150?u=alex",
    },
    {
      name: "Sarah Chen",
      role: "Graphic Designer",
      content: "The customer service is top-notch. They helped me choose the perfect laptop for my work.",
      avatar: "https://i.pravatar.cc/150?u=sarah",
    },
    {
      name: "Michael Ross",
      role: "Professional Photographer",
      content: "Fast shipping and perfect packaging. The CinemaLens 4K exceeded all my expectations.",
      avatar: "https://i.pravatar.cc/150?u=michael",
    },
  ];

  return (
    <div className="flex flex-col bg-mesh min-h-screen">
      {/* Hero Banner Section */}
      <section className="relative pt-24 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 relative rounded-3xl overflow-hidden h-[320px] md:h-[400px] group cursor-pointer"
            >
              <Image
                src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2000&auto=format&fit=crop"
                alt="Hot Deals"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-bold mb-4 w-fit backdrop-blur-sm border border-primary/30">
                  <Flame className="h-4 w-4" />
                  HOT DEALS
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                  Up to <span className="text-primary">70% OFF</span>
                </h1>
                <p className="text-lg text-zinc-300 mb-6 max-w-md">
                  Discover premium electronics at unbeatable prices. Limited time offers on top brands.
                </p>
                <Button size="lg" className="w-fit px-10 h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/30" asChild>
                  <Link href="/shop">Shop Now</Link>
                </Button>
              </div>
            </motion.div>

            {/* Side Banners */}
            <div className="hidden lg:flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative rounded-3xl overflow-hidden flex-1 group cursor-pointer"
              >
                <Image
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"
                  alt="Free Delivery"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1">
                    <Truck className="h-4 w-4" /> Free Delivery
                  </div>
                  <p className="text-white font-bold text-lg">Orders Over $500</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative rounded-3xl overflow-hidden flex-1 group cursor-pointer"
              >
                <Image
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop"
                  alt="Limited Time"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1">
                    <Clock className="h-4 w-4" /> Limited Time
                  </div>
                  <p className="text-white font-bold text-lg">New Arrivals</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="py-12 relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-2xl font-black text-xl shadow-lg shadow-red-500/20">
                <Zap className="h-6 w-6" />
                Flash Sale
              </div>
              <div className="hidden sm:flex items-center gap-2 text-zinc-400">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">On Sale Now</span>
              </div>
            </div>
            <Button variant="outline" className="rounded-xl font-bold border-primary/20 hover:border-primary hover:text-primary gap-2" asChild>
              <Link href="/shop">
                SHOP ALL PRODUCTS <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] rounded-3xl bg-white/5 border border-dashed border-white/10 animate-pulse flex items-center justify-center text-zinc-600">
                  Syncing inventory...
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Why Choose NovaGear */}
      <section id="features" className="py-32 bg-zinc-950/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for Performance</h2>
            <p className="text-xl text-zinc-400">We don&apos;t just sell gadgets; we curate experiences that define the modern era.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-10 rounded-[2rem] border border-white/5 bg-zinc-900/50 hover:bg-zinc-900 transition-all hover:border-primary/50 group"
              >
                <div className="mb-8 p-4 rounded-2xl bg-primary/10 w-fit transform group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Customer Testimonials */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-20" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] opacity-20" />
        </div>

        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20">Community Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-10 rounded-3xl bg-zinc-900/80 border border-white/5 backdrop-blur-sm flex flex-col items-center text-center shadow-xl"
              >
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-xl italic mb-10 text-zinc-300 leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center gap-5 mt-auto">
                  <div className="relative h-14 w-14 rounded-2xl overflow-hidden border-2 border-primary/20 p-1 bg-zinc-800">
                    <div className="relative h-full w-full rounded-xl overflow-hidden">
                      <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white text-lg">{t.name}</p>
                    <p className="text-sm text-primary font-medium tracking-wide uppercase">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 border-t border-white/5 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/shop?cat=${cat.name}`}
                  className="flex flex-col items-center gap-4 p-8 rounded-3xl border border-white/5 bg-zinc-900/50 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] transition-all group"
                >
                  <div className={`p-5 rounded-2xl bg-gradient-to-br ${cat.color} group-hover:scale-110 transition-transform text-zinc-300 group-hover:text-primary`}>
                    {cat.icon}
                  </div>
                  <span className="font-bold text-sm text-zinc-400 group-hover:text-white transition-colors">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 border-t border-white/5 bg-zinc-950/80 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="flex items-center justify-center gap-2 text-primary font-bold uppercase tracking-widest text-sm mb-4">
              <div className="h-[2px] w-8 bg-primary" />
              Contact
              <div className="h-[2px] w-8 bg-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h2>
            <p className="text-xl text-zinc-400 leading-relaxed">
              Have questions about our products or need support? Our team is ready to help you find the perfect tech solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2rem] border border-white/5 bg-zinc-900/50 text-center group hover:border-primary/50 transition-all"
            >
              <div className="mb-6 p-4 rounded-2xl bg-primary/10 w-fit mx-auto group-hover:scale-110 transition-transform">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Support Hours</h3>
              <p className="text-zinc-400">24/7 Live Chat</p>
              <p className="text-zinc-500 text-sm mt-1">Average response: 5 min</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2rem] border border-white/5 bg-zinc-900/50 text-center group hover:border-primary/50 transition-all"
            >
              <div className="mb-6 p-4 rounded-2xl bg-primary/10 w-fit mx-auto group-hover:scale-110 transition-transform">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-primary font-medium">support@novagear.com</p>
              <p className="text-zinc-500 text-sm mt-1">We reply within 24 hours</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2rem] border border-white/5 bg-zinc-900/50 text-center group hover:border-primary/50 transition-all"
            >
              <div className="mb-6 p-4 rounded-2xl bg-primary/10 w-fit mx-auto group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Headquarters</h3>
              <p className="text-zinc-400">San Francisco, CA</p>
              <p className="text-zinc-500 text-sm mt-1">Global shipping available</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 relative text-center overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-gradient leading-tight">
              THE FUTURE IS <br />
              <span className="text-gradient-primary">IN YOUR HANDS</span>
            </h2>
            <p className="text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Don&apos;t just witness the revolution. Lead it. Join the NovaGear collective and redefine what&apos;s possible.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button size="lg" className="px-14 h-18 text-xl rounded-3xl font-bold shadow-2xl shadow-primary/30" asChild>
                <Link href="/shop">Access Store</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-14 h-18 text-xl rounded-3xl font-bold backdrop-blur-md hover:bg-white/5 border-white/10" asChild>
                <Link href="/login">Create Account</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
