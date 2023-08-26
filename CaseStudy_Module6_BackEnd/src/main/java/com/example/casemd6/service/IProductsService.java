package com.example.casemd6.service;

import com.example.casemd6.model.Products;
import com.example.casemd6.model.Shops;
import com.example.casemd6.model.User;

import java.util.List;


public interface IProductsService extends IGeneralService<Products>{
    List<Products> findAllByName(String name);
    List<Products> findProductByCategory(Long productId);
    List<Products> findProductByCity(Long CityId);
    List<Products> findProductsByCategoryIdAndCityId(Long categoryId,Long cityId);
    List<Products> sortByPriceAsc();
    List<Products> sortByPriceDesc();
    List<Products> sortByViewDesc();
    void findAllByShopId(Long id);
    List<Products> findProductsByShopId(Long shopId);

    void removeProducts(Long id);
    List<Products> findProductsByView();

    void turnOnProducts(Long id);

}
