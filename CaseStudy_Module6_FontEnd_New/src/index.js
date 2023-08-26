import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '../src/css/base.css';
import '../src/css/modal_login.css';
import '../src/css/header.css';
import '../src/css/home.css';
import '../src/css/footer.css';
import '../src/css/form_CreateUpdate.css';
import '../src/css/shop.css';
import '../src/css/views_food.css';
import '../src/css/confirm_email.css';
import '../src/css/toast.css';
import '../src/css/banner.css';
import '../src/css/bill.css';
import '../src/css/home_user.css';
import './css/detailbils.css';
import './css/merchantBillService.css';
import './css/views_category.css';
import './css/pcByMerchant.css';
import './css/view_admin.css';
import './css/bill_detail_modal.css';
import './css/chart.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import {store} from "./store/store";
import {Provider} from "react-redux";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
