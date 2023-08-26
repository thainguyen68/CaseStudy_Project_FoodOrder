package com.example.casemd6.controller;


import com.example.casemd6.model.Carts;
import com.example.casemd6.model.Shops;
import com.example.casemd6.service.ICartsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/carts")
public class CartController {
    @Autowired
    private ICartsService iCartsService;
    @GetMapping
    public ResponseEntity<Iterable<Carts>> findAll(){
        List<Carts> cartsList = (List<Carts>) iCartsService.findAll();
        if(cartsList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else {
            return new ResponseEntity<>(cartsList,HttpStatus.OK);
        }

    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Carts>> findOneByID(@PathVariable Long id){
        Optional<Carts> cartsOptional = iCartsService.findOne(id);
        if(cartsOptional.isPresent()){
            return new ResponseEntity<>(cartsOptional,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PostMapping
    public  ResponseEntity<Carts> createCart(@RequestBody Carts carts) {
        return new ResponseEntity<>(iCartsService.save(carts), HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Optional<Carts>> update(@PathVariable Long id, @RequestBody Carts carts) {
        Optional<Carts> cartsOptional = iCartsService.findOne(id);
        if (!cartsOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            carts.setId(id);
            carts.setStatusCarts("0");
            iCartsService.save(carts);
            return new ResponseEntity<>(cartsOptional, HttpStatus.OK);
        }
    }
    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(@PathVariable Long id) {
        Optional<Carts> cartsOptional = iCartsService.findOne(id);
        if (!cartsOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            iCartsService.remove(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }
}
