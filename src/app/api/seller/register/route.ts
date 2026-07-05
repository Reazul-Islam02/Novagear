import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Please sign in first" }, { status: 401 });
    }

    try {
        const { shopName, phone, address } = await req.json();

        if (!shopName || !phone || !address) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        const existing = await db.collection("sellers").findOne({ email: session.user.email });
        if (existing) {
            return NextResponse.json({ message: "Seller account already exists" }, { status: 400 });
        }

        const result = await db.collection("sellers").insertOne({
            userId: session.user.email,
            shopName,
            email: session.user.email,
            phone,
            address,
            status: "active",
            createdAt: new Date(),
        });

        return NextResponse.json(
            { message: "Seller account created successfully", sellerId: result.insertedId },
            { status: 201 }
        );
    } catch (error) {
        console.error("Seller registration error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
