package com.example.casemd6.service.impl;

import com.example.casemd6.model.Category;
import com.example.casemd6.repository.ICategoryRepository;
import com.example.casemd6.service.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CategoryService implements ICategoryService {
    @Autowired
    private ICategoryRepository iCategoryRepository;
    @Override
    public Iterable<Category> findAll() {
        return  iCategoryRepository.findAll();
    }

    @Override
    public Optional<Category> findOne(Long id) {
        return Optional.empty();
    }

    @Override
    public Category save(Category category) {
        return null;
    }

    @Override
    public void remove(Long id) {

    }
}
