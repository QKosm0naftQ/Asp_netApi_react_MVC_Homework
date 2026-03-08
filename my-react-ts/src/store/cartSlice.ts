import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ICartItem {
  id?: number;
  productId?: number;
  categoryId?: number;
  name?: string;
  categoryName?: string;
  quantity?: number;
  price?: number;
  sizeName?: string;
  imageName?: string;
}

export interface ICartState {
  items: ICartItem[];
  totalPrice: number;
}


const initialState: ICartState =
{
  items: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],
  totalPrice: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    createUpdateCartLocal: (state, action: PayloadAction<ICartItem[]>) => {
      state.items = action.payload;


      // localStorage.setItem('cart', JSON.stringify(state));
    },

    // removeCartItemLocal: (state, action: PayloadAction<IRemoveCartItem>) => {
    //     const removeCart = action.payload;
    //
    //     state.localCart.items = state.localCart.items.filter(el  => el.productId != removeCart.id);
    //     localStorage.setItem('cart', JSON.stringify(state.localCart));
    // },
    //
    // clearLocalCartLocal: (state) => {
    //     state.localCart.items = [];
    //     localStorage.removeItem('cart');
    // },
  },
});

export const { createUpdateCartLocal } = cartSlice.actions;


export default cartSlice.reducer;
