import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function UserManager() {
    const [user, setUser] = useState([]);
    let [reload, setReload] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/users`).then((res) => {
            console.log(res.data);
            setUser(res.data);
        });
    }, [reload]);

    const toggleShop = (id, statusUser) => {
        Swal.fire({
            position: 'center',
            title: `Bạn muốn ${statusUser === "1" ? 'Khóa' : 'Mở'} tài khoản này ?`,
            showDenyButton: true,
            confirmButtonText: statusUser === "1" ? 'Khóa' : 'Mở',
            denyButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                const newStatus = statusUser === "1" ? "0" : "1";
                axios.delete(`http://localhost:8080/api/users/delete/${id}`, { statusUser: newStatus })
                    .then(() => {
                        Swal.fire({
                            width: '450px',
                            position: 'center',
                            title: `${newStatus === "0" ? 'Khóa' : 'Mở'} hoạt động thành công!`,
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
                    <h1 className="title-form">Quản lý hoạt động của các tài khoản</h1>
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
                                    EMAIL
                                </h5></td>
                            <td>
                                <h5 className="table_shop_list-title">
                                    THÀNH PHỐ
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
                        {
                            user.map((item, index) =>
                                {
                                    if (item.roles[0].name !== 'ROLE_ADMIN') {
                                        return (
                                            <tr key={item.id}>
                                                <td className="table_shop_list-inner">{index + 1}</td>
                                                <td className="table_shop_list-inner">{item.username}</td>
                                                <td className="table_shop_list-inner">{item.phone}</td>
                                                <td className="table_shop_list-inner">{item.email}</td>
                                                <td className="table_shop_list-inner">{item.city?.name}</td>
                                                {item.statusUser === "1" && (
                                                    <td className="text-success">Đang hoạt động</td>
                                                )}
                                                {item.statusUser === "0" && (
                                                    <td className="text-warning">Tạm dừng hoạt động</td>
                                                )}
                                                <td colSpan={2} className="table_shop_list-inner iconDeleteShop">
                                                    <button onClick={() => toggleShop(item.id, item.statusUser)}>
                                                        {item.statusUser === "1" ? (
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
                                        );
                                    } else {
                                        return null; // Skip rendering the row if item.roles.id is "1"
                                    }
                                }
                            )
                        }
                        </tbody>
                    </table>
                </div>


            </div>
        </>
    )
}
