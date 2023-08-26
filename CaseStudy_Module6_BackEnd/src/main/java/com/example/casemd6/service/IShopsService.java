package com.example.casemd6.service;

import com.example.casemd6.model.Shops;
import com.example.casemd6.model.User;
import java.util.List;
import java.util.Optional;

public interface IShopsService extends IGeneralService<Shops> {
    List<Shops> findShopByUserId(Long id);

    Shops findAllByEmailIgnoreCase(String email);

    List<Shops> findAllByAdmin();

    List<Shops> findAllByUser(Long id);
    List<Shops> findAllByUserBill(Long id);

    Optional<Shops> findById(Long id);

    //    Optional<Shops> updateShop(Shops shops);
    void removeShop(User user);

    void turnOnShop(User user);

}
