import formik, { useFormik} from "formik";
import axios from "axios";
import Swal from "sweetalert2";
import {useEffect, useState} from "react";
import * as Yup from "yup";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Register({setRegister,handleCloseRegister}) {
    const [list,setList] = useState([]);
    useEffect(()=>{

        axios.get('http://localhost:8080/api/users').then((res=>{
            if(res.data !==""){
                setList(res.data);
            }else {
                setList([])
            }
        }))
    },[])
    const checkEmailExists = (email) => {
        return list.some((user) => user.email === email);
    };
    const checkUsername = (username) => {
        return list.some((user) => user.username === username);
    };

    const validation = Yup.object().shape({
        username: Yup.string().required("Tên không để trống").matches(/^[a-z0-9_-]{3,16}$/, 'Chưa đúng định dạng')
            .test('Tên duy nhất', 'Tên đăng nhập đã tồn tại',function (value) {return !checkUsername(value)
            }),
        password:Yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,"Chưa đúng định dạng").required("Mật khẩu rỗng"),
        email: Yup.string().email("Invalid email address").required("Email không để trống")
            .test('Email duy nhất', 'Email đã tồn tại', function (value) {
                return !checkEmailExists(value);
            }),
        roles:Yup.string().required("Chức năng không được để trống")
    })
    const setValueRole = (values)=>{
        if(values === 4){
            values = 2;
        }
        return  values;
    }

    const formikRegister = useFormik({
        initialValues: {
            username: '',
            password: '',
            email: '',
            roles: ''
        },

        validationSchema:validation,
        onSubmit: values => {
            console.log(values.roles)
            console.log(setValueRole(values.roles))
            Swal.fire({
                title: 'Bạn có đăng ký?',
                showDenyButton: true,
                confirmButtonText: 'Lưu',
                denyButtonText: `Hủy`,
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Đang khởi tạo...',
                        html: 'Vui lòng đợi trong giây lát...',
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();

                            // Đợi 5 giây (hoặc thời gian tùy chọn) và sau đó đóng hộp thông báo
                            const timeout = 5000; // 5 giây
                            setTimeout(() => {
                                Swal.close();
                            }, timeout);
                        }
                    })
                    axios.post('http://localhost:8080/api/auth/register', {
                        username: values.username,
                        password: values.password,
                        email: values.email,
                        image: "https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2023/02/hinh-avatar-anh-dai-dien-FB-mac-dinh.jpg?ssl\u003d1",
                        roles: [
                            {
                                id: +setValueRole(values.roles)
                            }
                        ]
                    }).then((res) => {
                        if (res.data !== null) {
                            Swal.fire({
                                icon: 'success',
                                title: `Oops...Hello...${values.username}`,
                                text: 'Đăng kí thành công, Mời bạn đến email xác thực',
                            })
                            handleCloseRegister()
                        } else {
                            Swal.fire({
                                title: "Lỗi rồi!",
                                text: "aaaaaaaaaaaaaa",
                                icon: "error",
                                confirmButtonText: "OK"
                            });
                        }
                    }).catch(error => {
                        Swal.fire({
                            title: "Lỗi rồi!",
                            text: "Đăng kí thất bại",
                            icon: "error",
                            confirmButtonText: "OK"
                        });
                    })
                }
            })
        },
    });

    const [showPassword, setShowPassword] = useState(false);


    return (
        <>
            <div className="auth-form">
                <form onSubmit={formikRegister.handleSubmit}>
                    <div
                        className="auth-form__container">
                        <div
                            className="auth-form__header ">
                            <h3 className="auth-form__heading">Đăng
                                ký</h3>
                            <span onClick={setRegister}
                                  className="auth-form__switch-btn"
                            >Đăng nhập</span>
                        </div>

                        <div
                            className="auth-form__form">
                            <div
                                className="auth-form__group">
                                <input
                                    name={'username'}
                                    onChange={formikRegister.handleChange}
                                    type="text"
                                    id="name_register"
                                    className="auth-form__input"
                                    placeholder="Tài khoản của bạn"
                                    onBlur={formikRegister.handleBlur}
                                />
                                {formikRegister.touched.username && formikRegister.errors.username ? (<span className={"text-danger"}>{formikRegister.errors.username}</span>) : null}

                            </div>
                            <div
                                className="auth-form__group">
                                <input
                                    name={'password'}
                                    onChange={formikRegister.handleChange}
                                    type={showPassword ? "text" : "password"}
                                    id="pass_register"
                                    className="auth-form__input"
                                    placeholder="Mật khẩu của bạn"
                                    onBlur={formikRegister.handleBlur}/>
                                {showPassword ? (
                                        <span
                                            className="auth-form__toggle-password"
                                            onClick={() => setShowPassword(false)}>
                                                          <FontAwesomeIcon icon={faEye} />
                                                    </span>) :
                                    (<span
                                            className="auth-form__toggle-password"
                                            onClick={() => setShowPassword(true)}>
                                                      <FontAwesomeIcon icon={faEyeSlash} />
                                                    </span>
                                    )}
                                {formikRegister.touched.password && formikRegister.errors.password ? (<span className={"text-danger"}>{formikRegister.errors.password}</span>) : null}
                            </div>
                            <div
                                className="auth-form__group">
                                <input
                                    name={'email'}
                                    onChange={formikRegister.handleChange}
                                    type="email"
                                    className="auth-form__input"
                                    placeholder="Nhập email của bạn"
                                    onBlur={formikRegister.handleBlur}
                                />
                                {formikRegister.touched.email && formikRegister.errors.email ? (<span className={"text-danger"}>{formikRegister.errors.email}</span>) : null}
                            </div>
                            <div
                                className="auth-form__group">
                                <select name="roles"
                                        defaultValue="4"
                                        id="role"
                                        onChange={formikRegister.handleChange}
                                        onBlur={formikRegister.handleBlur}>
                                    <option selected={true}
                                            value="4" >
                                        Chọn chức năng
                                    </option>
                                    <option
                                        value="3">Người Bán
                                    </option>
                                    <option
                                        value="2">Người Mua
                                    </option>
                                </select><br/>
                                {formikRegister.touched.roles && formikRegister.errors.roles ? (<span className={"text-danger"}>{formikRegister.errors.roles}</span>) : null}
                            </div>
                        </div>
                        <div
                            className="auth-form__aside">
                            <p className="auth-form__policy-text">
                                Bằng việc đăng kí, bạn
                                đã đồng ý với Shopee về
                                <span
                                    className="auth-form__text-link">Điều khoản dịch vụ</span> &
                                <span
                                    className="auth-form__text-link">Chính sách bảo mật</span>
                            </p>
                        </div>
                        <div
                            className="auth-form__controls">
                            <button type={"button"} className="btn btn--normal auth-form__control-back"
                                    data-bs-dismiss="modal" onClick={handleCloseRegister}
                            >Trở lại
                            </button>
                            <button
                                className="btn btn--primary" >
                                Đăng ký
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}