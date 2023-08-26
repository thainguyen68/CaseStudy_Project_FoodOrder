import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

export default function QuickSearch(){
    const { id } = useParams();
    const [food, setFood] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [foodsPerPage] = useState(8);
    useEffect(() => {
        axios.get(`http://localhost:8080/api/products/category/${id}`).then((res) => {
            setFood(res.data);
        });
    }, [id]);


    useEffect(() => {
        setCurrentPage(1); // Reset currentPage when search changes
    }, [id]);

    const indexOfLastFood = currentPage * foodsPerPage;
    const indexOfFirstFood = indexOfLastFood - foodsPerPage;
    const currentFoods = food.slice(indexOfFirstFood, indexOfLastFood);

    const totalPages = Math.ceil(food.length / foodsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return(
        <>
            <div className="search-page">
                <div className="grid">
                    <div className="grid__row app__content">
                        <div className="grid__column-10">
                            <div className="home-product">
                                <div className="grid__row">
                                    {/*product-item*/}
                                    {currentFoods.map((food, index) =>
                                        <div className="grid__column-2-4" key={index}>
                                            <Link className="home-product-item" to={`/view-food/${food.id}`} >
                                                <div className="home-product-item__image"
                                                >
                                                    <img className=""  src={food.image} alt=""/>
                                                </div>

                                                <h4 className="home-product-item__name">{food.name}</h4>
                                                <div className="home-product-item__price">
                                                <span className="home-product-item__price-old">
                                                    Số lượng: {food.quantity}</span>
                                                    <span className="home-product-item__price-current">
                                                    Giá:
                                                         <span style={{marginLeft: `5px`}}>
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(food.price)}
                                                    </span>
                                                    </span>
                                                </div>
                                                <div className="home-product-item__action">
                                            <span className="home-product-item__like home-product-item__like--liked">
                                                {/*<i className="home-product-item__like-icon-empty far fa-heart"></i>*/}
                                                <i className="home-product-item__like-icon-fill fas fa-heart"></i>
                                            </span>
                                                    <span className="home-product-item__sold">
                                                Lượt xem: {food.views}
                                            </span>
                                                </div>
                                                <div className="home-product-item__origin">
                                                    <span className="home-product-item__brand"></span>
                                                    <span className="home-product-item__origin-name">
                                                   Tên của hàng: {food.shops.name}</span>
                                                </div>
                                                <div className="home-product-item__favourite">
                                                    <i className="fa fa-thumbs-up"></i>
                                                    <span>Yêu thích</span>
                                                </div>
                                                {food.voucher.percent !== 0 && <>
                                                    <div className="home-product-item__sale-off">
                                                        {/*đây là phần lấy giảm giá ở Voucher*/}
                                                        <span className="home-product-item__sale-off-percent">
                                                    {food.voucher.percent}%
                                                </span>
                                                        <span className="home-product-item__sale-off-label">Giảm</span>
                                                    </div>
                                                </>}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                            <i className="pagination-item__icon fas fa-chevron-left"></i>
                        </button>
                    </li>
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                            <button className="page-link" onClick={() => paginate(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                            <i className="pagination-item__icon fas fa-chevron-right"></i>
                        </button>
                    </li>
                </ul>
            </div>
        </>
    )
}