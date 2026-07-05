import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const client = await clientPromise;
        const db = client.db();

        const seller = await db.collection("sellers").findOne({ email: session.user.email });
        if (!seller) {
            return NextResponse.json({ message: "Not a seller" }, { status: 403 });
        }

        const products = await db.collection("products")
            .find({ sellerId: session.user.email })
            .sort({ createdAt: -1 })
            .toArray();

        const totalProducts = products.length;
        const totalRevenue = products.reduce((sum: number, p: any) => sum + (p.price || 0), 0);

        return NextResponse.json({
            seller,
            products,
            stats: {
                totalProducts,
                totalRevenue,
                pendingOrders: 0,
                totalOrders: 0,
            },
        });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
