import clientPromise from "./src/lib/mongodb.ts";

async function test() {
    try {
        console.log("Connecting to MongoDB...");
        const client = await clientPromise;
        console.log("Connected!");
        const db = client.db();
        const collections = await db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));
        process.exit(0);
    } catch (err) {
        console.error("Connection failed:", err);
        process.exit(1);
    }
}

test();
