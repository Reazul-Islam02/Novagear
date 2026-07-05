import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { SEED_PRODUCTS } from "@/lib/constants";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db();

        // Seed User
        const demoEmail = "demo@novagear.com";
        const existingUser = await db.collection("users").findOne({ email: demoEmail });

        if (!existingUser) {
            const hashedPassword = await bcrypt.hash("demo123", 10);
            await db.collection("users").insertOne({
                name: "Demo User",
                email: demoEmail,
                password: hashedPassword,
                image: "https://github.com/shadcn.png",
                createdAt: new Date(),
            });
            console.log("Seeded demo user");
        }

        // Seed Products
        const count = await db.collection("products").countDocuments();
        if (count === 0) {
            // Map products to remove ID and let MongoDB generate them (for best practice)
            // or keep them if we use them for keys. I'll keep them for consistency with our existing store.
            await db.collection("products").insertMany(SEED_PRODUCTS);
            console.log("Seeded initial gadgets");
        }

        return NextResponse.json({ message: "Database seeded successfully" });
    } catch (error) {
        console.error("Seed error:", error);
        return NextResponse.json({ message: "Failed to seed database" }, { status: 500 });
    }
}
