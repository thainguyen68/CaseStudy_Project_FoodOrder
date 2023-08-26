package com.example.casemd6.controller;
import com.example.casemd6.model.*;
import com.example.casemd6.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/bills")
public class BillsController {
    @Autowired
    private IBillsService iBillsService;
    @Autowired
    private IProductsService iProductsService;
    @Autowired
    private IProductsCartsService iProductsCartsService;
    @Autowired
    private ICartsService iCartsService;
    @Autowired
    private IBillsDTOService iBillsDTOService;
    @GetMapping
    public ResponseEntity<Iterable<Bills>> findAll(){
        List<Bills> billsList = (List<Bills>) iBillsService.findAll();
        if(billsList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else {
            return new ResponseEntity<>(billsList,HttpStatus.OK);
        }

    }
    @GetMapping("/bill-dto-merchant/{id}")
    public ResponseEntity<List<BillsDTO>> findAllMerchant(@PathVariable Long id){
        List<Bills> billsList =  iBillsService.findAllByMerchant(id);
        List<ProductsCarts> productsCartsList = iProductsCartsService.findByMerchantId(id);
        List<BillsDTO>   billsDTOList = iBillsDTOService.findAllByMerchant(billsList,productsCartsList);
        if(billsDTOList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else {
            return new ResponseEntity<>(billsDTOList,HttpStatus.OK);
        }

    }



    @GetMapping("/bill-dto/{id}")
    public ResponseEntity<List<BillsDTO>> findAll(@PathVariable Long id){
        List<Bills> billsList =  iBillsService.findByShopID(id);
        List<ProductsCarts> productsCartsList = iProductsCartsService.findByUserShop(id);
        List<BillsDTO>   billsDTOList = iBillsDTOService.findAllByMerchant(billsList,productsCartsList);
        if(billsDTOList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else {
            return new ResponseEntity<>(billsDTOList,HttpStatus.OK);
        }

    }


    @GetMapping("/bill-chartjs/{id}")
    public ResponseEntity<List<BillsDTO>> findBillByUserId(@PathVariable Long id){
        List<Bills> billsList =  iBillsService.findBillByUserID(id);
        List<ProductsCarts> productsCartsList = iProductsCartsService.findBillByUserShop(id);
        List<BillsDTO>   billsDTOList = iBillsDTOService.findAllByMerchant(billsList,productsCartsList);
        if(billsDTOList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else {
            return new ResponseEntity<>(billsDTOList,HttpStatus.OK);
        }

    }

    @GetMapping("/user/{userId}/shops/{shopId}")
    public ResponseEntity<List<BillsDTO>> findBillByShopId(@PathVariable Long userId,@PathVariable Long shopId){
        List<Bills> billsList =  iBillsService.findBillByShopID(userId,shopId);
        List<ProductsCarts> productsCartsList = iProductsCartsService.findBillByShopId(userId,shopId);
        List<BillsDTO>   billsDTOList = iBillsDTOService.findAllByMerchant(billsList,productsCartsList);
        if(billsDTOList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else {
            return new ResponseEntity<>(billsDTOList,HttpStatus.OK);
        }

    }
    @GetMapping("/filter/user/{userId}/shops/{shopId}")
    public ResponseEntity<List<BillsDTO>> findBillByShopIdFilter(@PathVariable Long userId,@PathVariable Long shopId){
        List<Bills> billsList =  iBillsService.findBillByShopIDFilter(userId,shopId);
        List<ProductsCarts> productsCartsList = iProductsCartsService.findBillByShopIdFilter(userId,shopId);
        List<BillsDTO>   billsDTOList = iBillsDTOService.findAllByMerchant(billsList,productsCartsList);
        if(billsDTOList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else {
            return new ResponseEntity<>(billsDTOList,HttpStatus.OK);
        }

    }

    @GetMapping("/bill-dto-user/{id}")
    public ResponseEntity<List<BillsDTO>> findAllByUser(@PathVariable Long id){
        List<Bills> billsList =  iBillsService.findByUser(id);
        List<ProductsCarts> productsCartsList = iProductsCartsService.findByUserBills(id);
        List<BillsDTO>  billsDTOList = iBillsDTOService.findAllByMerchant(billsList,productsCartsList);
        if(billsDTOList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else {
            return new ResponseEntity<>(billsDTOList,HttpStatus.OK);
        }

    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Bills>> findOneByID(@PathVariable Long id){
        Optional<Bills> billsOptional = iBillsService.findOne(id);
        if(billsOptional.isPresent()){
            return new ResponseEntity<>(billsOptional,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @PostMapping("/{id}/{idCart}")
    public ResponseEntity<List<Bills>> receiveData(
            @RequestBody Map<String, Object>[] itemsArray,
            @PathVariable("id") Long id,
            @PathVariable("idCart") Long idCart
            ) {
        List<ProductsCarts> productsCartsList =new ArrayList<>();
//        Bills bills = iBillsService.createById(id);
        // Xử lý các dữ liệu nhận được
        for (Map<String, Object> item : itemsArray) {
            // Trích xuất thông tin từ mỗi mục (item)
            Map<String, Object> food = (Map<String, Object>) item.get("food");
            Integer itemId = 0;
            try{
                 itemId = (Integer) food.get("id");
            }catch (Exception e){
                System.out.println(e.getMessage());
            }
//            String itemName = (String) food.get("name");
            // Trích xuất các thông tin khác tương tự
            Integer quantity = 0;
            try{
                quantity = (Integer) item.get("quantity");
            }catch (Exception e){
                System.out.println(e.getMessage());
            }
            Integer money = 0;
            try{
                money = (Integer) item.get("money");
            }catch (Exception e){
                System.out.println(e.getMessage());
            }
            Carts carts = iCartsService.findOne(idCart).get();
            Products products = iProductsService.findOne(Long.valueOf(itemId)).get();
            ProductsCarts productsCarts = iProductsCartsService.createS(carts,products,quantity,money);
            productsCartsList.add(productsCarts);
            // Thực hiện xử lý với thông tin trích xuất
        }
        List<Bills> bills = iBillsService.listBills(productsCartsList,id);

        // Xử lý các thông tin còn lại như totalMoney và totalQuantity

        return new ResponseEntity<>(bills, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Optional<Bills>> update(@PathVariable Long id, @RequestBody Bills bills) {
        Optional<Bills> billsOptional = iBillsService.findOne(id);
        if (!billsOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            bills.setId(id);
            bills.setStatus("0");
            iBillsService.save(bills);
            return new ResponseEntity<>(billsOptional, HttpStatus.OK);
        }
    }
    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(@PathVariable Long id) {
        Optional<Bills> billsOptional = iBillsService.findOne(id);
        if (!billsOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            iBillsService.remove(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }
}
