import {createSlice, current} from '@reduxjs/toolkit'
import axios from "axios";

const initialState = {
    items: [],
    totalQuantity: 0,
    totalMoney: 0
}

export const idCartSlice = createSlice({
    name: 'idCart',
    initialState,
    reducers: {
        addIdCart: (state, action) => {
            let idCart = action.payload
            axios.post('http://localhost:8080/api/carts',{
                user:{
                    id:idCart
                }
            }).then((res)=>{
                localStorage.setItem("idCart",JSON.stringify(res.data))
            })
        },
    },
})

export const {addIdCart} = idCartSlice.actions

export default idCartSlice.reducer