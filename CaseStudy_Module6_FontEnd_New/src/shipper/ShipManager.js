import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function ShipperManager() {
    const [shipper, setShipper] = useState([]);
    let [reload, setReload] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/shipper`).then((res) => {
            console.log(res.data);
            setShipper(res.data);
        });
    }, [reload]); // Thêm reload vào dependency array

    const toggleShop = (id, statusShippers) => {
        Swal.fire({
            position: 'center',
            title: `Bạn muốn ${statusShippers === "0" ? 'tắt' : 'bật'} hoạt động với bên giao hàng này ?`,
            showDenyButton: true,
            confirmButtonText: statusShippers === "0" ? 'Tắt' : 'Bật',
            denyButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                const newStatus = statusShippers === "0" ? "1" : "0";
                axios.delete(`http://localhost:8080/api/shipper/${id}`, { statusShippers: newStatus }).then(() => {
                    const icon = statusShippers === "0" ? "😢" : "😊";
                    Swal.fire({
                        width: '450px',
                        position: 'center',
                        title: `${statusShippers === "0" ? 'Tắt' : 'Bật'} hoạt động thành công! ${icon}`,
                        icon: 'success'
                    });
                    setReload(!reload);
                });
            } else if (result.isDenied) {
                Swal.fire({
                    width: '450px',
                    position: 'center',
                    title: 'Hủy!',
                    icon: 'info'
                });
            }
        });
    };


    return (
        <>
            <div>
                <div className="title-form-container">
                    <h1 className="title-form">Quản lý dịch vụ giao hàng</h1>
                </div>
                <div className="shopList_table_container">

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
                                TÊN
                            </h5></td>
                        <td>
                            <h5 className="table_shop_list-title">
                                SỐ ĐIỆN THOẠI
                            </h5></td>
                        <td>
                            <h5 className="table_shop_list-title">
                                PHÍ GIAO HÀNG
                            </h5></td>
                        <td>
                            <h5 className="table_shop_list-title">
                                TRẠNG THÁI
                            </h5></td>
                        <td colSpan={3}><h5 className="table_shop_list-title">
                            TUỲ CHỌN
                        </h5></td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        shipper.map((item, index) =>
                            <tr key={item.id}>
                                <td className="table_shop_list-inner">{index + 1}</td>
                                <td className="table_shop_list-inner">{item.name}</td>
                                <td className="table_shop_list-inner">{item.phone}</td>
                                <td className="table_shop_list-inner">{item.percent}</td>
                                {item.statusShippers === "0" && <>
                                    <td class="text-success">Đang hoạt động</td>
                                </>}
                                {item.statusShippers === "1" && <>
                                    <td class="text-warning">Tạm dừng hoạt động</td>
                                </>}
                                <td className="table_shop_list-inner"></td>
                                <td className="table_shop_list-inner iconEditShop">
                                    <Link to={`/shipper-update/${item.id}`}>
                                        <i className="fa-regular fa-pen-to-square"></i>
                                    </Link>
                                    <span className="iconEditShop-inner">Sửa</span>
                                </td>
                                <td className="table_shop_list-inner iconDeleteShop">
                                    <button onClick={() => toggleShop(item.id, item.statusShippers)}>
                                        {item.statusShippers === "0" ? (
                                            <>
                                                <i className="fa-solid fa-toggle-on"></i>
                                                <span className="iconDeleteShop-inner"></span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-toggle-off"></i>
                                                <span className="iconDeleteShop-inner"></span>
                                            </>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
        </>
    )
}
