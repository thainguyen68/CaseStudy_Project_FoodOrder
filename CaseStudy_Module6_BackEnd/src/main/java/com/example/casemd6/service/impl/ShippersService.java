package com.example.casemd6.service.impl;

import com.example.casemd6.model.Shippers;
import com.example.casemd6.model.Shops;
import com.example.casemd6.repository.IShippersRepository;
import com.example.casemd6.repository.IShopsRepository;
import com.example.casemd6.service.IShippersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ShippersService implements IShippersService {

    @Autowired
    private IShippersRepository iShippersRepository;
    @Autowired
    private IShopsRepository iShopsRepository;

    @Override
    public List<Shippers> findAll() {
      return iShippersRepository.findAll();
    }

    @Override
    public Optional<Shippers> findOne(Long id) {
        return iShippersRepository.findById(id);
    }

    @Override
    public Shippers save(Shippers shippers) {
        return iShippersRepository.save(shippers);
    }

    @Override
    public void remove(Long id) {
        Shippers shippers = iShippersRepository.findById(id).orElse(null);
        if (shippers != null) {
            int status = Integer.parseInt(shippers.getStatusShippers());
            if (status != 0) {
                shippers.setStatusShippers("0");
            } else {
                shippers.setStatusShippers("1");
            }
            iShippersRepository.save(shippers);
        }
    }


    @Transactional
    public Set<Shippers> addShipperToShop(Long shopId, List<Long> shipperId) {
        iShippersRepository.deleteShippersByShopId(shopId);
        for (Long s : shipperId) {
            iShippersRepository.addShipperToShop(s, shopId);
        }
        Optional<Shops> shops = iShopsRepository.findById(shopId);
        if (shops.isPresent()) {
            return shops.get().getShippers();
        }
        return Collections.emptySet();
    }

    @Override
    public List<Shippers> findShipperByShopId(Long shopId) {
        return iShippersRepository.findShipperByShopId(shopId);
    }

    @Override
    public List<Shippers> findShipperByStatus() {
        return iShippersRepository.findShipperByStatusZero();
    }
}
