package com.example.casemd6.controller;


import com.example.casemd6.model.Products;
import com.example.casemd6.service.IProductsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/products")
public class ProductsController {
    @Autowired
    private IProductsService productService;

    @GetMapping
    public ResponseEntity<Iterable<Products>> showProductAll() {
        return new ResponseEntity<>(productService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Products>> findOneProduct(@PathVariable Long id) {
        Products products = productService.findOne(id).get();
        products.setViews(products.getViews() + 1);
        productService.save(products);
        return new ResponseEntity<>(productService.findOne(id), HttpStatus.OK);
    }

    @GetMapping("/shop/{shopId}")
    public ResponseEntity<Iterable<Products>> findProductByShopId(@PathVariable Long shopId){
        return new ResponseEntity<>(productService.findProductsByShopId(shopId), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Products> createProducts(@RequestBody Products products) {
        productService.save(products);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Products> updateProduct(@PathVariable Long id, @RequestBody Products p) {
        Optional<Products> studentOptional = productService.findOne(id);
        if (!studentOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        p.setId(id);
        productService.save(p);
        return new ResponseEntity<>(p, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Optional<Products>> deleteProduct(@PathVariable Long id) {
        Optional<Products> student = productService.findOne(id);
        if (student.isPresent()) {
            productService.remove(id);
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/search")
    public ResponseEntity<Iterable<Products>> findProductByName(@RequestParam("search") String search) {
        List<Products> productsList = productService.findAllByName(search);
        if (productsList.isEmpty()) {
            return new ResponseEntity<>(productService.findAll(), HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(productsList, HttpStatus.OK);
        }
    }

    @GetMapping("/category/{id}")
    public ResponseEntity<List<Products>> findProductsByCategoryId(@PathVariable Long id) {
        List<Products> productsList = productService.findProductByCategory(id);
        if (productsList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(productsList, HttpStatus.OK);
        }
    }
    @GetMapping("/city/{id}")
    public ResponseEntity<Iterable<Products>> findProductsByCityId(@PathVariable Long id) {
        List<Products> productsList = productService.findProductByCity(id);
        if (productsList.isEmpty()) {
            return new ResponseEntity<>(productService.findAll(), HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(productsList, HttpStatus.OK);
        }
    }

    @GetMapping("/category/{categoryId}/city/{cityId}")
    public ResponseEntity<?>findProductsByCategoryIdAndCityId(
            @PathVariable Long cityId,
            @PathVariable Long categoryId) {
        List<Products> product = productService.findProductsByCategoryIdAndCityId(categoryId, cityId);
        if (product == null) {
            String errorMessage = "Không tìm thấy sản phẩm yêu cầu.";
            return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(product, HttpStatus.OK);
        }
    }

    @GetMapping("/sort_price_asc")
    public ResponseEntity<List<Products>>listProductsByPriceAsc(){
        List<Products> productsList = productService.sortByPriceAsc();
        List<Products> newList = new ArrayList<>();
        for (Products p:productsList
             ) {
            if(Objects.equals(p.getStatusProducts(), "0")){
                newList.add(p);
            }
        }
        if (newList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(newList,HttpStatus.OK);
        }
    }
    @GetMapping("/sort_price_desc")
    public ResponseEntity<List<Products>> listProductsByPriceDesc (){
        List<Products> productsList = productService.sortByPriceDesc();
        List<Products> listSortPriceDSC = new ArrayList<>();
        for (Products p:productsList
        ) {
            if(Objects.equals(p.getStatusProducts(), "0")){
                listSortPriceDSC.add(p);
            }
        }
        if (listSortPriceDSC.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(listSortPriceDSC,HttpStatus.OK);
        }
    }



    @GetMapping("/sort_view_desc")
        public ResponseEntity<List<Products>>listProductsByViewDesc(){
        List<Products> productsList = productService.findProductsByView();
        if(productsList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else {
            return new ResponseEntity<>(productsList,HttpStatus.OK);
        }
    }
}
