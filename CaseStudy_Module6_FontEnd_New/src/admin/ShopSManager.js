import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ShopSManager() {
    const [shop, setShop] = useState([]);
    let [reload, setReload] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/shops`).then((res) => {
            console.log(res.data);
            setShop(res.data);
        });
    }, [reload]);

    const toggleShop = (id, statusShops) => {
        Swal.fire({
            position: 'center',
            title: `Bạn muốn ${statusShops === "0" ? 'Khóa' : 'Mở'} hoạt động với bên cửa hàng này ?`,
            showDenyButton: true,
            confirmButtonText: statusShops === "0" ? 'Khóa' : 'Mở',
            denyButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                const newStatus = statusShops === "0" ? "1" : "0";
                axios.delete(`http://localhost:8080/api/shops/${id}`, { statusShops: newStatus })
                    .then(() => {
                        Swal.fire({
                            width: '450px',
                            position: 'center',
                            title: `${newStatus === "0" ? 'Mở' : 'Khóa' } hoạt động thành công!`,
                            icon: 'success'
                        });
                        setReload(!reload);
                    })
                    .catch(() => {
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
                    <h1 className="title-form">Quản lý hoạt động của các cửa hàng</h1>
                </div>
                <div className="admin_shopList_table_container">
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
                                    TRẠNG THÁI
                                </h5></td>
                            <td colSpan={2}><h5 className="table_shop_list-title">
                                TUỲ CHỌN
                            </h5></td>
                        </tr>
                        </thead>
                        <tbody>
                        {shop.length>0 &&
                            shop.map((item, index) =>
                                <tr key={item.id}>
                                    <td className="table_shop_list-inner">{index + 1}</td>
                                    <td className="table_shop_list-inner">{item.name}</td>
                                    <td className="table_shop_list-inner">{item.phone}</td>
                                    {item.statusShops === "0" && <>
                                        <td className="text-success">Đang hoạt động</td>
                                    </>}
                                    {item.statusShops === "1" && <>
                                        <td className="text-warning">Tạm dừng hoạt động</td>
                                    </>}
                                    {item.statusShops === "2" && <>
                                        <td className="text-warning">Chờ xác thực</td>
                                    </>}
                                    {item.statusShops !== "2" ?( <td colSpan={2} className="table_shop_list-inner iconDeleteShop">
                                        <button onClick={() => toggleShop(item.id, item.statusShops)}>
                                            {item.statusShops === "0" ? (
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
                                    </td>):(<><td></td></>)

                                  }

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
