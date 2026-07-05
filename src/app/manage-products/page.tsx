"use client";

import { useProductStore } from "@/store/useProductStore";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Trash2,
    ExternalLink,
    PlusCircle,
    AlertCircle,
    Search
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

export default function ManageProductsPage() {
    const { products, deleteProduct } = useProductStore();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: string, title: string) => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                deleteProduct(id);
                toast.success(`Removed ${title} from NovaGear inventory`);
            } else {
                toast.error(`Failed to delete ${title}`);
            }
        } catch (error) {
            toast.error("An error occurred while deleting the product");
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
    };

    return (
        <div className="bg-mesh min-h-screen">
            <div className="container mx-auto px-4 py-24">
                <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
                    <div>
                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-4">
                            <div className="h-[1px] w-12 bg-primary" />
                            Inventory_Control_Center
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gradient leading-none mb-4">LOGISTICS_DB</h1>
                        <p className="text-zinc-400 text-xl font-light">Monitor terminal status and manage hardware deployments.</p>
                    </div>
                    <Button asChild size="lg" className="h-16 px-10 rounded-2xl font-black tracking-widest shadow-2xl shadow-primary/20">
                        <Link href="/add-product">
                            <PlusCircle className="mr-3 h-5 w-5" />
                            NEW_RECORD
                        </Link>
                    </Button>
                </div>

                <div className="relative mb-12 max-w-xl group">
                    <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <div className="relative flex items-center h-14 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl px-5">
                        <Search className="h-5 w-5 text-zinc-600 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="FILTER_INVENTORY..."
                            className="border-none bg-transparent h-full text-lg focus-visible:ring-0 placeholder:text-zinc-800"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {filteredProducts.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-[2.5rem] border border-white/5 bg-zinc-900/30 backdrop-blur-2xl overflow-hidden shadow-2xl"
                    >
                        {/* Desktop Table */}
                        <div className="hidden md:block">
                            <Table>
                                <TableHeader className="bg-white/5 border-b border-white/5">
                                    <TableRow className="border-none">
                                        <TableHead className="w-[120px] py-6 px-10 font-black tracking-widest text-[10px] uppercase text-zinc-500">Node</TableHead>
                                        <TableHead className="py-6 px-6 font-black tracking-widest text-[10px] uppercase text-zinc-500">Specification</TableHead>
                                        <TableHead className="py-6 px-6 font-black tracking-widest text-[10px] uppercase text-zinc-500">Registry</TableHead>
                                        <TableHead className="py-6 px-6 font-black tracking-widest text-[10px] uppercase text-zinc-500">Cost_Basis</TableHead>
                                        <TableHead className="text-right py-6 px-10 font-black tracking-widest text-[10px] uppercase text-zinc-500">Operations</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.map((product) => (
                                        <TableRow key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                            <TableCell className="py-6 px-10">
                                                <div className="relative h-16 w-20 rounded-2xl overflow-hidden border border-white/10 group-hover:border-primary/50 transition-colors shadow-lg">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 px-6">
                                                <div>
                                                    <p className="font-black text-lg tracking-tight text-white mb-1">{product.title}</p>
                                                    <p className="text-xs text-zinc-500 font-medium line-clamp-1 max-w-[350px]">
                                                        {product.shortDesc}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 px-6">
                                                <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-lg font-bold text-[10px] tracking-widest uppercase">
                                                    {product.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-6 px-6">
                                                <p className="font-black text-xl text-gradient-primary">
                                                    {formatPrice(product.price)}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-right py-6 px-10">
                                                <div className="flex justify-end gap-3">
                                                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-white/5 hover:bg-white/10" asChild>
                                                        <Link href={`/shop/${product.id}`}>
                                                            <ExternalLink className="h-5 w-5 text-zinc-400 group-hover:text-primary transition-colors" />
                                                        </Link>
                                                    </Button>

                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-red-500/5 hover:bg-red-500/20 text-red-400">
                                                                <Trash2 className="h-5 w-5" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="bg-zinc-950 border-white/5 rounded-[2rem]">
                                                            <DialogHeader className="pt-6">
                                                                <DialogTitle className="text-2xl font-black tracking-tighter text-white">DELETE_TERMINATION</DialogTitle>
                                                                <DialogDescription className="text-zinc-500 py-4 text-lg font-light leading-relaxed">
                                                                    Initiating permanent removal of <span className="text-red-400 font-bold italic">&ldquo;{product.title}&rdquo;</span> from global nodes. This operation is irreversible.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <DialogFooter className="pb-8 flex gap-4">
                                                                <Button variant="outline" className="h-14 px-8 rounded-xl border-white/10" asChild>
                                                                    <DialogTrigger asChild>
                                                                        <button>ABORT</button>
                                                                    </DialogTrigger>
                                                                </Button>
                                                                <Button
                                                                    variant="destructive"
                                                                    className="h-14 px-10 rounded-xl font-black tracking-widest shadow-xl shadow-red-500/20"
                                                                    onClick={() => handleDelete(product.id, product.title)}
                                                                >
                                                                    EXECUTE_PURGE
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-px">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="p-8 bg-zinc-900/50 border-b border-white/5 last:border-none">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex gap-6">
                                            <div className="relative h-24 w-24 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                                                <Image
                                                    src={product.image}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-grow flex flex-col justify-center">
                                                <Badge className="bg-primary/20 text-primary border-none mb-3 w-fit tracking-widest text-[10px] font-black uppercase">
                                                    {product.category}
                                                </Badge>
                                                <h3 className="text-xl font-black tracking-tight text-white">{product.title}</h3>
                                                <p className="text-2xl font-black text-gradient-primary mt-2">{formatPrice(product.price)}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <Button variant="outline" className="flex-1 h-14 rounded-xl border-white/10 bg-white/5 font-bold tracking-widest" asChild>
                                                <Link href={`/shop/${product.id}`}>
                                                    VIEW_DATA
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                className="h-14 w-14 rounded-xl shadow-xl shadow-red-500/10"
                                                onClick={() => handleDelete(product.id, product.title)}
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-40 border-2 border-dashed border-white/5 rounded-[3rem] bg-zinc-900/20 backdrop-blur-sm"
                    >
                        <AlertCircle className="h-16 w-16 text-zinc-700 mx-auto mb-8" />
                        <h2 className="text-3xl font-black tracking-tighter text-zinc-500 mb-2 uppercase tracking-[0.25em]">DATABASE_EMPTY</h2>
                        <p className="text-zinc-600 mb-10 text-lg">No synchronized inventory records detected on this channel.</p>
                        <Button asChild size="lg" className="h-16 px-10 rounded-2xl font-black italic tracking-[0.2em] shadow-2xl">
                            <Link href="/add-product">INITIALIZE_FIRST_NODE</Link>
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
