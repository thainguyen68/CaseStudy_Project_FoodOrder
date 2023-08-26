import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import * as Yup from 'yup';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import {useFormik} from 'formik';
import axios from 'axios';
import storage from '../../config/FirebaseConfig';
import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import Swal from 'sweetalert2';

const getCategory = async () => {
    const response = await axios.get('http://localhost:8080/api/category');
    return response.data;
};

const getVoucher = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/vouchers');
        return response.data;
    } catch (error) {
        console.error('Error fetching vouchers:', error);
        return [];
    }
};

export default function FormUpdate(props) {
    const user = JSON.parse(localStorage.getItem('user'));
    const idUser = user.id;
    const [shopChose, setShopChose] = useState('');
    const [shop, setShop] = useState([]);
    const [category, setCategory] = useState([]);
    const [voucher, setVoucher] = useState([]);
    const [categoryChose, setCategoryChose] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getCategory().then((res) => {
            setCategory(res);

        });
        axios.get(`http://localhost:8080/api/shops/user/${idUser}`).then((response) => {
            setShop(response.data);
        });
        getVoucher().then((res) => {
            setVoucher(res);
        });
    }, [idUser]);

    const validation = Yup.object().shape({
        name: Yup.string().min(2, 'Độ dài không hợp lệ').max(500, 'Độ dài không hợp lệ').required('Hãy nhập dữ liệu!'),
        description: Yup.string().min(2, 'Độ dài không hợp lệ').required('Hãy nhập dữ liệu!'),
        quantity: Yup.number().min(0, 'Độ dài không hợp lệ').required('Hãy nhập dữ liệu!'),
        price: Yup.number().min(0, 'Độ dài không hợp lệ').required('Hãy nhập dữ liệu!'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            quantity: 0,
            price: 0,
            voucher: '',
        },
        validationSchema: validation,
        onSubmit: async (values) => {
            try {
                let data = {...values};
                let fileUrls = [];

                if (imageFiles.length > 0) {
                    const uploadPromises = imageFiles.map((file) => {
                        const time = new Date().getTime();
                        const nameFile = time + '-' + file.name;
                        const storageRef = ref(storage, `image/${nameFile}`);
                        const uploadTask = uploadBytesResumable(storageRef, file);

                        return new Promise((resolve, reject) => {
                            uploadTask.on(
                                'state_changed',
                                (snapshot) => {
                                },
                                (error) => {
                                    reject(error);
                                },
                                () => {
                                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                        fileUrls.push(downloadURL);
                                        if (fileUrls.length === imageFiles.length) {
                                            data.image = fileUrls;
                                            data.categories = categoryChose;
                                            data.shops = {
                                                id: shopChose,
                                            };
                                            data.voucher = {
                                                id: +values.voucher
                                            }
                                            data.id = props.food.id;

                                            axios.put(`http://localhost:8080/api/products/${data.id}`, data)
                                                .then(() => {
                                                    Swal.fire({
                                                        title: 'Bạn có muốn sửa sản phẩm?',
                                                        showDenyButton: true,
                                                        showCancelButton: false,
                                                        confirmButtonText: 'Lưu',
                                                        denyButtonText: 'Hủy',
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            axios
                                                                .post('http://localhost:8080/api/products', data)
                                                                .then(() => {
                                                                    Swal.fire({
                                                                        title: 'Đang cập nhật sản phẩm...',
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
                                                                        Swal.fire('Cập nhật thành công!', '', 'success');
                                                                        navigate('/');
                                                                    });
                                                                })
                                                                .catch((err) => {
                                                                    console.log(err.message);
                                                                });
                                                        } else if (result.isDenied) {
                                                            Swal.fire('Cập nhật thất bại', '', 'info');
                                                        }
                                                    });
                                                })
                                                .catch((err) => {
                                                    console.log(err.message);
                                                });

                                        }
                                    });
                                }
                            );
                        });
                    });

                    Promise.all(uploadPromises)
                        .then(() => {
                            // Tất cả ảnh đã được upload thành công
                        })
                        .catch((error) => {
                            console.error('Error uploading images:', error);
                        });
                } else {
                    // Logic để cập nhật sản phẩm khi không có hình ảnh mới
                    data.image = props.food.image;
                    data.voucher = {
                        id: +values.voucher
                    }
                    data.categories = categoryChose;
                    data.shops = {
                        id: shopChose,
                    };
                    data.id = props.food.id;

                    axios
                        .put(`http://localhost:8080/api/products/${data.id}`, data)
                        .then(() => {
                            Swal.fire({
                                title: 'Bạn có muốn cập nhật sản phẩm ?',
                                showDenyButton: true,
                                showCancelButton: false,
                                confirmButtonText: 'Lưu',
                                denyButtonText: 'Hủy',
                                width:`450px`,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    axios
                                        .post('http://localhost:8080/api/products', data)
                                        .then(() => {
                                            Swal.fire('Sửa thành công!', '', 'success');
                                            navigate('/');
                                        })
                                        .catch((err) => {
                                            console.log(err.message);
                                        });
                                } else if (result.isDenied) {
                                    Swal.fire('Sửa thất bại', '', 'info');
                                }
                            });
                        })
                        .catch((err) => {
                            console.log(err.message);
                        });
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        },
    });

    const handleChange = (event) => {
        setShopChose(event.target.value);
    };

    const choseCategory = (e) => {
        let id = +e.target.value;
        let newCategoryChose = [...categoryChose];
        if (newCategoryChose.some((category) => category.id === id)) {
            newCategoryChose = newCategoryChose.filter((category) => category.id !== id);
        } else {
            newCategoryChose.push({id: id});
        }
        setCategoryChose(newCategoryChose);
    };

    const choseFileUpload = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setImageFiles(selectedFiles);
        const previews = selectedFiles.map((file) => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    useEffect(() => {
        if (props.food.name) {
            console.log(props.food)
            const {name, description, quantity, price, voucher, categories, shops} = props.food;
            formik.setValues({
                name: name || '',
                description: description || '',
                quantity: quantity || 0,
                price: price || 0,
                voucher: voucher.id,
            });

            if (categories) {
                setCategoryChose(categories.map((category) => ({id: category.id})));
            } else {
                setCategoryChose([]);
            }

            if (shops) {
                setShopChose(shops.id);
            } else {
                setShopChose('');
            }
        }
    }, [props.food]);

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <div className={'row'}>
                    <div className="title-form-container">
                        <h1 className="title-form">Cập nhật món ăn</h1>
                    </div>
                    <div className={'col-md-6'}>
                        <FormControl sx={{m: 1, minWidth: 80, marginLeft: 0, display: `none`}}>
                            {/*<InputLabel id="demo-simple-select-autowidth-label">Cửa hàng</InputLabel>*/}
                            <label htmlFor={''} className={'form-label'}>Cửa hàng</label>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={shopChose}
                                onChange={handleChange}
                                className="form-control-select"
                                autoWidth
                                // label="Shop"
                            >
                                {shop.map((shop) => (
                                    <MenuItem key={shop.id} value={shop.id}>
                                        {shop.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div className="mb-3">
                            <label htmlFor={'outlined-basic'} className={'form-label'}>Tên món ăn</label>
                            <TextField
                                onChange={formik.handleChange}
                                error={formik.errors.name && formik.touched.name}
                                fullWidth
                                id="outlined-basic"
                                name="name"
                                className="form-control"
                                // label="Nhập tên sản phẩm"
                                variant="outlined"
                                value={formik.values.name}
                                helperText={formik.errors.name && formik.touched.name ? formik.errors.name : ''}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor={''} className={'form-label'}>Mô tả món ăn</label>
                            <TextField
                                onChange={formik.handleChange}
                                error={formik.errors.description && formik.touched.description}
                                fullWidth
                                id="outlined-basic"
                                className="form-control"
                                name="description"
                                // label="Nhập mô tả sản phẩm"
                                variant="outlined"
                                value={formik.values.description}
                                helperText={formik.errors.description && formik.touched.description ? formik.errors.description : ''}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor={''} className={'form-label'}>Số lượng</label>
                            <TextField
                                onChange={formik.handleChange}
                                error={formik.errors.quantity && formik.touched.quantity}
                                fullWidth
                                id="outlined-basic"
                                name="quantity"
                                className="form-control"
                                // label="Nhập số lượng sản phẩm"
                                variant="outlined"
                                value={formik.values.quantity}
                                helperText={formik.errors.quantity && formik.touched.quantity ? formik.errors.quantity : ''}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor={''} className={'form-label'}>Giá</label>
                            <TextField
                                onChange={formik.handleChange}
                                error={formik.errors.price && formik.touched.price}
                                fullWidth
                                id="outlined-basic"
                                className="form-control"
                                name="price"
                                // label="Nhập giá sản phẩm"
                                variant="outlined"
                                value={formik.values.price}
                                helperText={formik.errors.price && formik.touched.price ? formik.errors.price : ''}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor={'voucher'} className={'form-label form-label-city'}>Mã giảm giá</label>
                            <select
                                name="voucher"
                                onChange={formik.handleChange}
                                value={formik.values.voucher}
                            >
                                <option value="">Chọn mã giảm giá</option>
                                {voucher.map((item, index) => (
                                    <option key={index} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <FormLabel component="legend">
                                <span className="type-text-form">Các thể loại</span>
                            </FormLabel>
                            {/*<div className="check-box-category">*/}
                                {category.map((item) => (
                                    <FormControlLabel
                                        key={item.id}
                                        control={
                                            <Checkbox
                                                onChange={choseCategory}
                                                value={item.id}
                                                checked={categoryChose ? categoryChose.some(category => category.id === item.id) : false}
                                            />
                                        }
                                        label={item.name}
                                    />
                                ))}
                            {/*</div>*/}

                        </div>

                        <div className="mb-3">
                            <div className="shopList_image_form">
                                <span>Tải lên từ &nbsp;</span>
                                <label htmlFor="image" className="label-custom_image_form">Chọn </label>
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

