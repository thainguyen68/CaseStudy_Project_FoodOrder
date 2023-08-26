import {useEffect} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {useDispatch, useSelector} from "react-redux";
import {addCartMerchant, confirmOrder, deleteByMerchant, setCartMerchant} from "../features/cart/cartMC";
import {Link} from "react-router-dom";

export default function PCByMerchant() {
    const cartMerchant = useSelector(state => state.cartMerchant)
    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem("user"))
    useEffect(() => {
        axios.get(`http://localhost:8080/api/bills/bill-dto/${user.id}`).then((res) => {
            if (res.data !== null) {
                dispatch(addCartMerchant(res.data))
            } else {
                dispatch(addCartMerchant([]))
            }
        })
        dispatch(setCartMerchant())

    }, [])
    const handleSumbit = (id, index, item) => {
        Swal.fire({
            position: 'center',
            title: 'Bạn muốn nhận đơn hàng này ?',
            showDenyButton: true,
            confirmButtonText: 'Xác nhận',
            denyButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(confirmOrder({
                    index: index, item: item
                }))
                axios.put(`http://localhost:8080/api/products-carts/update-confirm/${id}`).then((res) => {
                    if (res.data.status === "0") {
                        Swal.fire({
                            width: '450px', position: 'center', title: 'Nhận đơn thành công!', icon: 'success'
                        });
                    } else {
                        Swal.fire({
                            width: '450px', position: 'center', title: 'Đơn hàng không đủ!', icon: 'info'
                        });
                    }

                })
            } else if (result.isDenied) {
                Swal.fire({
                    width: '450px', position: 'center', title: 'Hủy!', icon: 'info'
                })
            }
        })
    }

    function deleteSumbit(id, index, item) {
        Swal.fire({
            position: 'center',
            title: 'Bạn muốn huỷ đơn hàng này ?',
            showDenyButton: true,
            confirmButtonText: 'Xác nhận',
            denyButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteByMerchant({
                    index: index, item: item
                }))
                axios.put(`http://localhost:8080/api/products-carts/delete-confirm/${id}`).then((res) => {
                    if (res.data.status === "1") {
                        Swal.fire({
                            width: '450px', position: 'center', title: 'Huỷ thành công!', icon: 'success'
                        });
                    }
                })
            } else if (result.isDenied) {
                Swal.fire({
                    width: '450px', position: 'center', title: 'Hủy!', icon: 'info'
                })
            }
        })

    }

    return (
        <>
            <div className="title-form-container">
                <h1 className="title-form">Quản lý đơn hàng</h1>
            </div>
            <div className="bill_about_title">
                    <span className={"btn-white borderBill"}>
                        <b>Đơn chờ xác nhận </b>
                    </span>
                <span className={"btn-white borderBill"}>
                         <Link to={'/products-carts-merchant-all'}>Tổng đơn hàng</Link>
                     </span>

                <span className={"btn-white borderBill"}>
                        <Link to={'/bill-chartjs'}>Tổng doanh thu</Link>
                    </span>
                {/* Duyệt mảng */}
            </div>
            {cartMerchant.items.length > 0 ? (
                <> <div className="pcMerchant_container_all">
                    {cartMerchant.items.map((item, index) =>

                        <div className="pcMerchant_container">
                            <div className="pcMerchant_container-info">
                                <div className="pcMerchant_container-info-inner">
                                             <span className="pcMerchant_container-info-inner-s">
                                                <i className="fa-solid fa-user-astronaut"></i>  &nbsp;
                                                 <b>Khách hàng:</b> &nbsp;
                                                 {item.username}
                                             </span>
                                    <br/>
                                    <span className="pcMerchant_container-info-inner-s">
                                                <i className="fa-solid fa-store"></i>  &nbsp;
                                        <b>Tên cửa hàng:</b> &nbsp;
                                        {item.shops.name}
                                            </span>
                                </div>
                            </div>

                            <div>
                                <table className="table table-hover cssTablePc">
                                    <thead>
                                    <tr>
                                        <th>Ảnh</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th>Tổng tiền</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {Array.isArray(item.productsCartsList) ? (<>{item.productsCartsList.map((items, index) =>
                                        <tr key={index +1}>
                                            <td>
                                                <img src={items.products.image} style={{ width:`80px` }}/>
                                            </td>
                                            <td>
                                                {items.products.name}<br/>
                                                ( {items.products.voucher.name})
                                            </td>
                                            <td>
                                                        <span style={{marginLeft: `5px`}}>
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND'
                                                            }).format(items.products.price)}
                                                         </span>
                                            </td>
                                            <td>{items.quantity}</td>
                                            <td>
                                                        <span style={{marginLeft: `5px`}}>
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND'
                                                            }).format(items.totalPrice)}
                                                        </span>
                                            </td>
                                        </tr>
                                    )}</>) : (<></>)}
                                    </tbody>
                                </table>
                            </div>

                            <div className="pcMerchant_container_end">
                                        <span className="pcMerchant_container_end-stt">
                                            Trạng Thái : &nbsp;
                                            <p style={{color:`green`, fontWeight:`400`}}>Chờ Xác Nhận</p>
                                        </span>
                                <span className="pcMerchant_container_end-ttl">
                                            Tổng tiền : &nbsp;
                                    <p style={{color:`red`, fontWeight:`400`}}>
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(item.total)}
                                            </p>
                                        </span>
                                <div className="pcMerchant_container_end-cfm">
                                    <button className="btn-history"
                                            type={"submit"} onClick={() => handleSumbit(item.id, index, item)}>
                                        Xác nhận
                                    </button>
                                    <button className="btn-history"
                                            type={"submit"} onClick={() => deleteSumbit(item.id, index, item)}>
                                        Huỷ
                                    </button>
                                </div>
                            </div>
                        </div>

                    )}
                </div>
                </> ) : (<>
                <>
                    <div className="view_history-NoItem">
                        <div className="view_history-NoItem-container">
                            <img src="../static/img/history-empty.png"/>
                            <p className="view_history-NoItem-container-h"> Không có đơn hàng nào ! </p>
                        </div>
                    </div>
                </>
            </>)}
        </>)

}