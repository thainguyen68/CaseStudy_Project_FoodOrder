import {useEffect, useState} from "react";
import axios from "axios";

import {Link} from "react-router-dom";
import BillsDetail from "../features/cart/BillsDetail";
import FilterBill from "../filter/FillterBill";

async function getOderByUserId(id) {
    return await axios.get(`http://localhost:8080/api/products-carts/merchant-service-all/${id}`)
}

async function getBillsByUserId(id) {
    return await axios.get(`http://localhost:8080/api/bills/bill-dto-merchant/${id}`) //api/users/1/bills
}

async function getShopByUserId(id) {
    return await axios.get(`http://localhost:8080/api/shops/user-bill/${id}`) //api/users/1/shops
}

export default function MerchantBillService() {
    const [listBill, setListBill] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"))
    const [showBillDetail, setShowBillDetail] = useState(false)
    const [billDetail, setBillDetail] = useState({})
    const handleClose = () => setShowBillDetail(false);
    const handleShow = (data) => {
        setShowBillDetail(true)
        setBillDetail(data)
    };

    useEffect(() => {
        Promise.all([getOderByUserId(user.id), getBillsByUserId(user.id), getShopByUserId(user.id)]).then(res => {
            if (res[1].data != null) {
                setListBill(res[1].data)
                setBillDetail(res[1].data[0])
            } else {
                setListBill([])
            }

        })
    }, [])

    const sortByShop = (data) => {
        setListBill(data)
    }

    return (
        <>
            <div>
                <div className="title-form-container">
                    <h1 className="title-form">Quản lý đơn hàng</h1>
                </div>

                <div className="bill_about_title">
                    <span className={"btn-white borderBill"}>
                        <Link to={'/products-carts-merchant'}>Đơn chờ xác nhận</Link>
                    </span>
                    <span className={"btn-white borderBill"}>
                       <b>Tổng đơn hàng</b>
                    </span>
                    <span className={"btn-white borderBill"}>
                        <Link to={'/bill-chartjs'}>Tổng doanh thu</Link>
                    </span>

                    <div className="bill_about--shop">
                        {/*Filter theo shop */}
                        <FilterBill filter={sortByShop}/>

                    </div>

                </div>

                {listBill.length > 0 ? (
                    <>
                        <div className="pcMerchant_container_all">
                            <table className={"table table_shop_list"}>
                                <thead>
                                <tr>
                                    <td className="table_shop_list-header">
                                        <h5 className="table_shop_list-title">
                                            STT
                                        </h5></td>
                                    <td className="table_shop_list-header">
                                        <h5 className="table_shop_list-title">
                                            NGƯỜI MUA
                                        </h5></td>
                                    <td className="table_shop_list-header">
                                        <h5 className="table_shop_list-title">
                                            TÊN CỬA HÀNG
                                        </h5></td>
                                    <td>
                                        <h5 className="table_shop_list-title">
                                            TỔNG TIỀN
                                        </h5></td>
                                    <td>
                                        <h5 className="table_shop_list-title">
                                            TRANG THÁI ĐƠN
                                        </h5></td>
                                    <td colSpan={3}><h5 className="table_shop_list-title">
                                        TUỲ CHỌN
                                    </h5></td>
                                </tr>
                                </thead>
                                <tbody>
                                {listBill.length > 0 && listBill.map((item, index) =>
                                    (
                                        <tr key={item.id}>
                                            <td className="table_shop_list-inner">{index + 1}</td>
                                            <td className="table_shop_list-inner">{item.username}</td>
                                            <td className="table_shop_list-inner">{item.shops.name}</td>
                                            <td className="table_shop_list-inner">
                                    <span style={{marginLeft: `5px`}}>
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(item.total)}
                                    </span>
                                            </td>

                                            {item.status === "0" && <>
                                                <td className="table_shop_list-inner" style={{color:`#14c014`}}>Đã thanh
                                                    toán
                                                </td>
                                            </>}
                                            {item.status === "1" && <>
                                                <td  className="table_shop_list-inner" style={{color:`red`}}>Huỷ thanh
                                                    toán
                                                </td>
                                            </>}
                                            <td className="table_shop_list-inner">
                                                <button onClick={()=>handleShow(item)}>Chi tiết</button>
                                                <BillsDetail bill={billDetail} showBills={showBillDetail} handleClose={handleClose}/>
                                            </td>
                                        </tr>
                                    )
                                )
                                }
                                </tbody>
                            </table>
                        </div>
                    </>


                ) : (
                    <>
                        <div className="view_history-NoItem">
                            <div className="view_history-NoItem-container">
                                <img src="../static/img/history-empty.png"/>
                                <p className="view_history-NoItem-container-h"> Không có đơn hàng nào ! </p>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </>
    )

}