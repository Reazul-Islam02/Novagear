import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { auth } from "@/auth";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db();
        const products = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray();
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const client = await clientPromise;
        const db = client.db();
        const body = await req.json();

        // Add createdAt if not present
        const product = {
            ...body,
            createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
        };

        const result = await db.collection("products").insertOne(product);
        return NextResponse.json({ ...product, _id: result.insertedId }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
