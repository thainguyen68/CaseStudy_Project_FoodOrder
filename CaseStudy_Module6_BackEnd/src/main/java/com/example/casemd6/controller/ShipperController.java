package com.example.casemd6.controller;

import com.example.casemd6.model.CreateShipper;
import com.example.casemd6.model.Products;
import com.example.casemd6.model.Shippers;
import com.example.casemd6.model.Shops;
import com.example.casemd6.repository.ICategoryRepository;
import com.example.casemd6.service.ICategoryService;
import com.example.casemd6.service.IShippersService;
import com.example.casemd6.service.IShopsService;
import com.example.casemd6.service.impl.ShippersService;
import com.example.casemd6.service.impl.ShopsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/shipper")
public class ShipperController {

    @Autowired
    private IShippersService iShippersService;

    @Autowired
    private ShippersService shippersService;


    @GetMapping
    public ResponseEntity<Iterable<Shippers>> findAll() {
        return new ResponseEntity<>(iShippersService.findAll(), HttpStatus.ACCEPTED);
    }

    @GetMapping("/by-status")
    public ResponseEntity<Iterable<Shippers>> findAllByStatus() {
        return new ResponseEntity<>(iShippersService.findShipperByStatus(), HttpStatus.ACCEPTED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Shippers>> findOneShippers(@PathVariable Long id) {
        Optional<Shippers> shippers = iShippersService.findOne(id);
        if (!shippers.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(shippers, HttpStatus.OK);
        }
    }

    @PostMapping
    public ResponseEntity<Shippers> createShippers(@RequestBody Shippers s) {
        iShippersService.save(s);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Shippers> updateShipper(@PathVariable Long id, @RequestBody Shippers s) {
        Optional<Shippers> shippersOptional = iShippersService.findOne(id);
        if (!shippersOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        s.setId(id);
        iShippersService.save(s);
        return new ResponseEntity<>(s, HttpStatus.OK);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Optional<Shippers>> deleteProduct(@PathVariable Long id) {
        Optional<Shippers> s = iShippersService.findOne(id);
        if (s.isPresent()) {
            iShippersService.remove(id);
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/add-shipper/{shopId}")
    public ResponseEntity<?> addShipperToShop(@RequestBody CreateShipper shipper, @PathVariable Long shopId) {
        Set<Shippers> options = shippersService.addShipperToShop(shopId, shipper.getShipperId());
        return new ResponseEntity<>(options, HttpStatus.CREATED);
    }

    @GetMapping("/shops/{shopId}")
    public ResponseEntity<?>findShipperByShopId(@PathVariable Long shopId){
        return new ResponseEntity<>(iShippersService.findShipperByShopId(shopId),HttpStatus.ACCEPTED);
    }
}
