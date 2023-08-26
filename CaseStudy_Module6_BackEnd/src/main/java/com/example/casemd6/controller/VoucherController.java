package com.example.casemd6.controller;

import com.example.casemd6.model.Voucher;
import com.example.casemd6.service.IVoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/vouchers")
public class VoucherController {
    @Autowired
    private IVoucherService iVoucherService;

    @GetMapping()
    public ResponseEntity<List<Voucher>> findAll() {
        List<Voucher> voucherList = (List<Voucher>) iVoucherService.findAll();
        if (voucherList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(voucherList, HttpStatus.ACCEPTED);
        }
    }
    @GetMapping("/product/{id}")
    public ResponseEntity <Voucher> findAllByProduct(@PathVariable Long id) {
        Voucher voucher = iVoucherService.findAllByProduct(id);
        if (voucher == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(voucher, HttpStatus.ACCEPTED);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Voucher>> findOne(@PathVariable Long id) {
        Optional<Voucher> voucherOptional = iVoucherService.findOne(id);
        if (!voucherOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(voucherOptional, HttpStatus.OK);
        }
    }

    @PostMapping
    public  ResponseEntity<Voucher> create(@RequestBody Voucher voucher) {
        return new ResponseEntity<>(iVoucherService.save(voucher), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Optional<Voucher>> update(@PathVariable Long id, @RequestBody Voucher voucher) {
        Optional<Voucher> voucherOptional = iVoucherService.findOne(id);
        if (!voucherOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            voucher.setId(id);
            iVoucherService.save(voucher);
            return new ResponseEntity<>(voucherOptional, HttpStatus.OK);
        }
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Optional<Voucher>> delete(@PathVariable Long id) {
        Optional<Voucher> voucherOptional = iVoucherService.findOne(id);
        if (!voucherOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            iVoucherService.remove(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }
}
