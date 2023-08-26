import React, { useState, useEffect } from 'react';

export default function Toast1() {
    const [isToastVisible, setIsToastVisible] = useState(false);
    const [toastCount, setToastCount] = useState(0);

    useEffect(() => {
        // Kiểm tra nếu đã hiển thị toast 3 lần, thì không hiển thị nữa
        if (toastCount >= 2) {
            setIsToastVisible(false);
            return;
        }

        // Kiểm tra trạng thái lưu trong Local Storage để xác định xem có hiển thị toast hay không
        const localStorageCount = parseInt(localStorage.getItem('toastCount')) || 0;

        // Nếu toast đã hiển thị ít hơn 3 lần trong quá trình truy cập trang này
        if (localStorageCount < 2) {
            setIsToastVisible(true);
            setToastCount(localStorageCount);
        }

        // Tăng số lần hiển thị lên 1 và lưu vào Local Storage
        const newCount = localStorageCount + 1;
        setToastCount(newCount);
        localStorage.setItem('toastCount', newCount.toString());

    }, []);

    const handleCloseToast = () => {
        setIsToastVisible(false);
    };

    if (!isToastVisible) {
        return null;
    }

    return (
        <div className={`toast1 ${isToastVisible ? 'show' : 'hide'}`}>
            <div className="toast1__main">
                <div className="toast1__main-btn" onClick={handleCloseToast}>
                    <i className="fa-regular fa-circle-xmark"></i>
                </div>
                <img
                    src="https://channel.mediacdn.vn/thumb_w/640/428462621602512896/2023/7/19/photo-1-1689751899802900845103.jpg"/>
            </div>
        </div>
    );
}

