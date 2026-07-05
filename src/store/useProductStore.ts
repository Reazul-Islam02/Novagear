import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types";

interface ProductState {
    products: Product[];
    addProduct: (product: Product) => void;
    deleteProduct: (id: string) => void;
    getProductById: (id: string) => Product | undefined;
    setProducts: (products: Product[]) => void;
}

export const useProductStore = create<ProductState>()(
    persist(
        (set, get) => ({
            products: [],
            addProduct: (product) =>
                set((state) => ({ products: [product, ...state.products] })),
            deleteProduct: (id) =>
                set((state) => ({
                    products: state.products.filter((p) => p.id !== id),
                })),
            getProductById: (id) => get().products.find((p) => p.id === id),
            setProducts: (products) => set({ products }),
        }),
        {
            name: "novagear-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
