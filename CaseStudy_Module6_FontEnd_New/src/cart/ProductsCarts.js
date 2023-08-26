import {useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {useDispatch, useSelector} from "react-redux";
import { deleteAll, deleteItem, setCart} from "../features/cart/cartSlice";
import  {useFormik} from "formik";
import React from 'react';

export default function ProductsCarts() {
    const [productCart, setProductCart] = useState([JSON.parse(localStorage.getItem("cart"))]);
    const carts = useSelector(state => state.cart)
    const dispatch = useDispatch();
    const idCart = JSON.parse(localStorage.getItem("idCart"));
    const user = JSON.parse(localStorage.getItem("user"))
    useEffect(() => {
        setProductCart(carts);
        dispatch(setCart())
    }, [])


    const formik = useFormik({
        initialValues: {
            id: "",
            totalMoney: ""
        },
        onSubmit: values => {
            Swal.fire({
                position: 'center',
                title: 'Bạn muốn xác nhận đơn hàng ?',
                showDenyButton: true,
                confirmButtonText: 'Xác nhận',
                denyButtonText: 'Hủy',
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    axios.post(`http://localhost:8080/api/bills/${user.id}/${idCart.id}`,
                        carts.items).then((res) => {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Đơn hàng đã được thêm vào lịch sử mua!!!!',
                            showConfirmButton: false,
                            timer: 1500
                        })

                        dispatch(deleteAll())
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

        },
    })

    const groupedItems = {};
// Nhóm các món hàng dựa trên tên cửa hàng
    carts.items.forEach(item => {
        const shopName = item.food.shops.name;
        if (!groupedItems[shopName]) {
            groupedItems[shopName] = [];
        }
        groupedItems[shopName].push(item);
    });
    return (
        <>
            <div className="grid">
                <div className="grid__row app__content">
                    <div className="grid__column-12 mgBT">
                        {carts.items != "" ? (
                            <>
                                <div className="view_category">
                                    {Object.keys(groupedItems).map(shopName => (
                                        <React.Fragment key={shopName}>
                                            <div className="view_category_container">
                                                <div className="view_category_container_header">
                                                    <i className="fa-solid fa-store "></i>
                                                    <span> {shopName} </span>
                                                </div>
                                                {groupedItems[shopName].map((item, index) => (
                                                    <div className="view_category_container_body" key={index}>
                                                        <div className="view_category_container_inner">
                                                            <div className="view_category_item-top"></div>
                                                            <div className="view_category_item">
                                                                <div className="view_category_item-1">
                                                                    {/*<i className="fa-solid fa-cookie-bite"></i>*/}
                                                                    {/*<i className="fa-solid fa-beer-mug-empty"></i>*/}
                                                                    {/*<i className="fa-solid fa-burger"></i>*/}
                                                                    <i className="fa-solid fa-circle"></i>
                                                                    <i className="fa-solid fa-circle"></i>
                                                                    <i className="fa-solid fa-circle"></i>
                                                                </div>
                                                                <div className="view_category_item-2">
                                                                    <div className="view_category_item-21">
                                                                        <div className="view_category_item-21-img">
                                                                            <img src={item.food.image}/>
                                                                        </div>
                                                                        <div className="view_category_item-21-about">
                                                    <span className="view_category_item-21-name">
                                                        {item.food.name}
                                                    </span>
                                                                            <div
                                                                                className="view_category_item-21-category">
                                                                        <span
                                                                            className="view_category_item-21-category-voucher">Voucher: </span>
                                                                                <span
                                                                                    className="view_category_item-21-category-percent">{item.food.voucher.name}</span>
                                                                            </div>
                                                                            <div className="view_category_item-21-img1">
                                                                                <img src="../static/img/category.jpg"/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="view_category_item-3"></div>
                                                                <div className="view_category_item-4">
                                                                    <span
                                                                        className="view_category_item-41">Đơn giá</span>
                                                                    <span className="view_category_item-42">
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(item.food.price)}
                                                    </span>
                                                                </div>
                                                                <div className="view_category_item-4">
                                                                    <span
                                                                        className="view_category_item-41">Số lượng </span>
                                                                    <span
                                                                        className="view_category_item-42"> {item.quantity} </span>
                                                                </div>
                                                                <div className="view_category_item-4">
                                                                    <span
                                                                        className="view_category_item-41">Số tiền </span>
                                                                    <span className="view_category_item-42">
                                                         {new Intl.NumberFormat('vi-VN', {
                                                             style: 'currency',
                                                             currency: 'VND'
                                                         }).format(item.money)}
                                                    </span>
                                                                </div>
                                                                <div className="view_category_item-4">
                                                                    <span
                                                                        className="view_category_item-41">Thao tác </span>
                                                                    <div className="view_category_item-42">
                                                                        <button className="view_category_item-43"
                                                                                title="xóa sản phẩm"
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    dispatch(deleteItem({
                                                                                        index: index,
                                                                                        food: item
                                                                                    }))
                                                                                }>
                                                                            <i className="fa-solid fa-trash"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="view_category_container_inner-btn">
                                <span className="view_category_totalMoney"> Tổng tiền : &nbsp;
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(carts.totalMoney)}
                                </span>
                                        <button className="btn-orange" type={"submit"}> Thanh toán</button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="view_category-NoItem">
                                <div className="view_category-NoItem-container">
                                    <img src="../static/img/empty-cart123.png"/>
                                    <p className="view_category-NoItem-container-p"> Giỏ hàng trống... </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )


}