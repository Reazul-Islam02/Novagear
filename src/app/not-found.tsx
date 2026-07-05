import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Cpu, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
            <div className="mb-8 p-4 rounded-full bg-primary/10">
                <Cpu className="h-16 w-16 text-primary animate-pulse" />
            </div>
            <h1 className="text-6xl font-extrabold tracking-tighter mb-4">404</h1>
            <h2 className="text-3xl font-bold mb-6">Gadget Not Found</h2>
            <p className="text-muted-foreground text-lg max-w-md mb-12">
                Oops! It seems the technology you&apos;re looking for belongs to another timeline. Let&apos;s get you back on track.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gap-2" asChild>
                    <Link href="/">
                        <Home className="h-4 w-4" />
                        Go Home
                    </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2" asChild>
                    <Link href="/shop">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Shop
                    </Link>
                </Button>
            </div>
        </div>
    );
}
