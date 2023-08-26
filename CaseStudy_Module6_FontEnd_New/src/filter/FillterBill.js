import {useEffect, useState} from "react";
import axios from "axios";

export default function FilterBill({filter}){
    const user = JSON.parse(localStorage.getItem("user"))
    const [listShop,setListShop] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:8080/api/shops/user-bill/${user.id}`).then((res) => {
            if (res.data !== null) {
                setListShop(res.data)
            } else {
                setListShop([])
            }
        })
    }, [])
    const handleShopChange = (event) => {
        const id = event.target.value;
        console.log(id)
        if(id !== "0"){
            axios.get(`http://localhost:8080/api/bills/filter/user/${user.id}/shops/${id}`).then((res) => {
                if (res.data !== null) {
                    console.log(res.data)
                    filter(res.data)
                } else {
                    filter([])
                }
            })
        }
        else {
            axios.get(`http://localhost:8080/api/bills/bill-dto-merchant/${user.id}`).then((res) => {
                if (res.data !== null) {
                    filter(res.data)
                } else {
                    filter([])
                }
            })
        }

    };
    return(
        <>
            <div className="bill_about--shop-inner">
                <select
                    name=""
                    id=""
                    className="bill_about--shop-inner--btn"
                    onChange={handleShopChange}
                >
                    <option value="0">---Tất cả---</option>
                    {listShop.length > 0 && listShop.map((item, index) => (<option key={index} value={item.id}>
                        {item.name}
                    </option>))}
                </select>

            </div>
        </>
    )
}