import {useEffect} from "react";
import axios from "axios";

export default function Confirm() {
    return(
        <>
            <div className="confirmBody">
                <div className="containerConfirm">
                    <h1>Confirmation success</h1>
                    <p className="messageConfirm">Congratulations, you have successfully authenticated !</p>
                    <div className="containerConfirm-img">
                        <img src="https://sbmblog.typepad.com/.a/6a0120a7ae33fa970b01b8d22c14fd970c-pi" alt="lỗi ảnh" />
                    </div>
                </div>
            </div>
        </>
    )
}