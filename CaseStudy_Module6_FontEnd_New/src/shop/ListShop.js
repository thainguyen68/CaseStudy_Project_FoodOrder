import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ListShop() {
    let [shops, setShops] = useState([]);
    let [reload, setReload] = useState(false)
    const user = JSON.parse(localStorage.getItem("user"))
    const idUser = user.id;
    useEffect(() => {
        axios.get(`http://localhost:8080/api/shops/user/${idUser}`).then(res => {

            if (res.data !== "") {
                setShops(res.data);
            } else {
                setShops([])
            }

        })
    }, [reload]);

    const deleteShop = (id) => {
        Swal.fire({
            position: 'center',
            title: 'Bạn muốn khóa cửa hàng ?',
            showDenyButton: true,
            confirmButtonText: 'Khóa',
            denyButtonText: 'Hủy',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8080/api/shops/${id}`).then(() => {
                    Swal.fire({
                        width: '450px',
                        position: 'center',
                        title: 'Xóa!',
                        icon: 'success'
                    });
                    setReload(!reload)
                })
            } else if (result.isDenied) {
                Swal.fire({
                    width: '450px',
                    position: 'center',
                    title: 'Hủy!',
                    icon: 'info'
                })
            }
        })
    }

    return (
        <>
            <div>
                <div className="title-form-container">
                    <h1 className="title-form">Quản lý cửa hàng</h1>
                </div>
                <div className="shopList_table_container">
                    <div>
                        <span className={"btn-white"}>
                            <b>SHOP</b>
                        </span>
                    </div>

                    <div className="shopList_table_inner">
                        <Link to={"/create-shop"} className={"btn-successful"}>
                            <i className="fa-solid fa-plus"></i>
                            TẠO SHOP
                        </Link>
                    </div>

                </div>

                <div className="shopScroll_container_all">
                    <table className={"table table_shop_list"}>
                        <thead>
                        <tr>
                            <td className="table_shop_list-header">
                                <h5 className="table_shop_list-title">
                                    STT
                                </h5></td>
                            <td>
                                <h5 className="table_shop_list-title">
                                    TÊN
                                </h5></td>
                            <td>
                                <h5 className="table_shop_list-title">
                                    SỐ ĐIỆN THOẠI
                                </h5></td>
                            <td>
                                <h5 className="table_shop_list-title">
                                    EMAIL
                                </h5></td>
                            <td>
                                <h5 className="table_shop_list-title">
                                    GIỜ MỞ CỬA
                                </h5></td>
                            <td>
                                <h5 className="table_shop_list-title">
                                    GIỜ ĐÓNG CỬA
                                </h5></td>
                            <td>
                                <h5 className="table_shop_list-title">
                                    TRẠNG THÁI
                                </h5></td>
                            <td>
                                <h5 className="table_shop_list-title">
                                    THÀNH PHỐ
                                </h5></td>
                            <td colSpan={3}><h5 className="table_shop_list-title">
                                TUỲ CHỌN
                            </h5></td>
                        </tr>
                        </thead>
                        <tbody >
                        {
                            shops.map((item, index) =>
                                <tr key={item.id} >
                                    <td className="table_shop_list-inner">{index + 1}</td>
                                    <td className="table_shop_list-inner">{item.name}</td>
                                    <td className="table_shop_list-inner">{item.phone}</td>
                                    <td className="table_shop_list-inner">{item.email}</td>
                                    <td className="table_shop_list-inner">{item.startTime}</td>
                                    <td className="table_shop_list-inner">{item.endTime}</td>
                                    {item.statusShops === "0" && <>
                                        <td className="table_shop_list-inner">Đang hoạt động</td>
                                    </>}
                                    {item.statusShops === "1" && <>
                                        <td className="table_shop_list-inner">Tạm dừng hoạt động</td>
                                    </>}
                                    {item.statusShops === "2" && <>
                                        <td className="table_shop_list-inner">Chưa xác thực</td>
                                    </>}
                                    <td className="table_shop_list-inner">{item.city.name}</td>
                                    {item.statusShops === "0" ? (<>
                                        <td className="table_shop_list-inner iconEditShop">
                                            <Link to={`/update-shop/${item.id}`}>
                                                <i className="fa-regular fa-pen-to-square"
                                                   title="sửa thông tin cửa hàng"></i>
                                            </Link>
                                            <span className="iconEditShop-inner">Sửa</span>
                                        </td>
                                        <td className="table_shop_list-inner iconDeleteShop">
                                            <button onClick={() => deleteShop(item.id)}>
                                                <i className="fa-solid fa-lock-open" title="Khóa của hàng"></i>
                                            </button>
                                            <span className="iconDeleteShop-inner">Khóa </span>
                                        </td>
                                        <td className="table_shop_list-inner iconAddShopFood">
                                            <Link to={`/create-food/${item.id}`} className="btn-shop-2">
                                                <i className="fa-solid fa-utensils" title="Thêm món ăn mới"></i>
                                            </Link>
                                            <span className="iconAddShopFood-inner">Thêm</span>
                                        </td>
                                    </>) : (
                                        <>
                                            <td className="table_shop_list-inner">
                                                <td className="table_shop_list-inner iconEditShop">
                                                    <i className="fa-solid fa-ellipsis" style={{color: `#8080807d`}}></i>
                                                </td>
                                            </td>
                                            <td className="table_shop_list-inner">
                                                <td className="table_shop_list-inner iconDeleteShop">
                                                    <i className="fa-solid fa-lock" style={{color: `#8080807d`}}></i>
                                                </td>
                                            </td>
                                            <td className="table_shop_list-inner">
                                                <td className="table_shop_list-inner iconAddShopFood">
                                                    <i className="fa-solid fa-ellipsis" style={{color: `#8080807d`}}></i>
                                                </td>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}