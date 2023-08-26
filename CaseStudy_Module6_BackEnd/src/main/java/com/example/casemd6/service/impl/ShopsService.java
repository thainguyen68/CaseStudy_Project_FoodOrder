package com.example.casemd6.service.impl;

import com.example.casemd6.model.Products;
import com.example.casemd6.model.Shops;
import com.example.casemd6.model.User;
import com.example.casemd6.repository.IShopsRepository;
import com.example.casemd6.service.IProductsService;
import com.example.casemd6.service.IShopsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShopsService implements IShopsService {
    @Autowired
    private IShopsRepository iShopsRepository;
    @Autowired
    private IProductsService iProductsService;

    @Override
    public Iterable<Shops> findAll() {
        return iShopsRepository.findAllStatus();
    }

    @Override
    public Optional<Shops> findOne(Long id) {
        return iShopsRepository.findOneStatus(id);
    }

    @Override
    public Shops save(Shops shops) {
        return iShopsRepository.save(shops);
    }

    @Override
    public void remove(Long id) {
        Shops shops = iShopsRepository.findById(id).orElse(null);
        if (shops != null) {
            int status = Integer.parseInt(shops.getStatusShops());
            if (status != 0) {
                shops.setStatusShops("0");
                iProductsService.turnOnProducts(id);
            } else {
                shops.setStatusShops("1");
                iProductsService.removeProducts(id);
            }
            iShopsRepository.save(shops);
        }
    }

    @Override
    public List<Shops> findShopByUserId(Long id) {
        List<Shops> shopsList = iShopsRepository.findShopByUserId(id);
        if (!shopsList.isEmpty()) {
            for (Shops s : shopsList) {
                s.setStatusShops("1");
                save(s);
            }
        }
        return shopsList;
    }

    @Override
    public Shops findAllByEmailIgnoreCase(String email) {
        return iShopsRepository.findAllByEmailIgnoreCase(email);
    }

    @Override
    public List<Shops> findAllByAdmin() {
        return iShopsRepository.findAll();
    }

    @Override
    public List<Shops> findAllByUser(Long id) {
        return iShopsRepository.findAllShopByUserId123(id);
    }

    @Override
    public List<Shops> findAllByUserBill(Long id) {
        return iShopsRepository.findAllShopByUserId(id);
    }

    @Override
    public Optional<Shops> findById(Long id) {
        return iShopsRepository.findById(id);
    }

    @Override
    public void removeShop(User user) {
        List<Shops> list = iShopsRepository.findAllByUser_Id(user.getId());
        for (Shops s : list) {
            s.setStatusShops("1");
            save(s);
            List<Products> productsList = iProductsService.findProductsByShopId(s.getId());
            for (Products p : productsList
            ) {
                p.setStatusProducts("1");
                iProductsService.save(p);
            }
        }
    }

    @Override
    public void turnOnShop(User user) {
        List<Shops> list = iShopsRepository.findAllByUser_Id(user.getId());
        for (Shops s : list) {
            s.setStatusShops("0");
            save(s);
            List<Products> productsList = iProductsService.findProductsByShopId(s.getId());
            for (Products p : productsList
            ) {
                p.setStatusProducts("0");
                iProductsService.save(p);
            }
        }
    }
}
