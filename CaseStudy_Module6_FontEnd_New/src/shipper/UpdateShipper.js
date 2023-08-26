import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";
import {useFormik} from "formik";
import Swal from "sweetalert2";
import * as yup from "yup";

export default function UpdateShipper() {
    const {id} = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`http://localhost:8080/api/shipper/${id}`).then(res => {
            let data = {...res.data}
            formik.setValues(data);
        })
    }, [id])
    const validationS = yup.object().shape({
        name: yup.string().min(2, "Độ dài tối thiểu 2 ký tự")
            .max(500, "Độ dài tối đa 500 ký tự")
            .matches(/[a-zA-Z]+/, "Chưa đúng định dạng")
            .required("Tên không được để trống!"),
        percent: yup.number().min(0, "Dũ liệu nhập vào không hợp lệ"),
        phone: yup.string().max(10, "Số điện thoại phải là 10 số")
            .matches(/(|0[3|5|7|8|9])+([0-9]{8})\b/g, "Chưa đúng định dạng")
            .required("Số điện thoại không được để trống")
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            percent: "",
            phone: "",
        },
        validationSchema: validationS,
        onSubmit: values => {
            Swal.fire({
                title: 'Bạn có muốn cập nhật ?',
                showDenyButton: true,
                confirmButtonText: 'Lưu',
                denyButtonText: `Hủy`,
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.put(`http://localhost:8080/api/shipper/${id}`, {
                        name: values.name,
                        percent: values.percent,
                        phone: values.phone,
                    }).then(res => {
                        Swal.fire('Cập nhật thành công!', '', 'success')
                        navigate('/shipper-manager')
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
                        <h1 className="title-form">Cập nhật thông tin giao hàng</h1>
                    </div>
                    <div className={'col-md-6'}>
                        <div className="mb-3">
                            <label htmlFor={'name'} className={'form-label'}>Nhãn hàng</label>
                            <input onChange={formik.handleChange} name={'name'} type={'text'}
                                   className={'form-control'} id={'name'}
                                   value={formik.values.name}
                                   onBlur={formik.handleBlur}/>
                            {formik.touched.name && formik.errors.name ? (
                                <span className={"text-danger"}>{formik.errors.name}</span>) : null}
                        </div>
                        <div className="mb-3">
                            <label htmlFor={'phone'} className={'form-label'}>Số điện thoại</label>
                            <input onChange={formik.handleChange} name={'phone'} type={'number'}
                                   className={'form-control'} id={'phone'}
                                   placeholder={'Enter phone'}
                                   value={formik.values.phone}
                                   onBlur={formik.handleBlur}/>
                            {formik.touched.phone && formik.errors.phone ? (
                                <span className={"text-danger"}>{formik.errors.phone}</span>) : null}
                        </div>

                        <div className="mb-3">
                            <label htmlFor={'percent'} className={'form-label'}> Giá dịch vụ</label>
                            <input onChange={formik.handleChange} name={'percent'} type={'number'}
                                   className={'form-control'} id={'percent'}
                                   placeholder={'Enter percent'}
                                   value={formik.values.percent}
                                   onBlur={formik.handleBlur}/>
                            {formik.touched.percent && formik.errors.percent ? (
                                <span className={"text-danger"}>{formik.errors.percent}</span>) : null}
                        </div>
                        <div className="mb-3">
                            <div style={{float: 'right'}}>
                                <button className={'btn btn-primary'} type={"submit"}>
                                    <i className="fa-solid fa-floppy-disk"></i>
                                </button>
                                &ensp;&ensp;
                                <Link className={'btn btn-primary'} to={'/'}>
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