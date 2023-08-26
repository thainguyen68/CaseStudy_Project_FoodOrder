package com.example.casemd6.controller;

import com.example.casemd6.model.Category;
import com.example.casemd6.model.Products;
import com.example.casemd6.service.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/category")
public class CategoryController {

    @Autowired
    private ICategoryService iCategoryService;

    @GetMapping
    public ResponseEntity<Iterable<Category>> showProductAll() {
        return new ResponseEntity<>(iCategoryService.findAll(), HttpStatus.OK);
    }
}
