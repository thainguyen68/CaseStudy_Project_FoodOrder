package com.example.casemd6.controller;

import com.example.casemd6.model.Bills;
import com.example.casemd6.model.Products;
import com.example.casemd6.model.ProductsCarts;
import com.example.casemd6.service.IBillsService;
import com.example.casemd6.service.IProductsCartsService;
import com.example.casemd6.service.IProductsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/products-carts")
public class ProductsCartsController {
    @Autowired
    private IProductsCartsService iProductsCartsService;
    @Autowired
    private IProductsService iProductsService;
    @Autowired
    private IBillsService iBillsService;

    @GetMapping()
    public ResponseEntity<List<ProductsCarts>> findAll() {
        List<ProductsCarts> productsCartsList = (List<ProductsCarts>) iProductsCartsService.findAll();
        if (productsCartsList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(productsCartsList, HttpStatus.ACCEPTED);
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<ProductsCarts>> findOne(@PathVariable Long id) {
        Optional<ProductsCarts> productsCartsOptional = iProductsCartsService.findOne(id);
        if (!productsCartsOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(productsCartsOptional, HttpStatus.OK);
        }
    }
    @PostMapping
    public  ResponseEntity<ProductsCarts> create(@RequestBody ProductsCarts productsCarts) {
        return new ResponseEntity<>(iProductsCartsService.update(productsCarts), HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ProductsCarts> update(@PathVariable Long id, @RequestBody ProductsCarts productsCarts) {
        Optional<ProductsCarts> productsCartsOptional = iProductsCartsService.findOne(id);
        if (!productsCartsOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            productsCarts.setId(id);
            productsCarts.setStatusProductsCarts("0");
            iProductsCartsService.save(productsCarts);
            return new ResponseEntity<>(productsCarts, HttpStatus.OK);
        }
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<ProductsCarts> updateStatus(@PathVariable Long id) {
        Optional<ProductsCarts> productsCartsOptional = iProductsCartsService.findOne(id);
        ProductsCarts productsCarts = productsCartsOptional.get();
        productsCarts.setStatusProductsCarts("5");
        iProductsCartsService.update(productsCarts);
        return new ResponseEntity<>(productsCarts, HttpStatus.OK);
    }
    @PutMapping("/update-confirm/{id}")
    public ResponseEntity<Bills> updateConfirm(@PathVariable Long id) {
        int total;
        int count = 0;
        Bills bills = iBillsService.findOne(id).get();
        LocalDateTime localDateTime = LocalDateTime.now();
        List<ProductsCarts> productsCartsList = iProductsCartsService.findByBillsId(id);
        for (ProductsCarts p:productsCartsList) {
            Products products = iProductsService.findOne(p.getProducts().getId()).get();
            total = products.getQuantity()-p.getQuantity();
            if(total>=0){
                count ++;
            }
        }
        if(count == productsCartsList.size()){
            bills.setStatus("0");
            bills.setDateTime(localDateTime);
            iBillsService.save(bills);
            for (ProductsCarts p:productsCartsList) {
                Products products = iProductsService.findOne(p.getProducts().getId()).get();
                products.setQuantity(products.getQuantity()-p.getQuantity());
                p.setStatusProductsCarts("0");
                iProductsService.save(products);
                iProductsCartsService.update(p);
            }
        }else {
            bills.setStatus("1");
            bills.setDateTime(localDateTime);
            iBillsService.save(bills);
            for (ProductsCarts p:productsCartsList) {
                p.setStatusProductsCarts("1");
                iProductsCartsService.update(p);
            }
        }
        return new ResponseEntity<>(bills, HttpStatus.OK);
    }
    @PutMapping("/delete-confirm/{id}")
    public ResponseEntity<Bills> deleteConfirm(@PathVariable Long id) {
        LocalDateTime localDateTime = LocalDateTime.now();
        Bills bills = iBillsService.findOne(id).get();
        bills.setDateTime(localDateTime);
        bills.setStatus("1");
        iBillsService.save(bills);
        List<ProductsCarts> productsCartsList = iProductsCartsService.findByBillsId(id);
        for (ProductsCarts p:productsCartsList
        ) {
            p.setStatusProductsCarts("1");
            iProductsCartsService.update(p);
        }
        return new ResponseEntity<>(bills, HttpStatus.OK);
    }
    @PutMapping("/merchant-update/{id}")
    public ResponseEntity<ProductsCarts> merchantUpdate(@PathVariable Long id) {
        Optional<ProductsCarts> productsCartsOptional = iProductsCartsService.findOne(id);
        ProductsCarts productsCarts = productsCartsOptional.get();
        productsCarts.setStatusProductsCarts("0");
        iProductsCartsService.update(productsCarts);
        return new ResponseEntity<>(productsCarts, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(@PathVariable Long id) {
        Optional<ProductsCarts> productsCartsOptional = iProductsCartsService.findOne(id);
        if (!productsCartsOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            iProductsCartsService.remove(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }
    @DeleteMapping("/merchant/{id}")
    ResponseEntity<Void> deleteM(@PathVariable Long id) {
        Optional<ProductsCarts> productsCartsOptional = iProductsCartsService.findOne(id);
        Bills bills = iBillsService.findByProductsCartId(productsCartsOptional.get().getId());
        bills.setStatus("1");
        iBillsService.save(bills);
        iProductsCartsService.deleteM(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @GetMapping("/user/{id}")
    public ResponseEntity<List<ProductsCarts>> findAllById(@PathVariable Long id) {
        List<ProductsCarts> productsCartsList = iProductsCartsService.findByIdUser(id);
        if (productsCartsList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(productsCartsList, HttpStatus.ACCEPTED);
        }
    }
    @GetMapping("/user-cart/{id}")
    public ResponseEntity<List<ProductsCarts>> findAllByIdUser(@PathVariable Long id) {
        List<ProductsCarts> productsCartsList = iProductsCartsService.findByIdUserCart(id);
        if (productsCartsList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(productsCartsList, HttpStatus.ACCEPTED);
        }
    }
    @GetMapping("/merchant-cart/{id}")
    public ResponseEntity<List<ProductsCarts>> findAllByIdMerchant(@PathVariable Long id) {
        List<ProductsCarts> productsCartsList = iProductsCartsService.findByIdMerchant(id);
        if (productsCartsList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(productsCartsList, HttpStatus.ACCEPTED);
        }
    }
    @GetMapping("/merchant-service/{id}")
    public ResponseEntity<List<ProductsCarts>> findByIdMerchantService(@PathVariable Long id) {
        List<ProductsCarts> productsCartsList = iProductsCartsService.findByIdMerchantService(id);
        if (productsCartsList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(productsCartsList, HttpStatus.ACCEPTED);
        }
    }
    @GetMapping("/merchant-service-all/{id}")
    public ResponseEntity<List<ProductsCarts>> findByIdMerchantServiceAll(@PathVariable Long id) {
        List<ProductsCarts> productsCartsList = iProductsCartsService.findByIdMerchantServiceAll(id);
        if (productsCartsList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(productsCartsList, HttpStatus.ACCEPTED);
        }
    }
    @GetMapping("/products-shop/{id}/{idShop}")
    public ResponseEntity<List<ProductsCarts>> findByIdMerchantServiceAll(@PathVariable Long id,
                                                                          @PathVariable Long idShop
    ) {
        List<ProductsCarts> productsCartsList = iProductsCartsService.findPCByUser_Shop_Id(id,idShop);
        if (productsCartsList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(productsCartsList, HttpStatus.ACCEPTED);
        }
    }
    @GetMapping("/products-user-id/{id}")
    public ResponseEntity<List<ProductsCarts>> findByIdUserId(@PathVariable Long id) {
        List<ProductsCarts> productsCartsList = iProductsCartsService.findPCByUser(id);
        if (productsCartsList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(productsCartsList, HttpStatus.ACCEPTED);
        }
    }
}
