import {createSlice, current} from '@reduxjs/toolkit'
import Swal from "sweetalert2";

const initialState = {
    items: [],
    totalQuantity: 0,
    totalMoney: 0
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addCart: (state, action) => {
            const foodBuy = action.payload.food;
            // console.log(foodBuy)
            const quantity = action.payload.quantity;
            // console.log(quantity)
            const existingItemIndex = state.items.findIndex(item => item.food.id === foodBuy.id);
            if (existingItemIndex === -1) {
                const newItem = {
                    food: foodBuy,
                    quantity: quantity,
                    money: quantity * foodBuy.price*(100 - foodBuy.voucher.percent)/100
                };
                state.items.push(newItem)
                state.totalQuantity++; // Increment the total quantity
                state.totalMoney += quantity * foodBuy.price*(100 - foodBuy.voucher.percent)/100;
            } else {
                // Existing item
                if(state.items[existingItemIndex].quantity + quantity <= foodBuy.quantity){
                    state.items[existingItemIndex].quantity += quantity;
                    state.items[existingItemIndex].money += quantity * foodBuy.price *(100-foodBuy.voucher.percent)/100
                    state.totalMoney = state.totalMoney + quantity * foodBuy.price *(100-foodBuy.voucher.percent)/100
                }else {
                    Swal.fire({
                        width: '450px',
                        position: 'center',
                        title: 'Số lượng sản phẩm không đủ',
                        icon: 'info'
                    })
                }
            }
            localStorage.setItem('cart', JSON.stringify(state));
        },
        setCart: (state, action) => {
            let cart = localStorage.getItem('cart');
            if (cart) {
                let data = JSON.parse(cart);
                state.items = data.items;
                state.totalQuantity = data.totalQuantity;
                state.totalMoney = data.totalMoney;
            } else {
                state.items = [];
                state.totalQuantity = 0;
                state.totalMoney = 0;
            }
        },
        deleteItem: (state, action) => {
            const indexItem = action.payload.index;
            let cart = localStorage.getItem('cart');
            let data = JSON.parse(cart);
            if (data) {
                const deletedItem = data.items[indexItem];
                const deletedItemPrice = deletedItem.money;
                data.items.splice(indexItem, 1);
                data.totalQuantity--;
                // Trừ tiền của phần tử bị xóa khỏi tổng tiền
                data.totalMoney -= deletedItemPrice;
                state.items = data.items;
                state.totalQuantity = data.totalQuantity;
                state.totalMoney = data.totalMoney;
                // console.log(data.totalMoney)
                localStorage.setItem('cart', JSON.stringify(state));
            }
        },

        setStatus: (state, action) => {
            let id = action.payload.food.statusProducts
        },
        deleteAll: (state, action) => {
            state.items = []
            state.totalQuantity = 0
            state.totalMoney = 0
            localStorage.setItem('cart', JSON.stringify(state))
        }
    },

})

export const {addCart, setCart, deleteItem, deleteAll} = cartSlice.actions

export default cartSlice.reducer