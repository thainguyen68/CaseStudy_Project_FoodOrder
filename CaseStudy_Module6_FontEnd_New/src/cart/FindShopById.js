import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import BillsDetail from "../features/cart/BillsDetail";

export default function FindShopById(){
    const [list,setList] = useState([]);
    const [listShop,setListShop] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const {idShop} = useParams();
    const navigate = useNavigate()
    const [showBills, setShowBills] = useState(false);
    const handleCloseBills = () => setShowBills(false);
    const handleShowBills = () => setShowBills(true);
    useEffect(() => {
        axios.get(`http://localhost:8080/api/products-carts/products-shop/${user.id}/${idShop}`).then((res) => {
            if (res.data !== null) {
                console.log(res.data)
               setList(res.data)
            } else {
                setList([])
            }
        })
        axios.get(`http://localhost:8080/api/shops/user/${user.id}`).then((res) => {
            if (res.data !== null) {
                setListShop(res.data)
            } else {
                setListShop([])
            }
        })
    }, [])
    const handleCityChange = (event) => {
        const shopI = event.target.value;
        axios.get(`http://localhost:8080/api/products-carts/products-shop/${user.id}/${shopI}`).then((res) => {
            if (res.data !== null) {
                setList(res.data)
            } else {
                setList([])
            }
        })
    };
    return(
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
                        <Link to={'/products-carts-merchant-all'}>Tổng đơn hàng</Link>
                    </span>
                    <span className={"btn-white borderBill"}>
                        <Link to={'/bill-chartjs'}>Tổng doanh thu</Link>
                    </span>

                    <div className="bill_about--shop">
                        <div className="bill_about--shop-inner">
                            <select
                                name=""
                                id=""
                                className="bill_about--shop-inner--btn"
                                onChange={handleCityChange}

                            ><option value="">---Đơn theo cửa hàng---</option>
                                {listShop.map((item, index) => (
                                    <option key={index} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>

                        </div>

                    </div>
                </div>

                <table className={"table table_shop_list"}>
                    <thead>
                    <tr>
                        <td className="table_shop_list-header">
                            <h5 className="table_shop_list-title">
                                STT
                            </h5></td>
                        <td>
                            <h5 className="table_shop_list-title">
                                TÊN KHÁCH HÀNG
                            </h5></td>
                        <td>
                            <h5 className="table_shop_list-title">
                                TÊN SẢN PHẨM
                            </h5></td>
                        <td>
                            <h5 className="table_shop_list-title">
                                TỔNG TIỀN
                            </h5></td>
                        <td>
                            <h5 className="table_shop_list-title">
                                TRANG THÁI ĐƠN
                            </h5></td>
                        <td colSpan={5}><h5 className="table_shop_list-title">
                            TUỲ CHỌN
                        </h5></td>
                    </tr>
                    </thead>
                    <tbody>
                    {(Array.isArray(list)) ? (
                        <> {list.map((item, index) =>
                            <tr key={item.id}>
                                <td className="table_shop_list-inner">{index + 1}</td>
                                <td className="table_shop_list-inner">{item.bills.user.username}</td>
                                <td className="table_shop_list-inner">{item.products.name}</td>
                                <td className="table_shop_list-inner">
                                    <span style={{marginLeft: `5px`}}>
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(item.products.price*item.quantity)}
                                </span>
                                </td>
                                {item.statusProductsCarts === "0" && <>
                                    <td className="table_shop_list-inner">Đã thanh toán</td>
                                </>}
                                {item.statusProductsCarts === "1" && <>
                                    <td className="table_shop_list-inner">Huỷ thanh toán</td>
                                </>}
                                {item.statusProductsCarts === "2" && <>
                                    <td className="table_shop_list-inner">Chờ xác nhận</td>
                                </>}
                                <td className="table_shop_list-inner">
                                    <button onClick={handleShowBills}>Chi tiết</button>
                                    <BillsDetail idDetail = {item.id} showBills={showBills} handleClose={handleCloseBills} />
                                </td>

                            </tr>
                        )
                        }
                        </>
                    ) : (<></>)}

                    </tbody>
                </table>
            </div>
        </>
    )
}