
import {Button, Modal} from "react-bootstrap";
import {useEffect, useRef} from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";



export default function BillsDetail({bill,showBills,handleClose}) {

    useEffect(() => {

    }, [])

    function setDay(localDateTime) {
        const date = localDateTime.split("T")[0];
        return date;

    }
    function setAllTotal(total) {
        let allTotal = 0;
        for (let i = 0; i < total.length; i++) {
            allTotal += total[i].quantity * total[i].products.price
        }
        return allTotal;

    }

    function setTime(localDateTime) {
        const time = localDateTime.split("T")[1];
        const timeAll = time.split(".")[0];
        return timeAll;
    }
    function setVoucher(data) {
        let voucher = 0;
        for (let i = 0; i < data.length; i++) {
            voucher += data[i].products.price*data[i].quantity*(data[i].products.voucher.percent)/100
        }
        return voucher;
    }
    const contentRef = useRef(null);

    const convertToPdf = () => {
        const input = contentRef.current;

        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('shops.pdf');
            });
    };


    return (<>
        <Modal
            show={showBills}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
            <Modal.Header>
                <Modal.Title>Chi tiết đơn hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <>
                    <div ref={contentRef}>
                        <div className="bill_detail_container">
                            <div className="bill_detail_inner">
                                 <span className="bill_detail_inner-item-header">
                                     {bill.shops.name}
                                </span>
                                <span className="bill_detail_inner-item">
                                    Địa chỉ:&nbsp; {bill.shops.description}
                                </span>
                                <span className="bill_detail_inner-item-p">
                                    HOÁ ĐƠN CHI TIẾT
                                </span>
                                <span className="bill_detail_inner-item">
                                    Số : &nbsp; ###{bill.id}
                                </span>
                            </div>
                            <div className="bill_detail_inner-bill">
                                <span className="bill_detail_inner-item">
                                    Ngày đặt hàng:
                                    &nbsp; {setDay(bill.localDateTime)}
                                    &nbsp; {setTime(bill.localDateTime)}
                                </span>
                                <span className="bill_detail_inner-item">
                                    Người nhận:&nbsp; {bill.username}
                                </span>
                                <span className="bill_detail_inner-item">
                                    Trạng thái đơn: &nbsp; {bill.status === "1" ?( <span className="table_shop_list-inner" style={{color: `red`}}>Huỷ thanh
                                    toán
                                </span>):(
                                    <span className="table_shop_list-inner" style={{color: `green`}}>Đã thanh
                                    toán
                                </span>)

                                }
                                </span>
                            </div>
                            <hr/>
                            <div className="bill_detail_inner-products">
                                <div className="bill_detail_inner-containerFood">
                                    <span className="bill_detail_inner-item-p">#</span>
                                    <span className="bill_detail_inner-item-p">Tên SP</span>
                                    <span className="bill_detail_inner-item-p">Số lượng</span>
                                    <span className="bill_detail_inner-item-p">Đơn giá</span>
                                    <span className="bill_detail_inner-item-p">Tổng tiền</span>
                                </div>
                                <hr/>
                                <div className="bill_detail_inner-containerFood-show">
                                    {bill.productsCartsList.length > 0 && bill.productsCartsList.map((item, index) => (<>
                                        <div className="bill_detail_inner-containerFood-showProducts" >
                                        <span className="bill_detail_inner-item">
                                        {index +1}
                                    </span>
                                            <span className="bill_detail_inner-item">
                                        {item.products?.name}<br/>
                                                ( {item.products.voucher.name})
                                    </span>
                                            <span className="bill_detail_inner-item">
                                       {item.quantity}
                                    </span>
                                            <span className="bill_detail_inner-item"
                                                  style={{marginLeft: `5px`}}>
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND'
                                                            }).format(item.products.price)}
                                                         </span>
                                            <span className="bill_detail_inner-item"
                                                  style={{marginLeft: `5px`}}>
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND'
                                                            }).format(item.quantity * item.products.price * (100-item.products.voucher.percent)/100)}
                                                         </span>
                                        </div>

                                    </>))}

                                </div>
                                <hr/>
                                <div className="bill_detail_inner-containerFood-total">
                                    <div className="bill_detail_inner-containerFood-total-inner">
                                         <span className="bill_detail_inner-item-p">
                                        Tiền hàng:
                                    </span>
                                        <span className="bill_detail_inner-item-p"
                                              style={{marginLeft: `5px`}}>
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND'
                                                            }).format(setAllTotal(bill.productsCartsList))}
                                                         </span>
                                    </div>

                                    <div className="bill_detail_inner-containerFood-total-inner">
                                     <span className="bill_detail_inner-item-p">
                                       Khuyến mại:
                                    </span>
                                        <span className="bill_detail_inner-item-p"
                                              style={{marginLeft: `5px`}}>
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND'
                                                            }).format(setVoucher(bill.productsCartsList))}
                                                         </span>
                                    </div>

                                    <div className="bill_detail_inner-containerFood-total-inner">
                                       <span className="bill_detail_inner-item-p">
                                        Tổng tiền :
                                    </span>
                                        <span className="bill_detail_inner-item-p"
                                              style={{marginLeft: `5px`}}>
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND'
                                                            }).format(bill.total)}
                                                         </span>
                                    </div>


                                </div>
                                <hr/>
                                <div className="bill_detail_inner-containerFood-p">
                                    <span className="bill_detail_inner-item-p">
                                        Trân trọng cảm ơn và Hẹn gặp lại quý khách !
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                </>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    <i className="fa-solid fa-rotate-left"></i>  &nbsp;
                    Trở lại
                </Button>
                <Button variant="primary" onClick={convertToPdf}>
                    <i className="fa-solid fa-print"></i> &nbsp;
                    In hoá đơn
                </Button>
            </Modal.Footer>
        </Modal>
    </>)
}