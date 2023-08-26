import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import * as yup from "yup";
import {useFormik} from "formik";
import Swal from "sweetalert2";

export default function UpdateVoucher(){
    const navigate = useNavigate();
    const {id} = useParams();
    const shop = JSON.parse(localStorage.getItem("shops"))

    //  đoạn này fix cứng chú  ý lấy lại id
    const idShop = 1;
    useEffect(()=>{
        axios.get(`http://localhost:8080/api/vouchers/${id}`).then((res=>{
            formik.setValues(res.data);
        }))
    },[])
    const validationV = yup.object().shape({
        name: yup.string().min(2, "Độ dài tối thiểu 2 ký tự")
            .max(500, "Độ dài tối đa 500 ký tự")
            .matches(/[a-zA-Z]+/, "Chưa đúng định dạng")
            .required("Không để trống"),
        percent: yup.number().min(0, "Không nhập số âm")
            .max(99, "Giảm giá tối đa 99%")
            .required("Không để trống")
    })

    const formik = useFormik({
        initialValues: {
            name:"",
            percent:"",
            shops : "",
        },
        validationSchema:validationV,
        onSubmit: values => {
            Swal.fire({
                title: 'Bạn có muốn sửa voucher?',
                showDenyButton: true,
                confirmButtonText: 'Lưu',
                denyButtonText: `Hủy`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    axios.put(`http://localhost:8080/api/vouchers/${id}`,{
                        name:values.name,
                        percent:values.percent,
                        shops:[
                            {
                                id:idShop
                            }
                        ]

                    }).then(res => {
                        Swal.fire('Sửa thành công', '', 'success')
                        navigate('/voucher')
                    }).catch(err => console.log(err))
                } else if (result.isDenied) {
                    Swal.fire('Sửa thất bại', '', 'info')
                }
            })
        }
    });

    return (
        <>
            <form onSubmit={formik.handleSubmit} >
                <div className={'row'}>
                    <div className="title-form-container">
                        <h1 className="title-form">Tạo mới Voucher</h1>
                    </div>
                    <div className={'col-md-6'}>
                        <div className="mb-3">
                            <label htmlFor={'name'} className={'form-label'}>Tên</label>
                            <input onChange={formik.handleChange}
                                   name={'name'}
                                   type={'text'} className={'form-control'}
                                   id={'name'}
                                   value={formik.values.name}
                                   onBlur={formik.handleBlur}
                            />
                            {formik.touched.name && formik.errors.name ? (<span className={"text-danger"}>{formik.errors.name}</span>) : null}
                        </div>
                        <div className="mb-3">
                            <label htmlFor={'percent'} className={'form-label'}>Phần trăm giảm giá</label>
                            <input onChange={formik.handleChange}
                                   name={'percent'} type={'number'}
                                   className={'form-control'}
                                   id={'percent'}
                                   onBlur={formik.handleBlur}
                                   value={formik.values.percent}
                            />
                            {formik.touched.percent && formik.errors.percent ? (<span className={"text-danger"}>{formik.errors.percent}</span>) : null}
                        </div>
                        <div className="mb-3">
                            <div style={{float: 'right'}}>
                                <button className={'btn btn-primary'} type={"submit"}>
                                    <i className="fa-solid fa-floppy-disk"></i>
                                </button>
                                &ensp;&ensp;
                                <Link className={'btn btn-primary'} to={'/voucher'}>
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