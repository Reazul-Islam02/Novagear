export type Product = {
    id: string;
    title: string;
    shortDesc: string;
    fullDesc: string;
    price: number;
    category: string;
    image: string;
    createdAt: Date;
    sellerId?: string;
    sellerName?: string;
};

export type Category = "Smartphone" | "Laptop" | "Audio" | "Wearable" | "Camera" | "Accessory";

export type Seller = {
    _id?: string;
    userId: string;
    shopName: string;
    email: string;
    phone: string;
    address: string;
    status: "pending" | "active" | "suspended";
    createdAt: Date;
};
