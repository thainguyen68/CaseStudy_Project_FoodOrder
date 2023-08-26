package com.example.casemd6.service.impl;

import com.example.casemd6.model.City;
import com.example.casemd6.repository.ICityRepository;
import com.example.casemd6.service.ICityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CityService implements ICityService {
    @Autowired
    private ICityRepository iCityRepository;
    @Override
    public Iterable<City> findAll() {
        return iCityRepository.findAll();
    }

    @Override
    public Optional<City> findOne(Long id) {
        return Optional.empty();
    }

    @Override
    public City save(City city) {
        return null;
    }

    @Override
    public void remove(Long id) {

    }
}
