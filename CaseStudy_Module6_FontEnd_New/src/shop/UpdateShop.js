import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useFormik} from "formik";
import Swal from "sweetalert2";
import * as yup from "yup";
import {Modal} from "react-bootstrap";


export default function UpdateShop() {
    const navigate = useNavigate();
    const {id} = useParams();
    const user = JSON.parse(localStorage.getItem("user"))
    const idUser = user.id;
    const [shop, setShop] = useState({});
    const [shippers, setShippers] = useState([]);
    const [newShipper, setNewShipper] = useState([]);
    const [allShipper, setAllShipper] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    useEffect(() => {
        axios.get(`http://localhost:8080/api/shipper/by-status`).then((res) => {
            setAllShipper(res.data);
            window.scrollTo(0, 0);
        });
    }, []);

    const handleCheck = (id) => {
        setNewShipper(prev => {
            const isChecked = newShipper.includes(id);
            if (isChecked) {
                return newShipper.filter(item => item !== id)
            } else {
                return [...prev, id]
            }
        });
    }

    const handleSubmit = () => {
        const shipper = {
            shipperId : newShipper
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        axios.post(`http://localhost:8080/api/shipper/add-shipper/${id}`, shipper, config).then((response) => {
            setNewShipper(response.data);

            handleClose();
        })
    }

    useEffect(() => {
        axios.get(`http://localhost:8080/api/shipper/shops/${id}`).then((response) => {
            console.log('response.data>>>', response.data)
            setShop(response.data);
            setShippers(response.data);
            setNewShipper(response.data.map((item) => item.id));
        })
    }, [])


    const [list, setList] = useState([])
    const [city, setCity] = useState([])
    useEffect(() => {
        axios.get("http://localhost:8080/api/city").then(res => {
            setCity(res.data)
        })
        axios.get(`http://localhost:8080/api/shops/${id}`).then(res => {
            console.log(id)
            let data = {...res.data, city: res.data.city.id}
            formik.setValues(data);
        })
        axios.get('http://localhost:8080/api/shops').then((res=>{
            if(res.data !==""){
                setList(res.data);
            }else {
                setList([])
            }
        }))

    }, []);
    const checkName = (name) => {
        return list.some((shop) => shop.name === name);
    };

    const validationS = yup.object().shape({
        // name: yup.string().min(2, "Độ dài tối thiểu 2 ký tự")
        //     .max(500, "Độ dài tối đa 500 ký tự")
        //     .matches(/[a-zA-Z]+/, "Chưa đúng định dạng")
        //     .required("Tên không được để trống!").test('Tên đã tồn tại', 'Tên đã tồn tại', function (value) {
        //         return !checkName(value);
        //     }),
        description: yup.string().min(2, "Độ dài tối thiểu 2 ký tự")
            .matches(/[a-zA-Z]+/, "Chưa đúng định dạng")
            .required("Mô tả không được để trống!"),
    })

    const formik = useFormik({
        initialValues: {
            name: "",
            phone: "",
            description: "",
            email: "",
            startTime: "",
            endTime: "",
            status: "",
            city: "",
        },
        validationSchema: validationS,
        onSubmit: values => {
            values.endTime = values.endTime.length === 5 ? values.endTime + ":00" : values.endTime;
            values.startTime = values.startTime.length === 5 ? values.startTime + ":00" : values.endTime;

            Swal.fire({
                title: 'Bạn có muốn cập nhật ?',
                showDenyButton: true,
                confirmButtonText: 'Lưu',
                denyButtonText: `Hủy`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    axios.put(`http://localhost:8080/api/shops/${id}`, {
                        name: values.name,
                        phone: values.phone,
                        description: values.description,
                        email: values.email,
                        startTime: values.startTime,
                        endTime: values.endTime,
                        user: {
                            id: idUser
                        },
                        city: {
                            id: values.city
                        }
                    }).then(res => {
                        Swal.fire('Cập nhật thành công!', '', 'success')
                        navigate('/shop')
                    }).catch(err => console.log(err))
                } else if (result.isDenied) {
                    Swal.fire('Cập nhật thất bại', '', 'info')
                }
            })


        }
    });


    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <div className={'row'}>
                    <div className="title-form-container">
                        <h1 className="title-form">Cập nhật thông tin cửa hàng</h1>
                    </div>
                    <div className={'col-md-6'}>
                        <div className="mb-3">
                            <label htmlFor={'name'} className={'form-label'}>Tên</label>
                            <input onChange={formik.handleChange}
                                   readOnly={true}
                                   name={'name'}
                                   type={'text'}
                                   className={'form-control'} id={'name'}
                                   value={formik.values.name}
                                   onBlur={formik.handleBlur}/>
                            {formik.touched.name && formik.errors.name ? (<span className={"text-danger"}>{formik.errors.name}</span>) : null}
                        </div>
                        <div className="mb-3">
                            <label htmlFor={'phone'} className={'form-label'}>Số điện thoại</label>
                            <input readOnly={true} onChange={formik.handleChange} name={'phone'} type={'number'}
                                   className={'form-control'} id={'phone'}
                                   placeholder={'Enter phone'}
                                   value={formik.values.phone}
                                   onBlur={formik.handleBlur}/>
                            {formik.touched.phone && formik.errors.phone ? (<span className={"text-danger"}>{formik.errors.phone}</span>) : null}
                        </div>

                        <div className="mb-3">
                            <label htmlFor={'description'} className={'form-label'}>Mô tả</label>
                            <input onChange={formik.handleChange} name={'description'} type={'text'}
                                   className={'form-control'} id={'description'}
                                   placeholder={'Enter description'}
                                   value={formik.values.description}
                                   onBlur={formik.handleBlur}/>
                            {formik.touched.description && formik.errors.description ? (<span className={"text-danger"}>{formik.errors.description}</span>) : null}
                        </div>

                        <div className="mb-3">
                            <label htmlFor={'email'} className={'form-label'}>Email</label>
                            <input readOnly={true} onChange={formik.handleChange} name={'email'} type={'email'}
                                   className={'form-control'} id={'email'}
                                   placeholder={'Enter email'}
                                   value={formik.values.email}
                                   onBlur={formik.handleBlur}/>
                            {formik.touched.email && formik.errors.email ? (<span className={"text-danger"}>{formik.errors.email}</span>) : null}
                        </div>
                        <div className="mb-3">
                            <label htmlFor={'startTime'} className={'form-label'}>Giờ bắt đầu</label>
                            <input onChange={formik.handleChange} name={'startTime'} type={'time'}
                                   className={'form-control'} id={'startTime'}
                                   placeholder={'Enter startTime'}
                                   value={formik.values.startTime}
                                   onBlur={formik.handleBlur}/>
                            {formik.touched.startTime && formik.errors.startTime ? (<span className={"text-danger"}>{formik.errors.startTime}</span>) : null}
                        </div>

                        <div className="mb-3">
                            <label htmlFor={'endTime'} className={'form-label'}>Giờ kết thúc</label>
                            <input onChange={formik.handleChange} name={'endTime'} type={'time'}
                                   className={'form-control'} id={'endTime'}
                                   placeholder={'Enter endTime'}
                                   value={formik.values.endTime}
                                   onBlur={formik.handleBlur}/>

                            {formik.touched.endTime && formik.errors.endTime ? (<span className={"text-danger"}>{formik.errors.endTime}</span>) : null}
                        </div>
                        <div className="mb-3">
                            <label htmlFor={'city'} className={'form-label form-label-city'}>Thành phố</label>
                            <select name={"city"}
                                    onChange={formik.handleChange}
                                    value={formik.values.city}
                                    onBlur={formik.handleBlur}>
                                <option>Chon Thành Phố</option>
                                {city.map((item, index) => (
                                    <option value={item.id} key={index}>{item.name}</option>
                                ))}
                            </select><br/>
                            {<span className={"text-danger"}>{formik.errors.city}</span>}
                        </div>

                        <div className="mb-3">
                            <div style={{float: 'right'}}>
                                <button className={'btn btn-primary'} type={"submit"}>
                                    <i className="fa-solid fa-floppy-disk"></i>
                                </button>
                                &ensp;&ensp;
                                <Link className={'btn btn-primary'} to={'/shop'}>
                                    <i className={"fa-solid fa-house"}></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}