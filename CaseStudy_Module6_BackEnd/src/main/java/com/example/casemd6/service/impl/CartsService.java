package com.example.casemd6.service.impl;

import com.example.casemd6.model.Carts;
import com.example.casemd6.repository.ICartsRepository;
import com.example.casemd6.service.ICartsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class CartsService implements ICartsService {
    @Autowired
    private ICartsRepository iCartsRepository;
    @Override
    public Iterable<Carts> findAll() {
        return iCartsRepository.findAll() ;
    }

    @Override
    public Optional<Carts> findOne(Long id) {
        return iCartsRepository.findById(id);
    }

    @Override
    public Carts save(Carts carts) {
        List<Carts> cartsList = (List<Carts>) findAll();
        if(!cartsList.isEmpty()){
            for (Carts c:cartsList
            ) {
                if (Objects.equals(c.getUser().getId(), carts.getUser().getId())){
                    return c;
                }
            }
        }
        return iCartsRepository.save(carts);
    }

    @Override
    public void remove(Long id) {
        Carts carts = findOne(id).get();
        carts.setStatusCarts("1");
        save(carts);

    }

}
