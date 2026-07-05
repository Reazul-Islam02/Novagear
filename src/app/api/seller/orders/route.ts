import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const seller = await db.collection("sellers").findOne({ email: session.user.email });
    if (!seller) {
        return NextResponse.json({ message: "Not a seller" }, { status: 403 });
    }

    const orders = await db
        .collection("orders")
        .find({ sellerId: session.user.email })
        .sort({ createdAt: -1 })
        .toArray();

    return NextResponse.json({ orders });
}

export async function PATCH(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status } = await req.json();
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
        return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("orders").updateOne(
        { _id: orderId, sellerId: session.user.email },
        { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
        return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order updated" });
}
