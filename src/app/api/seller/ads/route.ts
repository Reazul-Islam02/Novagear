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

    const ads = await db
        .collection("advertisements")
        .find({ sellerId: session.user.email })
        .sort({ createdAt: -1 })
        .toArray();

    return NextResponse.json({ ads });
}

export async function POST(req: Request) {
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

    const { productId, productTitle, budget, duration, adType } = await req.json();

    if (!productId || !budget || !duration || !adType) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const ad = {
        sellerId: session.user.email,
        sellerName: seller.shopName,
        productId,
        productTitle: productTitle || "",
        budget: Number(budget),
        duration: Number(duration),
        adType,
        status: "active",
        impressions: 0,
        clicks: 0,
        spent: 0,
        createdAt: new Date(),
    };

    await db.collection("advertisements").insertOne(ad);
    return NextResponse.json(ad, { status: 201 });
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { adId } = await req.json();
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("advertisements").deleteOne({
        _id: adId,
        sellerId: session.user.email,
    });

    if (result.deletedCount === 0) {
        return NextResponse.json({ message: "Ad not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Ad deleted" });
}
