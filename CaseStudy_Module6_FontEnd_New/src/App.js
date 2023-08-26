import './App.css';
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import {Route, Routes} from "react-router-dom";
import List from "./food/view/List";
import View from "./food/view/View";
import Create from "./food/form/Create";
import Update from "./food/form/Update";
import ListShop from "./shop/ListShop";
import CreateShop from "./shop/CreateShop";
import UpdateShop from "./shop/UpdateShop";
import ListVoucher from "./voucher/ListVoucher";
import CreateVoucher from "./voucher/CreateVoucher";
import UpdateVoucher from "./voucher/UpdateVoucher";
import Cart from "./cart/Cart";

import QuickSearch from "./food/view/QuickSearch";
import ProductsCarts from "./cart/ProductsCarts";
import Confirm from "./confirm/Confirm";
import PCByMerchant from "./cart/PCByMerchant";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {setCart} from "./features/cart/cartSlice";
import {setCartMerchant} from "./features/cart/cartMC";
import MerchantBillService from "./cart/MerchantBillService";
import FindShopById from "./cart/FindShopById";
import Oder from "./cart/Oder";
import UpdateShipper from "./shipper/UpdateShipper";
import ShipperManager from "./shipper/ShipManager";
import Chartjs from "./chartis/Chartjs";
import UserProfile from "./user/userManager/UserProfile";
import ShopSManager from "./admin/ShopSManager";
import UserManager from "./admin/UserManager";


function App() {
    const cart = useSelector(state => state.cart);
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setCart())
        dispatch(setCartMerchant())
    }, [])
    return (
        <>
            <Header/>
            <div className={`container-content`}>
                <Routes>
                    <Route path={'/'} element={<List />}></Route>
                    <Route path={'/:id'} element={<List />}></Route>
                    <Route path={'/view-food/:id'} element={<View/>}></Route>
                    <Route path={'/create-food/:id'} element={<Create/>}></Route>
                    <Route path={'/update-food/:id'} element={<Update/>}></Route>

                    <Route path={'/shop'} element={<ListShop />}></Route>
                    <Route path={'/create-shop'} element={<CreateShop />}></Route>
                    <Route path={'/update-shop/:id'} element={<UpdateShop />}></Route>

                    <Route path={'/carts'} element={<Cart />}></Route>

                    <Route path={'/voucher'} element={<ListVoucher />}></Route>
                    <Route path={'/create-voucher'} element={<CreateVoucher />}></Route>
                    <Route path={'/update-voucher/:id'} element={<UpdateVoucher />}></Route>
                    {/*<Route path={'/category/:id'} element={<QuickSearch/>}></Route>*/}
                    <Route path={'/shipper-update/:id'} element={<UpdateShipper/>}></Route>

                    <Route path={'/products-carts'} element={<ProductsCarts/>}></Route>
                    <Route path={'/products-carts-merchant'} element={<PCByMerchant/>}></Route>
                    <Route path={'/products-carts-merchant-all'} element={<MerchantBillService/>}></Route>
                    <Route path={'/products-carts-shop/:idShop'} element={<FindShopById/>}></Route>
                    <Route path={'/products-carts-oder'} element={<Oder/>}></Route>
                    <Route path={'/shipper-manager'} element={<ShipperManager/>}></Route>
                    <Route path={'/confirm'} element={<Confirm/>}></Route>


                    <Route path={'/userProfile'} element={<UserProfile/>}></Route>
                    <Route path={'/bill-chartjs'} element={<Chartjs/>}></Route>
                    <Route path={'/shop-manager'} element={<ShopSManager/>}></Route>
                    <Route path={'/user-manager'} element={<UserManager/>}></Route>
                </Routes>
            </div>
            <Footer/>
        </>
    );
}

export default App;
