import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    items: [],
}

export const cartMerchantSlice = createSlice({
    name: 'cartMerchant',
    initialState,
    reducers: {
        addCartMerchant: (state, action) => {
            let list = action.payload;
           state.items = list;
            localStorage.setItem('list', JSON.stringify(state))
        },
        setCartMerchant: (state, action) => {
            const list = localStorage.getItem('list');
            // console.log(list)
            if (list) {
                const data = JSON.parse(list);
                if (Array.isArray(data.items)) {
                    return { ...state, items: data.items };
                }
            }
            return state; // Return the unchanged state if there's an issue
        },
        confirmOrder: (state, action) => {
            const indexItem = action.payload.index;
            let cartMerchant = localStorage.getItem('list');
            let data = JSON.parse(cartMerchant);
            if (data && Array.isArray(data.items)) {
                const updateItem = data.items[indexItem];
                updateItem.status = "0";
                data.items.splice(indexItem, 1);
                // data.items[indexItem] = updateItem;
                localStorage.setItem('list', JSON.stringify(data)); // Store updated data in localStorage
                return { ...state, items: data.items };
            }
            return state; // Return the unchanged state if there's an issue
        },
        deleteByMerchant: (state, action) => {
            const indexItem = action.payload.index;
            let cartMerchant = localStorage.getItem('list');
            let data = JSON.parse(cartMerchant);
            if (data) {
                const updatedItems = data.items.map((item, index) => {
                    if (index === indexItem) {
                        return {
                            ...item,
                            status: "1",
                        };
                    }
                    return item;
                });
                data.items.splice(indexItem, 1);
                const updatedData = { ...data, items: updatedItems };
                localStorage.setItem('list', JSON.stringify(data));
                return { ...state, items: data.items };
            }
            return state;
        },
    },
})

export const {addCartMerchant, confirmOrder, setCartMerchant,deleteByMerchant} = cartMerchantSlice.actions

export default cartMerchantSlice.reducer