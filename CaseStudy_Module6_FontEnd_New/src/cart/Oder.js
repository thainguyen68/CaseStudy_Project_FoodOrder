
import {useEffect} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {useDispatch, useSelector} from "react-redux";
import {addCartBuy, confirmOrderBuy} from "../features/cart/cartBuy";
import React from 'react';


export default function Oder() {
    const user = JSON.parse(localStorage.getItem("user"));
    const cartBuy = useSelector(state => state.cartBuy);
    const dispatch = useDispatch()
    useEffect(() => {
        axios.get(`http://localhost:8080/api/bills/bill-dto-user/${user.id}`).then((res) => {
            console.log(res.data)
            if (res.data !== null) {
                dispatch(addCartBuy(res.data))
            } else {
                dispatch(addCartBuy([]))
            }
        })
    }, [])

    const deleteCart = (id, index) => {
        Swal.fire({
            position: 'center',
            title: 'Bạn muốn huỷ đơn hàng ?',
            showDenyButton: true,
            confirmButtonText: 'Xác nhận',
            denyButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(confirmOrderBuy({
                    index: index
                }))
                axios.put(`http://localhost:8080/api/products-carts/delete-confirm/${id}`).then(() => {
                    Swal.fire({
                        width: '450px', position: 'center', title: 'Huỷ thành công!', icon: 'success'
                    });

                })
            } else if (result.isDenied) {
                Swal.fire({
                    width: '450px', position: 'center', title: 'Hủy!', icon: 'info'
                })
            }
        })
    }
    const groupedItems = {};
    const items = cartBuy.items || [];
// Nhóm các món hàng dựa trên tên cửa hàng
    items.forEach(item => {
        const shopName = item.shops.name;
        const statusBill = item.status;
        const totalMoney = item.productsCartsList;

        const combinedKey = `${shopName}-${statusBill}-${totalMoney}`;

        if (!groupedItems[combinedKey]) {
            groupedItems[combinedKey] = [];
        }
        groupedItems[combinedKey ].push(item);
    });
    const updatedItems = items.map(item => {
        const updatedProductsCartsList = item.productsCartsList.map(productCart => {
            const updatedProductCart = { ...productCart, quantity: productCart.quantity };
            return updatedProductCart;
        });

        const updatedItem = { ...item, productsCartsList: updatedProductsCartsList };
        return updatedItem;
    });

    return (
        <>
            <div className="grid">
                <div className="grid__row app__content">
                    <div className="grid__column-12 mgBT">
                        {items != "" ? (
                            <>
                                <div className="view_category">
                                    {updatedItems.map((item ,index) => {
                                        const shopName = item.shops.name;
                                        const statusBill = item.status;
                                        const totalMoney = item.total;

                                        return (
                                            <React.Fragment key={item.id}>
                                                <div className="view_category_container mrTop">
                                                    <div className="view_category_container_header">
                                                        <i className="fa-solid fa-store"></i>
                                                        <span> {shopName} </span>
                                                    </div>
                                                    {item.productsCartsList.map((productCart, index) => (
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
                                                                                <img
                                                                                    src={productCart.products.image}
                                                                                    alt="Product Image"
                                                                                />
                                                                            </div>
                                                                            <div className="view_category_item-21-about">
                                                                    <span className="view_category_item-21-name">
                                                                        {shopName}
                                                                    </span>
                                                                                <div className="view_category_item-21-category">
                                                                                    <span className="view_category_item-21-category-voucher">Voucher: </span>
                                                                                    <span className="view_category_item-21-category-percent">
                                                                            {productCart.products.voucher.name}
                                                                        </span>
                                                                                </div>
                                                                                <div className="view_category_item-21-img1">
                                                                                    <img src="../static/img/category.jpg" alt="Category Image" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="view_category_item-3"></div>
                                                                    <div className="view_category_item-4">
                                                                        <span className="view_category_item-41">Đơn giá</span>
                                                                        <span className="view_category_item-42">
                                                                {new Intl.NumberFormat('vi-VN', {
                                                                    style: 'currency',
                                                                    currency: 'VND'
                                                                }).format(productCart.products.price)}
                                                            </span>
                                                                    </div>
                                                                    <div className="view_category_item-4">
                                                                        <span className="view_category_item-41">Số lượng </span>
                                                                        <span className="view_category_item-42">{productCart.quantity}</span>
                                                                    </div>
                                                                    <div className="view_category_item-4">
                                                                        <span className="view_category_item-41">Số tiền </span>
                                                                        <span className="view_category_item-42">
                                                                {new Intl.NumberFormat('vi-VN', {
                                                                    style: 'currency',
                                                                    currency: 'VND'
                                                                }).format(productCart.totalPrice)}
                                                            </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="view_category_container_inner-btn">
                                            <span className="view_category_totalMoney">
                                                Trạng thái đơn:  &nbsp;
                                                {statusBill === "0" && <span style={{color:`green`, fontSize:`14px`}}>Đã thanh toán</span>}
                                                {statusBill === "1" && <span  style={{color:`gray`, fontSize:`14px`}}>Huỷ thanh toán</span>}
                                                {statusBill === "2" && <span  style={{color:`red`, fontSize:`14px`}}>Đang chờ xác nhận</span>}
                                            </span>
                                                        <span className="view_category_totalMoney">
                                                     Tổng tiền: &nbsp;
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND'
                                                            }).format(totalMoney)}
                                                </span>
                                                        {statusBill === "2" && <button className="btn-orange" type="submit" onClick={() => deleteCart(item.id,index)}> Hủy</button>}
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="view_category-NoItem">
                                    <div className="view_category-NoItem-container">
                                        <img src="../static/img/history-empty.png"/>
                                        <p className="view_category-NoItem-container-h"> Lịch sử trống... </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}