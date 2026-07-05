"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, Cpu, LogOut, PlusSquare, Settings, ShoppingCart, Minus, Plus, Trash2, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";

export function Navbar() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const { items, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCartStore();
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop" },
        { name: "Features", href: "/#features" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
            <div className="container mx-auto px-4">
                <div className="flex h-20 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Cpu className="h-6 w-6 text-primary animate-pulse" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">
                            NOVA<span className="text-primary italic">GEAR</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:gap-10">
                        <Link
                            href="/seller-account"
                            className="text-[11px] font-bold tracking-wide text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1"
                        >
                            <Store className="h-3.5 w-3.5" />
                            Become a Seller
                        </Link>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-bold tracking-wide uppercase transition-all hover:text-primary relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Cart Button */}
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative h-12 w-12 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10"
                                onClick={() => setCartOpen(!cartOpen)}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[11px] font-bold flex items-center justify-center text-white shadow-lg shadow-primary/30">
                                        {totalItems > 9 ? "9+" : totalItems}
                                    </span>
                                )}
                            </Button>

                            {/* Cart Dropdown */}
                            <AnimatePresence>
                                {cartOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                                    >
                                        <div className="p-4 border-b border-white/5">
                                            <h3 className="font-bold text-lg">Shopping Cart</h3>
                                            <p className="text-sm text-zinc-400">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {items.length === 0 ? (
                                                <div className="p-8 text-center text-zinc-500">
                                                    <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-30" />
                                                    <p className="font-medium">Your cart is empty</p>
                                                    <p className="text-sm mt-1">Add items to get started</p>
                                                </div>
                                            ) : (
                                                items.map((item) => (
                                                    <div key={item.product.id} className="flex items-center gap-3 p-3 border-b border-white/5 hover:bg-white/5 transition-colors">
                                                        <div className="relative h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                                                            <Image
                                                                src={item.product.image}
                                                                alt={item.product.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold truncate">{item.product.title}</p>
                                                            <p className="text-sm text-primary font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <button
                                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                                    className="h-6 w-6 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                                                >
                                                                    <Minus className="h-3 w-3" />
                                                                </button>
                                                                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                                    className="h-6 w-6 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                                                >
                                                                    <Plus className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(item.product.id)}
                                                            className="p-2 rounded-xl hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        {items.length > 0 && (
                                            <div className="p-4 border-t border-white/5 space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-zinc-400">Total</span>
                                                    <span className="font-bold text-lg text-primary">${totalPrice.toFixed(2)}</span>
                                                </div>
                                                <Button className="w-full rounded-xl font-bold" asChild>
                                                    <Link href="/shop" onClick={() => setCartOpen(false)}>PROCEED TO CHECKOUT ({totalItems})</Link>
                                                </Button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-12 w-12 rounded-2xl overflow-hidden border border-white/5 bg-white/5 hover:bg-white/10 p-0">
                                        <Avatar className="h-full w-full">
                                            <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                                            <AvatarFallback className="bg-primary/20 text-primary font-bold">
                                                {session.user?.name?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64 mt-2 bg-zinc-900/90 backdrop-blur-xl border-white/10" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal p-4">
                                        <div className="flex flex-col space-y-2">
                                            <p className="text-sm font-bold leading-none text-white">{session.user?.name}</p>
                                            <p className="text-xs leading-none text-zinc-400">
                                                {session.user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/5" />
                                    <DropdownMenuItem asChild className="p-3 cursor-pointer focus:bg-primary/10 focus:text-primary">
                                        <Link href="/add-product">
                                            <PlusSquare className="mr-3 h-4 w-4" />
                                            <span className="font-medium">New Production</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="p-3 cursor-pointer focus:bg-primary/10 focus:text-primary">
                                        <Link href="/manage-products">
                                            <Settings className="mr-3 h-4 w-4" />
                                            <span className="font-medium">System Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="p-3 cursor-pointer focus:bg-orange-500/10 focus:text-orange-500">
                                        <Link href="/seller-account/dashboard">
                                            <Store className="mr-3 h-4 w-4" />
                                            <span className="font-medium">Seller Center</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/5" />
                                    <DropdownMenuItem
                                        className="p-3 cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                    >
                                        <LogOut className="mr-3 h-4 w-4" />
                                        <span className="font-medium">Terminate Session</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="hidden items-center gap-4 md:flex">
                                <Button variant="ghost" className="font-bold tracking-wide" asChild>
                                    <Link href="/login">SIGN IN</Link>
                                </Button>
                                <Button className="font-bold px-8 rounded-xl shadow-lg shadow-primary/20" asChild>
                                    <Link href="/login?tab=register">REGISTER</Link>
                                </Button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-foreground"
                            >
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b bg-background md:hidden"
                    >
                        <div className="space-y-1 px-4 pb-3 pt-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-primary/10 hover:text-primary"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="/seller-account"
                                className="rounded-md px-3 py-2 text-base font-medium text-orange-500 hover:bg-orange-500/10 transition-colors flex items-center gap-2"
                                onClick={() => setIsOpen(false)}
                            >
                                <Store className="h-4 w-4" />
                                Become a Seller
                            </Link>
                            {!session && (
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <Button variant="outline" asChild onClick={() => setIsOpen(false)}>
                                        <Link href="/login">Login</Link>
                                    </Button>
                                    <Button asChild onClick={() => setIsOpen(false)}>
                                        <Link href="/login?tab=register">Register</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
