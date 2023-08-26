import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import Swal from "sweetalert2";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {addCart} from "../../features/cart/cartSlice";


export default function View() {
    const [food, setFood] = useState({});
    const [foodVoucher, setFoodVoucher] = useState({});
    const {id} = useParams();
    const [shopsUserId, setShopUserId] = useState("");
    const [shops, setShop] = useState("");
    const [shopsDescription, setShopsDescription] = useState("");
    const [shopsTimeStart, setShopsTimeStart] = useState("");
    const [shopsTimeEnd, setShopsTimeEnd] = useState("");
    const user = JSON.parse(localStorage.getItem("user"))
    const [listImg, setListImg] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch()


    useEffect(() => {
        axios.get(`http://localhost:8080/api/products/${id}`).then((res) => {
            setListImg(res.data.image)
            setFood(res.data)
            setShopUserId(res.data.shops.user.id)
            setShop(res.data.shops.name)
            setShopsDescription(res.data.shops.description)
            setShopsTimeStart(res.data.shops.startTime)
            setShopsTimeEnd(res.data.shops.endTime)
            setFoodVoucher(res.data.voucher)
        })
    }, [])

    const deleteFood = (id) => {
        Swal.fire({
            position: 'center',
            title: 'Bạn có muốn xóa sản phẩm ?',
            showDenyButton: true,
            confirmButtonText: 'Xóa',
            denyButtonText: 'Trở lại',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8080/api/products/${id}`).then(() => {
                    Swal.fire({
                        width: '450px',
                        position: 'center',
                        title: 'Xóa!',
                        icon: 'success'
                    });
                    navigate('/')
                })
            } else if (result.isDenied) {
                Swal.fire({
                    width: '450px',
                    position: 'center',
                    title: 'Hủy',
                    icon: 'info'
                })
            }
        })
    }

    const formik = useFormik({
        initialValues: {
            quantity: 1,

        },
        onSubmit: values => {
            if (user) {
                let data = {
                    food: food,
                    quantity: values.quantity
                }
                dispatch(addCart(data))
            } else {
                Swal.fire({
                    width: '450px',
                    position: 'center',
                    title: 'Bạn chưa đăng nhập',
                    icon: 'info'
                })
            }

        },

    })


    const decreaseQuantity = () => {
        formik.setFieldValue('quantity', Math.max(formik.values.quantity - 1, 1));
    };

    const increaseQuantity = () => {
        formik.setFieldValue('quantity', Math.min(formik.values.quantity + 1, food.quantity));
    };


    const check = (startTime, endTime) => {
        const currentTime = new Date();
        const startTimeObj = new Date(currentTime.toDateString() + " " + startTime);
        const endTimeObj = new Date(currentTime.toDateString() + " " + endTime);
        return currentTime >= startTimeObj && currentTime <= endTimeObj;
    };


    // phần này sẽ giới hạn phần hiện ảnh sử dụng lớp after trong css
    const MAX_DISPLAY_IMAGES = 4; // Số lượng ảnh tối đa hiển thị

    // Thay đoạn render ảnh trong useEffect bằng đoạn sau
    const imagesToDisplay = listImg.slice(0, MAX_DISPLAY_IMAGES);
    const shouldDisplayEllipsis = listImg.length > MAX_DISPLAY_IMAGES;


    const [selectedImage, setSelectedImage] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (food && food.image) {
            setSelectedImage(food.image);
        }
    }, [food]);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleArrowClick = (direction) => {
        if (direction === 'prev') {
            const prevIndex = (currentIndex - 1 + imagesToDisplay.length) % imagesToDisplay.length;
            setCurrentIndex(prevIndex);
            setSelectedImage(imagesToDisplay[prevIndex]);
        } else if (direction === 'next') {
            setCurrentIndex((currentIndex + 1) % imagesToDisplay.length);
            setSelectedImage(imagesToDisplay[(currentIndex + 1) % imagesToDisplay.length]);
        }
    };


    return (
        <>
            <div className="grid">
                <div className="grid__row app__content">
                    <div className="grid__column-12">
                        <div className="title-view-container">
                            <h1 className="title_view-food">Chi tiết món ăn</h1>
                        </div>

                        <div className="view_food-container">
                            <div className="grid__column-5">
                                <div className="view_food-left">
                                    <div className="view_food-left-img">
                                        <img src={selectedImage} alt="Main Food Image"/>
                                        <div className="arrow-left" onClick={() => handleArrowClick('prev')}>
                                            <i className="fa-solid fa-angle-left"></i>
                                        </div>
                                        <div className="arrow-right" onClick={() => handleArrowClick('next')}>
                                            <i className="fa-solid fa-angle-right"></i>
                                        </div>
                                    </div>

                                </div>


                                {/*---------------------------------*/}
                                <div className="view_food-left">
                                    <div className={`view_food-left-img-container 
                                        ${shouldDisplayEllipsis ? 'more-images' : ''}`}>
                                        {imagesToDisplay.map((item, index) => (
                                            <img
                                                key={index}
                                                className="view_food-left-img-container-item"
                                                src={item}
                                                alt={`Image ${index + 1}`}
                                                onClick={() => handleImageClick(item)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="grid__column-6">
                                <div className="view_food-right">
                                    <div className="view_food-right-container">
                                        <div className="view_food-right-item-link">
                                            ShopeeFood
                                        </div>
                                        <div className="view_food-right-item-link">
                                            {shops}
                                        </div>
                                    </div>
                                    <div className="view_food-right-container">
                                        <div className="view_food-right-item-like">
                                            <i className="fa fa-thumbs-up"></i>
                                            Yêu thích
                                        </div>
                                        <span>
                                                Món gì cũng có tại
                                        <a style={{textDecoration: `none`, color: `blue`}}> {shops}</a>
                                    </span>
                                    </div>
                                    <div className="view_food-right-container">
                                        <h1 className="view_food-right-item-name">{shops}</h1>
                                    </div>
                                    <div className="view_food-right-container">
                                        <div className="view_food-right-item-address">
                                            <i className="fa-solid fa-location-dot" style={{color: `#3663b0`}}></i>
                                            &nbsp;
                                            {shopsDescription}
                                        </div>
                                    </div>
                                    <div className="view_food-right-container">
                                        <div className="view_food-right-item-rate">
                                            <i className="view_food-right-item-star fa-solid fa-star"
                                               style={{color: `#ffc107`}}></i>
                                            <i className="view_food-right-item-star fa-solid fa-star"
                                               style={{color: `#ffc107`}}></i>
                                            <i className="view_food-right-item-star fa-solid fa-star"
                                               style={{color: `#ffc107`}}></i>
                                            <i className="view_food-right-item-star fa-solid fa-star"
                                               style={{color: `#ffc107`}}></i>
                                            <i className="view_food-right-item-star fa-solid fa-star"
                                               style={{color: `#ffc107`}}></i>
                                        </div>
                                        <span className="view_food-right-item-views">999+</span>
                                        đánh giá trên ShopeeFood
                                    </div>
                                    <div className="view_food-right-container">
                                        <div className="view_food-right-more">
                                            <a>Xem thêm lượt đánh giá từ Foody</a>
                                        </div>
                                    </div>
                                    <div className="view_food-right-container">
                                        <div className="view_food-right-status">
                                            <div className="view_food-status-time">
                                                {check(shopsTimeStart, shopsTimeEnd) ? (
                                                    <span className="view_food-right-status-on">Mở cửa</span>
                                                ) : (
                                                    <span className="view_food-right-status-off">Đóng cửa</span>
                                                )}
                                            </div>
                                            <div className="view_food-status-time-now">
                                                <i className="far fa-clock"></i>
                                                <span> {shopsTimeStart} - {shopsTimeEnd}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="view_food-right-container">
                                        <div className="view_food-right-item-price">
                                            <i className="fas fa-dollar-sign"></i>
                                            <span style={{marginLeft: `5px`}}>
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(food.price)}
                                                    </span>
                                        </div>
                                    </div>
                                    <div className="view_food-right-container">
                                        <div className="view_food-right-item-name-story">
                                            Tên món: <b>{food.name}</b>
                                        </div>
                                        <div className="view_food-right-item-quantity">
                                            Số lượng: {food.quantity}
                                        </div>
                                    </div>
                                    <div className="view_food-right-container">
                                        <div className="view_food-right-line"></div>
                                    </div>
                                    <div className="view_food-right-container">
                                        <div className="view_food-right-add">
                                            <div className="utility-item">
                                                <div className="utility-title">
                                                    Phí dịch vụ
                                                </div>
                                                <div className="utility-content">
                                                <span className="txt-bold-txt-red">
                                                    0.0% Phí phục vụ
                                                </span>
                                                </div>
                                                <span className="icon icon-partner-vi">
                                                            <img src="../static/img/partner-vi-removebg-preview.png"
                                                                 className="icon-partner-vi-img"/>
                                                    </span>
                                            </div>

                                            <div className="utility-item">
                                                <div className="utility-title">
                                                    Dịch vụ bơi
                                                </div>
                                                <div className="utility-content">
                                                <span className="txt-bold-txt-red">
                                                    ShoopeeFood
                                                </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="view_food-right-container">
                                        {foodVoucher.percent !== 0 && <>
                                            <div className="view_food-right-voucher-container">
                                                <div className="view_food-item__sale-off">
                                                    <span className="view_food-item__sale-off-label">Giảm</span>
                                                    <span className="view_food-item__sale-off-percent">
                                                        {foodVoucher.percent}%
                                                    </span>
                                                </div>
                                            </div>
                                        </>}
                                    </div>
                                    <div className="view_food-right-container">
                                        {user?.id !== shopsUserId ? (
                                            check(shopsTimeStart, shopsTimeEnd) &&
                                            <>
                                                <form onSubmit={formik.handleSubmit}>
                                                    <div className="view_food-right-item-container-btn">
                                                        <div className="view_food-right-select-number">
                                                            <div className="view_food-right-select-number-title">
                                                                Số lượng:
                                                            </div>
                                                            <div className="view_food-right-select-number-container">
                                                                <div className="view_food-right-select-number-item">
                                                                    <div className="el-input-number">
                                                                        <div className="el-input-number__decrease"
                                                                             onClick={decreaseQuantity}>
                                                                            <i className="fas fa-minus-circle"></i>
                                                                        </div>
                                                                        <div className="input-selecter-number">
                                                                            <input
                                                                                onChange={formik.handleChange}
                                                                                name={"quantity"}
                                                                                value={formik.values.quantity}
                                                                                className="el-input__inner no-arrows"
                                                                                max={food.quantity}
                                                                                min="1"
                                                                                type="number" step="1"/>
                                                                        </div>
                                                                        <div className="el-input-number__increase"
                                                                             onClick={increaseQuantity}>
                                                                            <i className="fas fa-plus-circle"></i>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button className="view_food-right-item-buy">
                                                            <i className="fa-solid fa-cart-plus"></i>
                                                            <button className="view_food-right-item-buy-btn"
                                                                    type={"submit"}>Thêm vào giỏ hàng
                                                            </button>
                                                        </button>
                                                    </div>
                                                </form>
                                            </>
                                        ) : (
                                            <div className="view_food-right-item-container-btn">
                                                <Link
                                                    to={`/update-food/${food.id}`}
                                                    style={{
                                                        textDecoration: `none`,
                                                        color: `white`,
                                                        padding: `10px`
                                                    }}
                                                    className="view_food-right-item-edit">
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                    Sửa thông tin
                                                </Link>

                                                <button className="view_food-right-item-buy"
                                                        onClick={() => deleteFood(food.id)}
                                                        type={"submit"}>
                                                    <i className="fa-solid fa-trash"></i>
                                                    <button className="view_food-right-item-buy-btn">
                                                        Xóa sản phẩm
                                                    </button>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
