import {useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {Link} from "react-router-dom";

export default function ListVoucher() {
    let [vouchers, setVoucher] = useState([]);
    let [reload, setReload] = useState(false);
    const shop = JSON.parse(localStorage.getItem("shop"));


    //  đoạn này fix cứng chú  ý lấy lại id
    const idShop = 1;

    useEffect(() => {
        axios.get(`http://localhost:8080/api/vouchers`).then(res => {
            if (res.data !== "") {
                setVoucher(res.data);
            } else {
                setVoucher([])
            }

        })
    }, [reload]);

    const deleteVoucher = (id) => {
        Swal.fire({
            position: 'center',
            title: 'Bạn muốn xóa voucher ?',
            showDenyButton: true,
            confirmButtonText: 'Xóa',
            denyButtonText: 'Hủy',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8080/api/vouchers/${id}`).then(() => {
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
                <div>
                    <div><Link to={"/create-voucher"} className={"btn btn-success"}>
                        <b>TẠO VOUCHER</b>
                    </Link></div>
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
                                PERCENT
                            </h5></td>
                        <td colSpan={2}>
                            <h5 className="table_shop_list-title">
                                ACTION
                            </h5></td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        vouchers.map((item, index) =>
                            <tr key={item.id}>
                                <td className="table_shop_list-inner">{index + 1}</td>
                                <td className="table_shop_list-inner">{item.name}</td>
                                <td className="table_shop_list-inner">{item.percent}</td>

                                <td  className="table_shop_list-inner iconEditShop">
                                    <Link to={`/update-voucher/${item.id}`} >
                                        <i className="fa-regular fa-pen-to-square"></i>
                                    </Link>
                                    <span className="iconEditShop-inner">Sửa</span>
                                </td>
                                <td className="table_shop_list-inner iconDeleteShop">
                                    <button onClick={() => deleteVoucher(item.id)}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                    <span className="iconDeleteShop-inner">Xóa</span>
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