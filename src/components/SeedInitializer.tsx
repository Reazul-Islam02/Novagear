'use client';

import { useEffect } from 'react';
import { useProductStore } from '@/store/useProductStore';
import { SEED_PRODUCTS } from '@/lib/constants';

export function SeedInitializer() {
    const { setProducts } = useProductStore();

    useEffect(() => {
        const initDB = async () => {
            try {
                // Ensure base products and demo user exist in MongoDB
                await fetch('/api/seed');

                // Fetch actual products from MongoDB
                const response = await fetch('/api/products');
                if (response.ok) {
                    const dbProducts = await response.json();
                    setProducts(dbProducts);
                }
            } catch (error) {
                console.error("Failed to sync with MongoDB:", error);
            }
        };

        initDB();
    }, [setProducts]);

    return null;
}
