import { configureStore } from '@reduxjs/toolkit';
import CartReducer from '../features/cart/cartSlice'
import IdCartLogin from "../features/cart/idCartLogin";
import cartBuy from "../features/cart/cartBuy";
import CartMerchant from "../features/cart/cartMC";


export const store = configureStore({
    reducer: {
        'cart': CartReducer,
        'idCart':IdCartLogin,
        'cartMerchant':CartMerchant,
        'cartBuy':cartBuy,
    },
})