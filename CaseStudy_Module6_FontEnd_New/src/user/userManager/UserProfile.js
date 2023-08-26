import {useEffect, useState} from "react";
import axios from "axios";
import {useFormik} from "formik";
import Swal from "sweetalert2";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import storage from "../../config/FirebaseConfig";
import {Link, useNavigate} from "react-router-dom";
import * as Yup from "yup";
import * as yup from "yup";


export default function UserProfile() {
    const user = JSON.parse(localStorage.getItem("user"));
    const idUser = user.id;

    const [phoneUpdate,setPhoneUpdate] = useState({});
    const [showUserInfo, setShowUserInfo] = useState(true);
    const [showSecurity, setshowSecurity] = useState(false);

    const [userUpdate, setUserUpdate] = useState({});
    let navigate = useNavigate();
    const [phone, setPhone] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/users/${idUser}`).then((res) => {
            let data = {...res.data};
            formik.setValues(data);
            setUserUpdate(res.data);
            console.log(data)
        });
        axios.get('http://localhost:8080/api/users').then((res => {
            if (res.data !== "") {
                setPhone(res.data);
            } else {
                setPhone([])
            }
        }))
    }, []);
    const checkPhoneUser = (phoneUser) => {
        return phone.some((user) => user.phone === phoneUser);
    };
    const validationU = Yup.object().shape({


        // phone: yup.string().max(10, "Số điện thoại phải là 10 số")
        //     .matches(/(|0[3|5|7|8|9])+([0-9]{8})\b/g, "Chưa đúng định dạng")
        //     .required("Số điện thoại không được để trống").test('Số điện thoại duy nhất', 'Số điện thoại đã tồn tại', function (value) {
        //         return !checkPhoneUser(value);
        //     })

    })

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            gender: "",
            birthday: "",
            image: "",
            phone: "",
        },
        validationSchema: validationU,
        onSubmit: async (values) => {
            try {
                Swal.fire({
                    title: "Bạn muốn cập nhật ?",
                    showDenyButton: true,
                    confirmButtonText: "Lưu",
                    denyButtonText: `Hủy`,
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await axios.put(`http://localhost:8080/api/users/${idUser}`, values);
                        await Swal.fire("Cập nhật thành công!", "", "success");
                    } else if (result.isDenied) {
                        await Swal.fire("Cập nhật thất bại", "", "info");
                    }
                });
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        },
    });

    async function uploadImage() {
        const file = document.getElementById("uploadAvatar").files[0];
        if (file) {
            const storageRef = ref(storage, `files/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on("state_changed",
                () => {
                },
                (error) => {
                    alert(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            const imageDTO = {img: downloadURL};
                            user.image = downloadURL;
                            localStorage.setItem("user", JSON.stringify(user));

                            Swal.fire({
                                title: 'Đang cập nhật ảnh...',
                                html: 'Vui lòng đợi trong giây lát...',
                                allowEscapeKey: false,
                                allowOutsideClick: false,
                                didOpen: () => {
                                    Swal.showLoading();

                                    // Đợi 2,5 giây (hoặc thời gian tùy chọn) và sau đó đóng hộp thông báo
                                    const timeout = 2500; // 2,5 giây
                                    setTimeout(() => {
                                        Swal.close();
                                    }, timeout);
                                }
                            }).then((result) => {
                                axios.put(`http://localhost:8080/api/users/upload-img/${idUser}`, imageDTO)
                                    .then(res => {
                                        Swal.fire("Cập nhật ảnh thành công!", "", "success");
                                        window.location.reload();
                                    });
                            })

                        }
                    );
                })
        }
    }

    async function uploadRole() {
        let data = userUpdate;
        data.roles[0].id = 3;
        Swal.fire({
            title: "Bạn muốn nâng cấp?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Lưu",
            denyButtonText: `Hủy`,
        }).then((result) => {
            if (result.isConfirmed) {
                axios.put(`http://localhost:8080/api/users/upload-role`, data
                ).then((res) => {
                    if (res.data.username) {
                        Swal.fire({
                            title: 'Đang nâng cấp...',
                            html: 'Vui lòng đợi trong giây lát...',
                            allowEscapeKey: false,
                            allowOutsideClick: false,
                            didOpen: () => {
                                Swal.showLoading();

                                // Đợi 5 giây (hoặc thời gian tùy chọn) và sau đó đóng hộp thông báo
                                const timeout = 2500; // 5 giây
                                setTimeout(() => {
                                    Swal.close();
                                }, timeout);
                            }
                        }).then((result) => {
                            Swal.fire('Nâng cấp thành công!Mời bạn đăng nhập lại tài khoản!', '', 'success');
                            localStorage.clear();
                            navigate('/')

                        })
                    } else {
                        Swal.fire("Nâng cấp ko thành công!", "", "success");
                    }

                }).catch(err => console.log(err));
            } else if (result.isDenied) {
                Swal.fire('Hủy', '', 'info');
            }
        }).catch(error => {
            Swal.fire({
                title: "Lỗi rồi!",
                text: "Nâng cấp thất bại",
                icon: "error",
                confirmButtonText: "OK"
            });
        })
    }
    async function userPhoneUpdate() {
        let data = phoneUpdate
        console.log(data)
        data = user.phone
        await axios.put(`http://localhost:8080/api/users/upload-role`, data
        ).then((res) => {
            Swal.fire("Cập nhật thành công!", "", "success");
            window.location.reload();
        }).catch(err => console.log(err));
    }
    function displayUserForm() {
        setShowUserInfo(true)
        setshowSecurity(false)
    }
    function displaySecurityForm() {
        setshowSecurity(true)
        setShowUserInfo(false)

    }

    // xử lý ảnh avatar nè
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };



    return (
        <>
            <div className="grid">
                <div className="grid__row app__content">
                    <div className="grid__column-12">
                        <div className="home-user">
                            <div className="grid__column-3">
                                <div className="home-user-left">
                                    <div className="home-user-left-header">
                                        <div className="home-user-left-header-container">
                                            <div className="home-user-left-header-item-avatar">
                                                <img src={user.image}/>
                                            </div>
                                            <div className="home-user-left-header-item-name">
                                                <span className="home-user-left-header-item-name-text">
                                                    {user.name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="home-user-left-content">
                                        <div className="home-user-left-content-item">
                                            <i className="fa-solid fa-user"></i>
                                        </div>
                                        <div className="home-user-left-content-text" onClick={displayUserForm}>
                                            Cập nhật tài khoản
                                        </div>
                                        <div className="home-user-left-content-item">
                                            <i className="fa-solid fa-angle-right"></i>
                                        </div>
                                    </div>
                                    <div className="home-user-left-content">
                                        <div className="home-user-left-content-item">
                                            <i className="fa-solid fa-clock-rotate-left"></i>
                                        </div>
                                        <div className="home-user-left-content-text">
                                            <Link to={'/products-carts-oder'}
                                                  className="home-user-left-content-text-link">
                                                Lịch sử đơn mua
                                            </Link>
                                        </div>
                                        <div className="home-user-left-content-item">
                                            <i className="fa-solid fa-angle-right"></i>
                                        </div>
                                    </div>
                                    <div className="home-user-left-content" onClick={displaySecurityForm}>
                                        <div className="home-user-left-content-item">
                                            <i className="fa-regular fa-credit-card"></i>
                                        </div>
                                        <div className="home-user-left-content-text">
                                            Phương thức thanh toán
                                        </div>
                                        <div className="home-user-left-content-item">
                                            <i className="fa-solid fa-angle-right"></i>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*----- đoạn này thông tin cá nhân ban đầu -----*/}
                            {showUserInfo &&
                                <>
                                    <div className="grid__column-8">
                                        <div className="home-user-right">
                                            <div className="home-user-right-title">
                                                Thông tin người dùng
                                            </div>
                                            <div className="home-user-right-content">
                                                <div className="home-user-right-content-info-upContainer">
                                                    {user.authorities[0].authority === "ROLE_USER" &&
                                                        <>
                                                            <div className="home-user-right-content-info-up">
                                                                <span>Trở thành người bán</span>
                                                                <i onClick={uploadRole}
                                                                   className="fa-solid fa-cloud-arrow-up"></i>
                                                            </div>
                                                        </>
                                                    }
                                                </div>
                                                <div className="home-user-right-content-info">
                                                    <div className="home-user-title-user">Tải ảnh đại diện</div>
                                                    <div className="home-user">
                                                        <div className="grid__column-3">
                                                            <div className="home-user-avatar-image">
                                                                {/*<img src={user.image}/>*/}
                                                                <img src={selectedImage || user.image} alt="User Avatar" />
                                                            </div>
                                                        </div>
                                                        <div className="grid__column-9">
                                                            <div className="home-user-avatar-form">
                                                                <span>Tải lên từ</span>
                                                                <div className="home-user-file-image">
                                                                    <input id="uploadAvatar" type="file" hidden required
                                                                           name={'image'}
                                                                           accept="image/*"
                                                                           onChange={handleImageChange}
                                                                    />
                                                                    <label className="label-custom"
                                                                           htmlFor="uploadAvatar">Chọn</label>
                                                                    <span style={{fontStyle: `italic`}}>Chấp nhận GIF, JPEG, PNG, BMP với kích thước tối đa 5.0 MB </span>
                                                                </div>
                                                            </div>
                                                            <button onClick={uploadImage} className="btn-orange">Cập nhật
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="home-user-right-content-info">
                                                    <form onSubmit={formik.handleSubmit}>
                                                        <div className="home-user-title-user">Thay đổi thông tin</div>
                                                        <div className="home-user-form">
                                                            <div className="grid__column-3">
                                                                <span className="home-user-form-name">Tên</span>
                                                            </div>
                                                            <div className="grid__column-4">
                                                                <div className="home-user-right-input">
                                                                    <input type="text"
                                                                           readOnly={true}
                                                                           style={{color: `#a3a0a0b0`}}
                                                                           onChange={formik.handleChange}
                                                                           value={formik.values.username}
                                                                           id={'username'}
                                                                           name={'username'}
                                                                           onBlur={formik.handleBlur}
                                                                           className=""/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="home-user-form">
                                                            <div className="grid__column-3">
                                                                <span className="home-user-form-name">Giới tính</span>
                                                            </div>
                                                            <div className="grid__column-4">
                                                                <div className="home-user-right-input-container">
                                                                    {["Nam", "Nữ", "Khác"].map((option) => (
                                                                        <div className="home-user-right-input-inner"
                                                                             key={option}>
                                                                            <input type="radio"
                                                                                   name="gender"
                                                                                   value={option}
                                                                                   onChange={formik.handleChange}
                                                                                   checked={formik.values.gender === option}/>
                                                                            <span className="">{option}</span>
                                                                        </div>))}
                                                                </div>

                                                            </div>
                                                        </div>
                                                        <div className="home-user-form">
                                                            <div className="grid__column-3">
                                                                <span className="home-user-form-name">Email</span>
                                                            </div>
                                                            <div className="grid__column-4">
                                                                <div className="home-user-right-input">
                                                                    <input readOnly={true}
                                                                           type="text"
                                                                           style={{color: `#a3a0a0b0`}}
                                                                           name={'email'}
                                                                           onChange={formik.handleChange}
                                                                           value={formik.values.email}
                                                                           id={'email'}
                                                                           onBlur={formik.handleBlur}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="home-user-form">
                                                            <div className="grid__column-3">
                                                                <span className="home-user-form-name">Ngày sinh</span>
                                                            </div>
                                                            <div className="grid__column-4">
                                                                <div className="home-user-right-input">
                                                                    <input type="date"
                                                                           className="fixInputBirth"
                                                                           name={'birthday'}
                                                                           onChange={formik.handleChange}
                                                                           value={formik.values.birthday}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="home-user-title-user-list-phone">
                                                            <div className="home-user-form">
                                                                <div className="grid__column-3">
                                                                    <span className="home-user-form-name">Số điện thoại</span>
                                                                </div>
                                                                <div className="grid__column-4">
                                                                    <div className="cssPhone">
                                                                        <input type="text"
                                                                               // readOnly={true}
                                                                               name={'phone'}
                                                                               onChange={formik.handleChange}
                                                                               id={'phone'}
                                                                               value={formik.values.phone}
                                                                               onBlur={formik.handleBlur}
                                                                        />
                                                                        {formik.touched.phone && formik.errors.phone ? (
                                                                            <span
                                                                                className={"text-danger"}>{formik.errors.phone}
                                                                            </span>) : null}
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div className="grid__column-3">
                                                            <button className="btn-orange">Lưu thay đổi</button>
                                                        </div>
                                                        </div>
                                                    </form>
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                </>

                            }

                            {
                                showSecurity &&
                                <>
                                    {/*/!* -----đoạn này sẽ thay đổi trng thái componoun----  *!/*/}
                                    <div className="grid__column-8">
                                        <div className="home_user_paying">
                                            <div className="home_user_paying-img">
                                                <img src="../static/img/service-8.jpg"/>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}