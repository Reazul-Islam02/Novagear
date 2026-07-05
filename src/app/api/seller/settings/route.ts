import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function PATCH(req: Request) {
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

    const { shopName, phone, address, description, logo } = await req.json();

    if (!shopName || shopName.length < 2) {
        return NextResponse.json({ message: "Shop name must be at least 2 characters" }, { status: 400 });
    }

    await db.collection("sellers").updateOne(
        { email: session.user.email },
        {
            $set: {
                shopName,
                phone: phone || seller.phone,
                address: address || seller.address,
                description: description || "",
                logo: logo || "",
                updatedAt: new Date(),
            },
        }
    );

    return NextResponse.json({ message: "Settings updated" });
}
