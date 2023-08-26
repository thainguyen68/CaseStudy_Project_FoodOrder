import {Link, useNavigate} from "react-router-dom";
import * as Yup from 'yup'
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import {useFormik} from "formik";
import storage from "../../config/FirebaseConfig";
import {Food} from "../../model/Food";
import Swal from "sweetalert2";

const getCategory = async () => {
    return await axios.get(`http://localhost:8080/api/category`)
};
const getVoucher = async () => {
    return await axios.get(`http://localhost:8080/api/vouchers`)
};

export default function FormCreate(props) {
    const [nameProducts, setNameProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [voucher, setVoucher] = useState([]);
    const [voucherChose, setVoucherChose] = useState([]);
    const [categoryChose, setCategoryChose] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const idUser = user.id;

    useEffect(() => {
        getCategory().then(res => {
            setCategory(res.data)
        })
    }, []);
    useEffect(() => {
      getVoucher().then(res => {
          setVoucher(res.data)
      })
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/products/shop/${props.idShop}`).then((res => {
            setNameProducts(res.data);
        }))
    }, [])

    const validation = Yup.object().shape({
        name: Yup.string().min(2, "Độ dài không hợp lệ")
            .max(500, "Độ dài không hợp lệ")
            .required("Hãy nhập dữ liệu!")
            .test("Tên đã tồn tại", "Đã tồn tại", function (value) {
                return !checkNameProduct(value)
            }),
        description: Yup.string().min(2, "Độ dài không hợp lệ")
            .required("Hãy nhập dữ liệu!"),

        quantity: Yup.number().min(0, "Độ dài không hợp lệ")
            .required("Hãy nhập dữ liệu!"),

        price: Yup.number().min(0, "Độ dài không hợp lệr")
            .required("Hãy nhập dữ liệu!"),
    })

    const checkNameProduct = (name) => {
        return nameProducts.some((products) => products.name === name);
    };
    const setVoucherId = (values) => {
        if (values === ""){
            values = 1;
        }
        return values
    }
    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            quantity: 0,
            price: 0,
            voucher: ""

        },
        onSubmit: async (values) => {
            let data = {...values};
            let fileUrls = [];

            if (imageFiles.length > 0) {
                const uploadPromises = imageFiles.map((file) => {
                    const time = new Date().getTime();
                    const nameFile = time + "-" + file.name;
                    const storageRef = ref(storage, `image/${nameFile}`);
                    const uploadTask = uploadBytesResumable(storageRef, file);

                    return new Promise((resolve, reject) => {
                        uploadTask.on(
                            "state_changed",
                            (snapshot) => {
                            },
                            (error) => {
                                reject(error);
                            },
                            () => {
                                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                    fileUrls.push(downloadURL);
                                    resolve();
                                });
                            }
                        );
                    });
                });

                try {
                    await Promise.all(uploadPromises);
                    data.image = fileUrls;
                } catch (error) {
                    console.error("Error uploading files:", error);
                }
            } else {
                data.image = ["https://websitecukcukvn.misacdn.net/wp-content/uploads/2022/02/shopee-food.png"];
            }
            data.voucher = {
                id: +setVoucherId(values.voucher)
            } 
            data.categories = categoryChose;

            data.shops = {
                id: props.idShop
            };
            data.id = props.food.id;
                Swal.fire({
                    title: 'Bạn có muốn thêm sản phẩm mới?',
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: 'Lưu',
                    denyButtonText: `Hủy`,
                    width:`450px`,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        axios.post(`http://localhost:8080/api/products`, data).then((res) => {
                            Swal.fire({
                                title: 'Đang tạo sản phẩm...',
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
                                Swal.fire('Thêm thành công!', '', 'success');
                                navigate('/');
                            })
                        }).catch(err => console.log(err));
                    } else if (result.isDenied) {
                        Swal.fire('Thêm thất bại', '', 'info');
                    }
                }).catch(err => {
                    console.log(err.message);
                });

        },
        validationSchema: validation,

    })
    useEffect(() => {
    }, [categoryChose])
    // useEffect(() => {
    // }, [voucherChose])

    const choseCategory = (e) => {
        let id = +e.target.value;
        let category = categoryChose.filter(item => item.id === id);
        if (category.length > 0) {
            let data = categoryChose.filter(item => item.id !== id);
            setCategoryChose([...data]);
        } else {
            setCategoryChose([...categoryChose, {id: id}]);
        }
    };
    // const choseVoucher = (e) => {
    //     let id = +e.target.value;
    //     let voucher = voucherChose.filter(item => item.id === id);
    //     if (voucher.length > 0) {
    //         let data = voucherChose.filter(item => item.id !== id);
    //         setVoucherChose([...data]);
    //     } else {
    //         setVoucherChose([...voucherChose, {id: id}])
    //     }
    // };

    const choseFileUpload = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setImageFiles(selectedFiles);
        const previews = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewImages(previews);
    };


    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <div className={'row'}>
                    <div className="title-form-container">
                        <h1 className="title-form">Tạo món ăn mới</h1>
                    </div>
                    <div className={'col-md-6'}>
                        <div className="mb-3">
                            <label htmlFor={'outlined-basic'} className={'form-label'}>Tên món ăn</label>
                            <TextField
                                onChange={formik.handleChange}
                                error={formik.errors.name && formik.touched.name}
                                fullWidth id="outlined-basic"
                                name="name"
                                // label=" Nhập tên sản phẩm "
                                className="form-control"
                                variant="outlined"
                                helperText={formik.errors.name && formik.touched.name ? formik.errors.name : ""}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor={''} className={'form-label'}>Mô tả món ăn</label><TextField
                            onChange={formik.handleChange}
                            error={formik.errors.description && formik.touched.description}
                            fullWidth id="outlined-basic"
                            name="description"
                            // label=" Nhập mô tả sản phẩm "
                            className="form-control"
                            variant="outlined"
                            helperText={formik.errors.description && formik.touched.description ? formik.errors.description : ""}
                        />
                        </div>

                        <div className="mb-3">
                            <label htmlFor={''} className={'form-label'}>Số lượng</label>
                            <TextField
                                onChange={formik.handleChange}
                                error={formik.errors.quantity && formik.touched.quantity}
                                fullWidth id="outlined-basic"
                                name="quantity"
                                // label=" Nhập số lượng sản phẩm "
                                className="form-control"
                                variant="outlined"
                                helperText={formik.errors.quantity && formik.touched.quantity ? formik.errors.quantity : ""}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor={''} className={'form-label'}>Giá</label>
                            <TextField
                                onChange={formik.handleChange}
                                error={formik.errors.price && formik.touched.price}
                                fullWidth id="outlined-basic"
                                name="price"
                                // label=" Nhập giá sản phẩm "
                                className="form-control"
                                variant="outlined"
                                helperText={formik.errors.price && formik.touched.price ? formik.errors.price : ""}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor={'voucher'} className={'form-label form-label-city'}>Mã giảm giá</label>
                            <select name={"voucher"}
                                    onChange={formik.handleChange}>
                                {voucher.map((item, index) => (
                                    <option value={item.id} key={index}>{item.name}</option>
                                ))}
                            </select><br/>
                        </div>
                        <div className="mb-3">
                            <FormLabel component="legend">
                                <span className="type-text-form">Các thể loại</span>
                            </FormLabel>
                            {category.map((item) => (
                                    <FormControlLabel
                                        key={item.id}
                                        classes={{label: 'type-text-form'}}
                                        control={<Checkbox onChange={choseCategory} value={item.id}/>}
                                        label={item.name}
                                    />
                                )
                            )}
                        </div>
                        <div className="mb-3">
                            <div className="shopList_image_form">
                                <span>Tải lên từ &nbsp;</span>
                                <label htmlFor="image" className="label-custom_image_form">Chọn</label>
                                <input
                                    hidden={true}
                                    type="file"
                                    className="form-control"
                                    id="image"
                                    onChange={choseFileUpload}
                                    multiple
                                />
                                <span style={{fontStyle: `italic`}}>Chấp nhận GIF, JPEG, PNG, BMP với kích thước tối đa 5.0 MB </span>
                            </div>
                        </div>
                        <div className="mb-3">
                            {previewImages.map((preview, index) => (
                                <img
                                    key={index}
                                    src={preview}
                                    alt={`Preview ${index}`}
                                    style={{maxWidth: '100px', maxHeight: '100px', marginRight: '10px'}}
                                />
                            ))}
                        </div>
                        <div className="mb-3">
                            <div style={{float: 'right'}}>
                                <button type="submit" className={'btn btn-primary'}>
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