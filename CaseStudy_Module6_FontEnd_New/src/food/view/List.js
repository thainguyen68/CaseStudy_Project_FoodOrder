import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useLocation, useParams} from "react-router-dom";
import Filter from "./Filter";
import Swal from "sweetalert2";
import Banner from "../../layout/Banner";
import Toast1 from "../../layout/Toast1";

export default function List() {
    const [foods, setFoods] = useState([])
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get("search");
    const city = +searchParams.get("city");
    const [currentPage, setCurrentPage] = useState(1);
    const [foodsPerPage] = useState(8);
    const { id } = useParams();


    useEffect(() => {
        if (!search) {
            axios.get('http://localhost:8080/api/products').then((res) => {
                setFoods(res.data)
            })
        } else {
            searchByName(search)
        }
    }, [search])

    useEffect(()=>{
        if (!city){
            axios.get('http://localhost:8080/api/products').then((res) => {
                setFoods(res.data)
            })
        }else {
            searchByCity(city);
        }
    },[city])

    useEffect(()=>{
        if (!id){
            axios.get('http://localhost:8080/api/products').then((res) => {
                setFoods(res.data)
            })
        }else {
            searchByCategory(id);
        }
    },[id])




    const searchByName = (search) => {
        axios.get(`http://localhost:8080/api/products/search?search=${search}`).then((res) => {
            setFoods(res.data)
        }).catch(error => {
            setFoods(error.response.data)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Không tìm thấy !',
            })
        });
    }
    const searchByCity = (city) => {
        axios.get(`http://localhost:8080/api/products/city/${city}`).then((res) => {
            setFoods(res.data)
            console.log(res.data)
        }).catch(error => {
            setFoods(error.response.data)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Không tìm thấy !',
            })
        });
    }

    const searchByCategory = (id) => {
        axios.get(`http://localhost:8080/api/products/category/${id}`).then((res) => {
            setFoods(res.data)
        }).catch(error => {
            setFoods(error.response.data)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Không tìm thấy !',
            })
        });
    }




    // Xử lý chuyển trang
    const indexOfLastStudent = currentPage * foodsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - foodsPerPage;
    const currentFoods = foods.slice(indexOfFirstStudent, indexOfLastStudent);

    const totalPages = Math.ceil(foods.length / foodsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const sortFood = (data) => {
        setFoods(data)
    }


    return (
        <>
            <Toast1></Toast1>
            <div className="grid">
                <div className="grid__row app__content">
                    <Banner/>
                    <div className="grid__column-10">

                        <div className="home-product">
                            <Filter filter={sortFood}/>
                            <div className="grid__row">
                                {/*product-item*/}
                                {currentFoods.length>0 && currentFoods.map((items, index) =>
                                    <div className="grid__column-2-4" key={index}>
                                        <Link className="home-product-item" to={`/view-food/${items.id}`}>
                                            <div className="home-product-item__image"
                                                // style={{ backgroundImage: `url(${items.image})` }}
                                            >
                                                <img className="" src={items.image} alt=""/>
                                            </div>

                                            <h4 className="home-product-item__name">
                                                <i className="fa-solid fa-pizza-slice"></i> &nbsp;
                                                {items.name}
                                            </h4>
                                            <div className="home-product-item__price">
                                                <span className="home-product-item__price-old">
                                                    Số lượng: {items.quantity}</span>
                                                <span className="home-product-item__price-current">
                                                    Giá:
                                                    <span style={{marginLeft: `5px`}}>
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(items.price)}
                                                    </span>
                                            </span>

                                            </div>
                                            <div className="home-product-item__action">
                                            <span className="home-product-item__like home-product-item__like--liked">
                                                <i className="home-product-item__like-icon-fill fas fa-heart"></i>
                                                <i className="home-product-item__like-icon-fill fas fa-heart"></i>
                                                <i className="home-product-item__like-icon-fill fas fa-heart"></i>
                                                <i className="home-product-item__like-icon-fill fas fa-heart"></i>
                                                <i className="home-product-item__like-icon-fill fas fa-heart"></i>
                                            </span>

                                                <span className="home-product-item__sold">
                                                    <i className="fa-solid fa-eye"></i> &nbsp;
                                                    Lượt xem: {items.views}
                                            </span>
                                            </div>
                                            <div className="home-product-item__origin">
                                                <span className="home-product-item__brand"></span>
                                                <span className="home-product-item__origin-name">
                                                    <i className="fa-solid fa-store"></i> &nbsp;
                                                   Tên của hàng: {items.shops.name}
                                                </span>
                                            </div>
                                            <div className="home-product-item__favourite">
                                                <i className="fa fa-thumbs-up"></i>
                                                <span>Yêu thích</span>
                                            </div>
                                            {items.voucher.percent !== 0 && <>
                                                <div className="home-product-item__sale-off">
                                                    {/*đây là phần lấy giảm giá ở Voucher*/}
                                                    <span className="home-product-item__sale-off-percent">
                                                    {items.voucher.percent}%
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


            {/* Phân trang */}
            <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <a href={"#header"}>
                        <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                            <i className="pagination-item__icon fas fa-chevron-left"></i>
                        </button>
                    </a>
                </li>
                {Array.from({length: totalPages}).map((_, index) => (
                    <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                        <button className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</button>
                    </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <a href={"#header"}>
                        <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                            <i className="pagination-item__icon fas fa-chevron-right"></i>
                        </button>
                    </a>
                </li>
            </ul>


        </>
    )

}
