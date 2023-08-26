import {Link, useNavigate} from "react-router-dom";
import Login from "../user/formlogin/Login";
import {useEffect, useState} from "react";
import axios from "axios";
import Cart from "../cart/Cart";
import {setCart} from "../features/cart/cartSlice";
import {useDispatch, useSelector} from "react-redux";


export default function Header({search}) {
    const cart = useSelector(state => state.cart);
    const dispatch = useDispatch()

    const [showLogin, setShowLogin] = useState(false)
    const user = JSON.parse(localStorage.getItem("user"))
    const [city,setCity] = useState([])

    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        navigate(`/?search=${searchQuery}`)
    };

    const handleClose = () => setShowLogin(false);
    const handleShow = () => setShowLogin(true);


    // logout
    const removeDataFromLocalStorage = () => {
        localStorage.clear();
        dispatch(setCart());
        navigate('/')
    };

    const handleCityChange = (event) => {
        const cityId = event.target.value;
        navigate(`/?city=${cityId}`);
    };

    //Get city
    useEffect(() => {
        axios.get("http://localhost:8080/api/city").then(res => {
            setCity(res.data)
        },)
    },[])

    return (<>
        <header id="header">
            <div className="grid">
                <div className="header-with-search">
                    <div className="header__logo">
                        <Link to={"/"} className="header__logo-link">
                            <div className="header__logo-img">
                                <img src="../static/img/shopeefoodvn.jpg" style={{maxWidth: `100%`}} alt={""}/>
                            </div>
                        </Link>
                    </div>



                    {/*đoạn này để fill-search trường dữ liệu của thành phố */}
                    <div className="header__select">

                        <div className="header__select--address">

                            <div className="header__select--address-inner">
                                <select
                                    name=""
                                    id=""
                                    className="header__select--address--btn"
                                    onChange={handleCityChange}
                                >
                                    {city.map((item, index) => (
                                        <option key={index} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>

                        <div className="header__select--category">
                            <button className="header__select--category--btn">
                                <Link to={`/${1}`} className="header__select--category--btn-link">
                                    Đồ ăn
                                </Link>
                            </button>
                            <button className="header__select--category--btn">
                                <Link to={`/${2}`} className="header__select--category--btn-link">
                                    Thực phẩm
                                </Link>
                            </button>
                            <button className="header__select--category--btn">
                                <Link to={`/${3}`} className="header__select--category--btn-link">
                                    Bia
                                </Link>
                            </button>
                            <button className="header__select--category--btn">
                                <Link to={`/${4}`} className="header__select--category--btn-link">
                                    Hoa
                                </Link>
                            </button>
                            <button className="header__select--category--btn">
                                <Link to={`/${5}`} className="header__select--category--btn-link">
                                    Siêu thị
                                </Link>
                            </button>
                            <button className="header__select--category--btn">
                                <Link to={`/${6}`} className="header__select--category--btn-link">
                                    Thú cưng
                                </Link>
                            </button>
                        </div>
                    </div>

                    {/*search here! */}
                    <div className="header__search">
                        <div className="header__search-input-wrap">
                            <input type="text" id="name-search" className="header__search-input"
                                   placeholder="Nhập để tìm kiếm"
                                   onChange={(e) => setSearchQuery(e.target.value)}/>
                        </div>
                        <button className="header__search-btn" onClick={handleSearch}>
                            <i className="fas fa-search header__search-btn-icon"></i>
                        </button>
                    </div>

                    {/*header__Cart*/}
                    <div className="header__cart">
                        <Cart/>
                    </div>


                    {/*Login here*/}
                    {user == undefined && <>
                        <div className="header__login">
                            <div className="header__login--btn"  onClick={handleShow}>
                                Đăng nhập
                            </div>
                            <Login showLogin={showLogin} handleClose={handleClose}/>
                        </div>
                    </>}



                    {/*Account*/}
                    {user != undefined && <>
                        <div className="header__login--user" >
                            <div className="header__navbar-item header__navbar-user">
                                <img className="header__navbar-user-img" src={user.image} alt=""/>
                                <span className="header__navbar-user-name">{user.name}</span>
                                <i className="header__navbar-user-icon fas fa-caret-down"></i>

                                <ul className="header__navbar-user-menu">
                                    {user.authorities[0].authority !== "ROLE_ADMIN" && <>
                                        <li className="header__navbar-user-item">
                                            <Link  to={'/userProfile'} className="header__navbar-user-manager">
                                                <i className="fa-solid fa-user iconManager"></i>
                                                Tài khoản của tôi
                                            </Link>
                                        </li>
                                    </>}

                                    {user.authorities[0].authority === "ROLE_USER" && <>
                                        <li className="header__navbar-user-item">
                                            <Link  to={'/products-carts-oder'} className="header__navbar-user-manager">
                                                <i className="fa-solid fa-list-ul iconManager"></i>
                                                Quản lí đơn
                                            </Link>
                                        </li>
                                    </>}
                                    {user.authorities[0].authority === "ROLE_MERCHANT" && <>
                                        <li className="header__navbar-user-item">
                                            <Link  to={'/products-carts-merchant'} className="header__navbar-user-manager">
                                                <i className="fa-solid fa-bag-shopping iconManager"></i>
                                                Quản lí đơn
                                            </Link>
                                        </li>
                                        <li className="header__navbar-user-item">
                                            <Link  to={'/products-carts-oder'} className="header__navbar-user-manager">
                                                <i className="fa-solid fa-clock-rotate-left iconManager"></i>
                                                Lịch sử mua
                                            </Link>
                                        </li>
                                        <li className="header__navbar-user-item">
                                            <Link to={"/shop"} className="header__navbar-user-manager">
                                                <i className="fa-solid fa-store iconManager"></i>
                                                Quản lý cửa hàng
                                            </Link>
                                        </li>
                                    </>}

                                    {user.authorities[0].authority === "ROLE_ADMIN" && <>
                                        <li className="header__navbar-user-item">
                                            <Link  to={'/user-manager'} className="header__navbar-user-manager">
                                                <i className="fa-solid fa-users-gear iconManager"></i>
                                                Quản tài khoản
                                            </Link>
                                        </li>
                                        <li className="header__navbar-user-item">
                                            <Link  to={'/shop-manager'} className="header__navbar-user-manager">
                                                <i className="fa-solid fa-shop-lock iconManager"></i>
                                                Quản lý cửa hàng
                                            </Link>
                                        </li>
                                    </>}
                                    <li className="header__navbar-user-item header__navbar-user-item--sparate">
                                        <a className="header__navbar-user-manager"
                                           onClick={() => removeDataFromLocalStorage()}>
                                            <i className="fa-solid fa-right-from-bracket iconManager"></i>
                                            Đăng xuất
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </>}


                </div>
            </div>
        </header>

    </>)

}
