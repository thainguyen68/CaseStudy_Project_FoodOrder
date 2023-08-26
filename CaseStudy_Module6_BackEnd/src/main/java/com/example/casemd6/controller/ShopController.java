package com.example.casemd6.controller;

import com.example.casemd6.model.Shops;
import com.example.casemd6.model.token.ConfirmationTokenShops;
import com.example.casemd6.repository.ConfirmationTokenRepository.ConfirmationTokenShopsRepository;
import com.example.casemd6.service.IShopsService;
import com.example.casemd6.service.impl.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/shops")
public class ShopController {
    @Autowired
    private IShopsService iShopsService;
    @Autowired
    private ConfirmationTokenShopsRepository confirmationTokenShopsRepository;
    @Autowired
    private EmailService emailService;
    @GetMapping()
    public ResponseEntity<List<Shops>> findAllByAdmin() {
        List<Shops> shopsList =  iShopsService.findAllByAdmin();
        if (shopsList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(shopsList, HttpStatus.ACCEPTED);
        }
    }

    @GetMapping("/user-list")
    public ResponseEntity<List<Shops>> findAllByUser() {
        List<Shops> shopsList = (List<Shops>) iShopsService.findAll();
        if (shopsList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(shopsList, HttpStatus.ACCEPTED);
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Shops>> findShopByUserId(@PathVariable Long id) {
        List<Shops> shopsList =  iShopsService.findAllByUser(id);
        if (shopsList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(shopsList, HttpStatus.ACCEPTED);
        }
    }
    @GetMapping("/user-bill/{id}")
    public ResponseEntity<List<Shops>> findShopByUserIdBill(@PathVariable Long id) {
        List<Shops> shopsList =  iShopsService.findAllByUserBill(id);
        if (shopsList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(shopsList, HttpStatus.ACCEPTED);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Shops>> findOne(@PathVariable Long id) {
        Optional<Shops> shopsOptional = iShopsService.findOne(id);
        if (!shopsOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(shopsOptional, HttpStatus.OK);
        }
    }

    @PostMapping
    public  ResponseEntity<Shops> create(@RequestBody Shops shops) {
        return new ResponseEntity<>(iShopsService.save(shops), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Optional<Shops>> update(@PathVariable Long id, @RequestBody Shops shops) {
        Optional<Shops> shopsOptional = iShopsService.findOne(id);
        if (!shopsOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            shops.setId(id);
            shops.setStatusShops("0");
            iShopsService.save(shops);
            return new ResponseEntity<>(shopsOptional, HttpStatus.OK);
        }
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Optional<Shops>> delete(@PathVariable Long id) {
        Optional<Shops> shopsOptional = iShopsService.findById(id);
        if (shopsOptional.isPresent()) {
            iShopsService.remove(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/create")
    public  ResponseEntity<Void> createShops(@RequestBody Shops shops) {
        Shops existingShop = iShopsService.findAllByEmailIgnoreCase(shops.getEmail());
        if(existingShop != null){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else {
            iShopsService.save(shops);
            ConfirmationTokenShops confirmationTokenShops = new ConfirmationTokenShops(shops);
            try{
                confirmationTokenShopsRepository.save(confirmationTokenShops);
            }catch (Exception e){
                System.out.println(e.getMessage());
            }
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(shops.getEmail());
            mailMessage.setSubject("Chúc mừng bạn đã đăng kí cửa hàng thành công!");
            mailMessage.setText("Để xác thực vui lòng click vào đây : "
                    +"http://localhost:8080/api/shops/confirm-shop?token="+confirmationTokenShops.getConfirmationTokenShops());
            emailService.sendEmail(mailMessage);
            return new ResponseEntity<>(HttpStatus.OK);
        }

    }
    @RequestMapping(value="/confirm-shop", method = {RequestMethod.POST,RequestMethod.GET})
    public ResponseEntity<String> confirmUser(@RequestParam("token")String confirmationToken){
        ConfirmationTokenShops token = confirmationTokenShopsRepository.findByConfirmationTokenShops(confirmationToken);
        if(token !=null){
            Shops shops = iShopsService.findAllByEmailIgnoreCase(token.getShops().getEmail());
            shops.setStatusShops("0");
            iShopsService.save(shops);
            return new ResponseEntity<>("Xác Thực Shop Thành Công",HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>("Xác Thực Shop Thất Bại",HttpStatus.NO_CONTENT);
        }
    }
}
