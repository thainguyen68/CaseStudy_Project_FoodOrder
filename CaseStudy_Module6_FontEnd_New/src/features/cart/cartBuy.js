import {createSlice} from '@reduxjs/toolkit'
const initialState = {
    items: [],
}
export const cartBuySlice = createSlice({
    name: 'cartBuy',
    initialState,
    reducers: {
        addCartBuy: (state, action) => {
            let list = action.payload;
            state.items = list;
            localStorage.setItem('cartBuy', JSON.stringify(state))
        },
        setCartMerchant: (state, action) => {
            const list = localStorage.getItem('cartBuy');
            if (list) {
                const data = JSON.parse(list);
                if (Array.isArray(data.items)) {
                    return { ...state, items: data.items };
                }
            }
            return state; // Return the unchanged state if there's an issue
        },
        confirmOrderBuy: (state, action) => {
            const indexItem = action.payload.index;
            let cartMerchant = localStorage.getItem('cartBuy');
            let data = JSON.parse(cartMerchant);
            if (data && Array.isArray(data.items)) {
                const updateItem = data.items[indexItem];
                updateItem.status = "1";
                data.items[indexItem] = updateItem;
                localStorage.setItem('cartBuy', JSON.stringify(data)); // Store updated data in localStorage
                return { ...state, items: data.items };
            }
            return state; // Return the unchanged state if there's an issue
        },
        deleteBy: (state, action) => {
            const indexItem = action.payload.index;
            let cartMerchant = localStorage.getItem('cartBuy');
            let data = JSON.parse(cartMerchant);
            if (data) {
                const updatedItems = data.items.map((item, index) => {
                    if (index === indexItem) {
                        return {
                            ...item,
                            statusProductsCarts: "1",
                        };
                    }
                    return item;
                });
                data.items.splice(indexItem, 1);
                // const updatedData = { ...data, items: updatedItems };
                localStorage.setItem('cartBuy', JSON.stringify(data));
                return { ...state, items: data.items };
            }
            return state;
        },
    },
})

export const {addCartBuy, confirmOrderBuy} = cartBuySlice.actions

export default cartBuySlice.reducer