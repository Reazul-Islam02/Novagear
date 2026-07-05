import Link from "next/link";
import { Cpu, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-zinc-950 pt-24 pb-12 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 gap-16 md:grid-cols-4 mb-20">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-8 group">
                            <div className="p-2 rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                                <Cpu className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter">
                                NOVA<span className="text-primary italic">GEAR</span>
                            </span>
                        </Link>
                        <p className="text-sm text-zinc-500 mb-8 leading-relaxed font-medium">
                            The definitive source for next-generation hardware and digital interface units.
                            Architecting the future of human-machine interaction since 20XX.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Instagram, Facebook, Youtube].map((Icon, i) => (
                                <Link key={i} href="#" className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 hover:text-primary hover:bg-primary/10 transition-all">
                                    <Icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.25em] text-white mb-8">Navigation</h3>
                        <ul className="space-y-4 text-sm font-bold tracking-tight text-zinc-500">
                            <li><Link href="/shop" className="hover:text-primary transition-colors flex items-center gap-2">Inventory_Manifest</Link></li>
                            <li><Link href="/shop?cat=Smartphone" className="hover:text-primary transition-colors flex items-center gap-2">Mobile_Nodes</Link></li>
                            <li><Link href="/shop?cat=Laptop" className="hover:text-primary transition-colors flex items-center gap-2">Compute_Stations</Link></li>
                            <li><Link href="/shop?cat=Audio" className="hover:text-primary transition-colors flex items-center gap-2">Audio_Interfaces</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.25em] text-white mb-8">Resources</h3>
                        <ul className="space-y-4 text-sm font-bold tracking-tight text-zinc-500">
                            <li><Link href="/contact" className="hover:text-primary transition-colors flex items-center gap-2">Support_Center</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2">Global_Logistics</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2">Terms_of_Service</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2">Cortex_Privacy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.25em] text-white mb-8">Communications</h3>
                        <p className="text-sm text-zinc-500 mb-6 leading-relaxed font-medium">
                            Join the encrypted broadcast for priority access to experimental hardware drops.
                        </p>
                        <form className="flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="ENTER_EMAIL_ADDR"
                                className="flex h-14 w-full rounded-xl border border-white/5 bg-white/5 px-6 py-2 text-sm font-bold placeholder:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                            />
                            <button className="h-14 w-full rounded-xl bg-primary text-black font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
                                SUBSCRIBE_NOW
                            </button>
                        </form>
                    </div>
                </div>
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                        © {new Date().getFullYear()} NOVAGEAR_SYSTEMS. ALL_RIGHTS_RESERVED.
                    </p>
                    <div className="flex gap-8">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-800">Uptime: 99.99%</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-800">Region: Global</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
