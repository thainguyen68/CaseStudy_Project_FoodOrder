import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import { useFormik} from "formik";
import Swal from "sweetalert2";
import * as yup from "yup";

export default function CreateShop(){
    const navigate = useNavigate();
    const [city,setCity] = useState([])
    const user = JSON.parse(localStorage.getItem("user"))
    const idUser = user.id;
    useEffect(() => {
        axios.get("http://localhost:8080/api/city").then(res => {
            setCity(res.data)
        },)
    },[])
    const [lists,setList] = useState([]);
    useEffect(()=>{
        axios.get('http://localhost:8080/api/shops').then((res=>{
            if(res.data !==""){
                setList(res.data);
            }else {
                setList([])
            }
        }))
    },[])
    const checkEmailExists = (email) => {
        return lists.some((shop) => shop.email === email);
    };
    const checkPhone = (phone) => {
        return lists.some((shop) => shop.phone === phone);
    };
    const checkName = (name) => {
        return lists.some((shop) => shop.name === name);
    };
    const setTime = (values) => {
        let str = values + ":00";
        return str;
    }
    const validationS = yup.object().shape({
        name: yup.string().min(2, "Độ dài tối thiểu 2 ký tự")
            .max(500, "Độ dài tối đa 500 ký tự")
            .matches(/[a-zA-Z]+/, "Chưa đúng định dạng")
            .required("Tên không được để trống!").test('Tên đã tồn tại', 'Tên đã tồn tại', function (value) {
                return !checkName(value);
            }),

        description: yup.string().min(2, "Độ dài tối thiểu 2 ký tự")
            .matches(/[a-zA-Z]+/, "Chưa đúng định dạng")
            .required("Mô tả không được để trống!"),


        phone: yup.string().max(10, "Số điện thoại phải là 10 số")
            .matches(/(|0[3|5|7|8|9])+([0-9]{8})\b/g,"Chưa đúng định dạng")
            .required("Số điện thoại không được để trống").test('Số điện thoại duy nhất', 'Số điện thoại đã tồn tại', function (value) {
                return !checkPhone(value);
            }),

        email: yup.string().email("Không đúng định dạng").required("Email không để trống")
            .test('Email duy nhất', 'Email đã tồn tại', function (value) {
                return !checkEmailExists(value);
            }),
        startTime: yup.string().required("Giờ mở cửa không để trống"),
        endTime: yup.string().required("Giờ đóng cửa không để trống"),
        city: yup.string().required("Địa chỉ không để trống")
    })
    const formik = useFormik({
        initialValues: {
            name:"",
            phone:"",
            description:"",
            email:"",
            startTime:"",
            endTime:"",
            city:"",
        },

        validationSchema:validationS,
        onSubmit: values => {
            Swal.fire({
                title: 'Bạn có muốn thêm cửa hàng mới?',
                showDenyButton: true,
                confirmButtonText: 'Lưu',
                denyButtonText: `Hủy`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                        Swal.fire({
                            title: 'Đang khởi tạo...',
                            html: 'Vui lòng đợi trong giây lát...',
                            allowEscapeKey: false,
                            allowOutsideClick: false,
                            didOpen: () => {
                                Swal.showLoading();

                                // Đợi 5 giây (hoặc thời gian tùy chọn) và sau đó đóng hộp thông báo
                                const timeout = 3000; // 5 giây
                                setTimeout(() => {
                                    Swal.close();
                                }, timeout);
                            }
                        })
                    axios.post('http://localhost:8080/api/shops/create',{
                        name:values.name,
                        phone:values.phone,
                        description:values.description,
                        email:values.email,
                        startTime:setTime(values.startTime),
                        endTime:setTime(values.endTime),
                        user:{
                            id:idUser
                        },
                        city:{
                            id:+values.city
                        }

                    }).then(res => {
                        Swal.fire('Tạo thành công!, Mời bạn xác thực Email', '', 'success')
                        navigate('/shop')
                    }).catch(err => console.log(err))
                } else if (result.isDenied) {
                    Swal.fire('Tạo thất bại', '', 'info')
                }
            })
        }
    });
    return (
        <>
            <form onSubmit={formik.handleSubmit} >
                <div className={'row'}>
                    <div className="title-form-container">
                        <h1 className="title-form">Tạo mới cửa hàng</h1>
                    </div>
                    <div className={'col-md-6'}>
                        <div className="mb-3">
                            <label htmlFor={'name'} className={'form-label'}>Tên</label>
                            <input onChange={formik.handleChange}
                                   name={'name'}
                                   type={'text'} className={'form-control'}
                                   id={'name'}
                                   onBlur={formik.handleBlur}
                                   placeholder={'Nhập Tên Cửa Hàng'}/>
                            {formik.touched.name && formik.errors.name ? (<span className={"text-danger"}>{formik.errors.name}</span>) : null}
                        </div>
                        <div className="mb-3">
                            <label htmlFor={'phone'} className={'form-label'}>Số điện thoại</label>
                            <input onChange={formik.handleChange}
                                   name={'phone'} type={'number'}
                                   className={'form-control'}
                                   id={'phone'}
                                   onBlur={formik.handleBlur}
                                   placeholder={'Nhập số điện thoại'}/>
                            {formik.touched.phone && formik.errors.phone ? (<span className={"text-danger"}>{formik.errors.phone}</span>) : null}
                        </div>

                        <div className="mb-3">
                            <label htmlFor={'description'} className={'form-label'}>Địa chỉ</label>
                            <input onChange={formik.handleChange}
                                   name={'description'}
                                   type={'text'} className={'form-control'}
                                   id={'description'}
                                   onBlur={formik.handleBlur}
                                   placeholder={'Số 12 Mỹ Đình, P. Mỹ Đình 2, Q.Nam Từ Liêm ...'}/>
                            {formik.touched.description && formik.errors.description ? (<span className={"text-danger"}>{formik.errors.description}</span>) : null}
                        </div>

                        <div className="mb-3">
                            <label htmlFor={'email'} className={'form-label'}>Email</label>
                            <input onChange={formik.handleChange}
                                   name={'email'} type={'email'}
                                   className={'form-control'}
                                   id={'email'}
                                   onBlur={formik.handleBlur}
                                   placeholder={'biahaixom@gmail.com'}/>
                            {formik.touched.email && formik.errors.email ? (<span className={"text-danger"}>{formik.errors.email}</span>) : null}
                        </div>
                        <div className="mb-3">
                            <label htmlFor={'startTime'} className={'form-label'}>Giờ bắt đầu</label>
                            <input onChange={formik.handleChange}
                                   name={'startTime'} type={'time'}
                                   className={'form-control'}
                                   id={'startTime'}
                                   onBlur={formik.handleBlur}/>
                            {formik.touched.endTime && formik.errors.endTime ? (<span className={"text-danger"}>{formik.errors.endTime}</span>) : null}
                        </div>

                        <div className="mb-3">
                            <label htmlFor={'endTime'} className={'form-label'}>Giờ kết thúc</label>
                            <input onChange={formik.handleChange}
                                   name={'endTime'} type={'time'}
                                   className={'form-control'}
                                   id={'endTime'}
                                   onBlur={formik.handleBlur}/>
                            {formik.touched.endTime && formik.errors.endTime ? (<span className={"text-danger"}>{formik.errors.endTime}</span>) : null}
                        </div>
                        <div className="mb-3">
                            <label htmlFor={'city'} className={'form-label form-label-city'}>Thành phố</label>
                            <select name={"city"}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}>
                                <option>Chon Thành Phố</option>
                                {city.map((item, index)=> (
                                    <option value={item.id} key={index}>{item.name}</option>
                                ))}
                            </select><br/>
                            {formik.touched.city && formik.errors.city ? (<span className={"text-danger"}>{formik.errors.city}</span>) : null}
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