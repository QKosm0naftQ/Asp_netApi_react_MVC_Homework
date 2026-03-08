import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';
import axiosInstance from "../api/axiosInstance";

export const useCartStore = create(persist(
    (set, get) => ({
        items: [],

        loadCart: async () => {
            const { isAuthenticated } = useAuthStore.getState();
            if (isAuthenticated) {
                const res = await axiosInstance.get(`/api/Cart/getItems`);
                set({ items: res.data });
            }
        },

        addItem: async (productId,quantity) => {
            const { isAuthenticated } = useAuthStore.getState();
            console.log("isAuthenticated",isAuthenticated);
            if (isAuthenticated) {
                await get().addToCart(productId, quantity);
            }
            else{
                const items = get().items;
                const existing = items.find(i => i.productId === productId);

                let updated;
                if (existing) {
                    updated = items.map(i =>
                        i.productId === productId
                            ? { ...i, quantity: quantity }
                            : i
                    );
                } else {
                    const res = await axiosInstance.get(`/api/Products/id/${productId}`);
                    console.log("RES Product", res);
                    if (res.data != null) {
                        const { data } = res;
                        const product = {
                            productId: data.id,
                            name: data.name,
                            imageName: (data.productImages?.length > 0 ? data.productImages[0].name : null),
                            quantity: quantity,
                            categoryName: data.category?.name,
                            categoryId: data.category?.id,
                            price: data.price
                        };
                        updated = [...items, product];
                    }

                }

                set({ items: updated });
            }

        },
        removeItem:async (productId) => {
            const { isAuthenticated } = useAuthStore.getState();
            console.log("productId",productId);
            if(isAuthenticated) {
                await axiosInstance.delete(`/api/Cart/Delete/${productId}`);
            }
            else{
                const updatedItems = get().items.filter(i => i.productId !== productId);
                set({ items: updatedItems });
                localStorage.setItem('guest-cart', JSON.stringify({ state: { items: updatedItems } }));
            }
            await get().loadCart();
        },

        addToCart: async (productId, quantity) => {
            await axiosInstance.post('/api/Cart/CreateUpdate', {
                productId: productId,
                quantity: quantity
            });
            await get().loadCart();
        },

        clearCart: () => {
            set({ items: [] });
            localStorage.removeItem('guest-cart');
        },

        mergeLocalCartToServer: async () => {
            const { items } = get();
            for (let item of items) {
                await get().addToCart(item.productId, item.quantity);
            }
            await get().loadCart();
            localStorage.removeItem('guest-cart');
        },
    }),
    {
        name: 'guest-cart',
    }
));