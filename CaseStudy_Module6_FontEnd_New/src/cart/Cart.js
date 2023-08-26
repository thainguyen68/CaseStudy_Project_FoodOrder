import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {deleteItem} from "../features/cart/cartSlice";

export default function Cart() {
    const [productCart, setProductCart] = useState([]);
    const cart = useSelector(state => state.cart)
    const dispatch = useDispatch()
    const checkUserID = (value) => {
        let id;
        if (value) {
            id = value.id;
        } else {
            id = 1000;
        }
        return id;
    }
    const user = JSON.parse(localStorage.getItem("user"))
    const idUser = checkUserID(user);
    useEffect(() => {
        axios.get(`http://localhost:8080/api/products-carts/user/${idUser}`).then((res) => {
            if (res.data !== null) {
                setProductCart(res.data)

            } else {
                setProductCart([])
            }

        })
    }, [])
    return (
        <>
            <div className="header__cart-wrap">
                <i className="fas fa-shopping-cart header__cart-icon"></i>
                <span className="header__cart-notice">{cart.totalQuantity}</span>
                <div className="header__Cart-list ">
                    {cart.totalQuantity === 0 ? (
                        <div className="header__Cart-list-inner">
                            <img src="../static/img/footer/no-cart.png" alt=""
                                 className="header__Cart-no-cart-img"/>
                            <span className="header__Cart-no-cart-msg">Chưa có sản phẩm</span>
                        </div>
                    ) : (
                        <div className="header__Cart-list-content">
                            <h4 className="header__Cart-heading">Sản phẩm đã thêm</h4>
                            <ul className="header__Cart-list-item">
                                {cart.items.map((item, index) =>
                                    <li className="header__Cart-item" key={index}>
                                        <img src={item.food.image} alt=""
                                             className="header__Cart-img"/>
                                        <div className="header__Cart-item-info">
                                            <div className="header__Cart-item-head">
                                                <h5 className="header__Cart-item-name">{item.food.name}</h5>
                                                <div className="header__Cart-item-price">
                                                     <span style={{marginLeft: `5px`}}>
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(item.food.price)}
                                                    </span>

                                                    <span className="header__Cart-item-muntifly">x</span>
                                                    <span
                                                        className="header__Cart-item-quantity">{item.quantity}   </span>
                                                </div>
                                            </div>
                                            <div className="header__Cart-item-body">
                                                <span className="header__Cart-item-description"> </span>
                                                <span onClick={() => dispatch(deleteItem({
                                                    index: index,
                                                    food: item
                                                })) }
                                                      className="header__Cart-item-remove">xóa</span>
                                            </div>
                                        </div>
                                    </li>
                                )}
                            </ul>

                        </div>
                    )}
                    {user ? (<>
                        <span className="header__Cart-item-totalMoney">Tổng tiền : &nbsp;
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(cart.totalMoney)}
                                                    </span>
                        <Link to={'/products-carts'} className="header__cart-view btn btn--primary">Xem giỏ
                            hàng</Link></>) : (<></>)}
                </div>
            </div>

        </>
    )
}