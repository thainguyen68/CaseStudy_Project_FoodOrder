package com.example.casemd6.controller;

import com.example.casemd6.service.IBillsDTOService;
import com.example.casemd6.service.IBillsService;
import com.example.casemd6.service.IProductsCartsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/bill-dto")
public class BillDTOController {
    @Autowired
    private IBillsService iBillsService;
    @Autowired
    private IProductsCartsService iProductsCartsService;
    @Autowired
    private IBillsDTOService iBillsDTOService;

}
