package com.example.casemd6.service.impl;

import com.example.casemd6.model.Products;
import com.example.casemd6.model.Shops;
import com.example.casemd6.repository.IProductsRepository;
import com.example.casemd6.service.IProductsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductsService implements IProductsService {
    @Autowired
    private IProductsRepository iProductsRepository;

    @Override
    public List<Products> findAll() {
        return iProductsRepository.findProductsByStatusZero();
    }

    @Override
    public Optional<Products> findOne(Long id) {
        return iProductsRepository.findById(id);
    }

    @Override
    public Products save(Products products) {
        return iProductsRepository.save(products);
    }

    @Override
    public void remove(Long id) {
        Products products = iProductsRepository.findById(id).orElse(null);
        if ( products!=null){
            products.setStatusProducts("1");
            iProductsRepository.save(products);
        }
    }

    @Override
    public List<Products> findAllByName(String name) {
        return iProductsRepository.findByName("%"+name+"%");
    }
    @Override
    public List<Products> findProductByCategory(Long productId) {
        return iProductsRepository.findProductByCategoryId(productId);
    }

    @Override
    public List<Products> findProductByCity(Long cityId) {
        return iProductsRepository.findProductsByCityId(cityId);
    }

    @Override
    public List<Products> findProductsByCategoryIdAndCityId(Long categoryId, Long cityId) {
        return iProductsRepository.findProductsByCategoriesIdAndCityId(categoryId,cityId);
    }

    @Override
    public void findAllByShopId(Long id) {
        List<Products> productsList = iProductsRepository.findAllByShops_Id(id);
        if (!productsList.isEmpty()){
            for (Products p: productsList
                 ) {
                p.setStatusProducts("1");
                save(p);
            }
        }
    }

    @Override
    public List<Products> sortByPriceAsc() {
        return iProductsRepository.findAllByOrderByPriceAsc();
    }

    @Override
    public List<Products> sortByPriceDesc() {
        return iProductsRepository.findAllByOrderByPriceDesc();
    }

    @Override
    public List<Products> sortByViewDesc() {
        return iProductsRepository.findAllByOrderByViewsDesc();
    }

    @Override
    public List<Products> findProductsByShopId(Long shopId) {
        return iProductsRepository.findProductsByShopId(shopId);
    }

    @Override
    public void removeProducts(Long id) {
        List<Products> productsList = iProductsRepository.findAllByShops_Id(id);
        if (!productsList.isEmpty()){
            for (Products p: productsList
            ) {
                p.setStatusProducts("1");
                save(p);
            }
        }
    }

    @Override
    public List<Products> findProductsByView() {
        return iProductsRepository.findProductsByView();
    }

    @Override
    public void turnOnProducts(Long id) {
        List<Products> productsList = iProductsRepository.findAllByShops_Id(id);
        if (!productsList.isEmpty()){
            for (Products p: productsList
            ) {
                p.setStatusProducts("0");
                save(p);
            }
        }
    }
}
