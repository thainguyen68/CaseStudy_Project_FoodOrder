package com.example.casemd6.service;

import com.example.casemd6.model.Bills;
import com.example.casemd6.model.Carts;
import com.example.casemd6.model.Products;
import com.example.casemd6.model.ProductsCarts;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface IProductsCartsService extends IGeneralService<ProductsCarts>{
    List<ProductsCarts> findByIdUser( Long id);
    List<ProductsCarts> findByUser( Long id);
    List<ProductsCarts> findByIdUserCart( Long id);
    ProductsCarts update(ProductsCarts productsCarts);
    List<ProductsCarts> findByIdMerchant( Long id);
    void deleteM(Long id);
    List<ProductsCarts> findByIdMerchantService( Long id);
    List<ProductsCarts> findByIdMerchantServiceAll( Long id);
    List<ProductsCarts> findByIdMerchantService( );
    ProductsCarts createS(Carts carts, Products products, int quantity, double money);
    ProductsCarts create(Carts carts, Products products, int quantity, Bills bills);
    List<ProductsCarts> findPCByUser_Shop_Id( Long id,
                                              Long id_shop);
    List<ProductsCarts> findPCByUser( Long id);
    List<ProductsCarts> findByUserShop( Long id);
    List<ProductsCarts> findBillByUserShop( Long id);
    List<ProductsCarts> findBillByShopId( Long userId,Long shopId);
    List<ProductsCarts> findBillByShopIdFilter( Long userId,Long shopId);
    List<ProductsCarts> findByUserBills( Long id);
    List<ProductsCarts> findByBillsId( Long id);
    List<ProductsCarts> findByMerchantId( Long id);
}
