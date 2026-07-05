import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
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

        const body = await req.json();
        const product = {
            ...body,
            sellerId: session.user.email,
            sellerName: seller.shopName,
            createdAt: new Date(),
        };

        const result = await db.collection("products").insertOne(product);
        return NextResponse.json({ ...product, _id: result.insertedId }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to add product" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await req.json();
        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection("products").deleteOne({
            id,
            sellerId: session.user.email,
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "Product not found or not yours" }, { status: 404 });
        }

        return NextResponse.json({ message: "Product deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Failed to delete product" }, { status: 500 });
    }
}
