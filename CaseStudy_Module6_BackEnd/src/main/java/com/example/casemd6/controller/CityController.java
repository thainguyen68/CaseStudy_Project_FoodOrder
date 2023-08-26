package com.example.casemd6.controller;

import com.example.casemd6.model.City;
import com.example.casemd6.service.ICityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/city")
public class CityController {
    @Autowired
    private ICityService iCityService;
    @GetMapping
    public ResponseEntity<List<City>> findAll(){
        List<City> cityList = (List<City>) iCityService.findAll();
        if (cityList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else {
            return new ResponseEntity<>(cityList,HttpStatus.ACCEPTED);
        }

    }
}
