package com.example.casemd6.service.impl;

import com.example.casemd6.model.Bills;
import com.example.casemd6.model.Carts;
import com.example.casemd6.model.Products;
import com.example.casemd6.model.ProductsCarts;
import com.example.casemd6.repository.IProductsCartsRepository;
import com.example.casemd6.service.ICartsService;
import com.example.casemd6.service.IProductsCartsService;
import com.example.casemd6.service.IProductsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ProductsCartsService implements IProductsCartsService {
    @Autowired
    private IProductsCartsRepository iProductsCartsRepository;
    @Autowired
    private IProductsService iProductsService;
    @Autowired
    private ICartsService iCartsService;
    @Override
    public Iterable<ProductsCarts> findAll() {
        return iProductsCartsRepository.findAll();
    }
    @Override
    public Optional<ProductsCarts> findOne(Long id) {
        return iProductsCartsRepository.findById(id);
    }

    @Override
    public List<ProductsCarts> findByIdUser(Long id) {
        double totalPrice;
        List<ProductsCarts> productsCarts = iProductsCartsRepository.findByIdUser(id);
        for (ProductsCarts p :productsCarts) {
            totalPrice = p.getQuantity()*(p.getProducts().getPrice());
            p.setTotalPrice(totalPrice);
        }

        return productsCarts;
    }

    @Override
    public List<ProductsCarts> findByUser(Long id) {
        return iProductsCartsRepository.findByUser(id);
    }

    @Override
    public List<ProductsCarts> findByIdUserCart(Long id) {
        double totalPrice;
        List<ProductsCarts> productsCarts = iProductsCartsRepository.findByIdUserCart(id);
        for (ProductsCarts p :productsCarts) {
            totalPrice = p.getQuantity()*(p.getProducts().getPrice());
            p.setTotalPrice(totalPrice);
        }
        return productsCarts;
    }

    @Override
    public ProductsCarts update(ProductsCarts productsCarts) {
        return iProductsCartsRepository.save(productsCarts);
    }

    @Override
    public List<ProductsCarts> findByIdMerchant(Long id) {
        double totalPrice;
        List<ProductsCarts> productsCarts = iProductsCartsRepository.findByIdMerchant(id);
        for (ProductsCarts p :productsCarts) {
            totalPrice = p.getQuantity()*(p.getProducts().getPrice());
            p.setTotalPrice(totalPrice);
        }
        return productsCarts;
    }

    @Override
    public void deleteM(Long id) {
        ProductsCarts productsCartsOptional = findOne(id).get();
        if(productsCartsOptional !=null){
            productsCartsOptional.setStatusProductsCarts("1");
            iProductsCartsRepository.save(productsCartsOptional);
        }
    }

    @Override
    public List<ProductsCarts> findByIdMerchantService(Long id) {
        double totalPrice;
        List<ProductsCarts> productsCarts = iProductsCartsRepository.findByIdMerchantService(id);
        for (ProductsCarts p :productsCarts) {
            totalPrice = p.getQuantity()*(p.getProducts().getPrice());
            p.setTotalPrice(totalPrice);
        }
        return productsCarts;
    }

    @Override
    public List<ProductsCarts> findByIdMerchantServiceAll(Long id) {
        double totalPrice;
        List<ProductsCarts> productsCarts = iProductsCartsRepository.findByIdMerchantServiceAll(id);
        for (ProductsCarts p :productsCarts) {
            totalPrice = p.getQuantity()*(p.getProducts().getPrice());
            p.setTotalPrice(totalPrice);
        }
        return productsCarts;
    }

    @Override
    public ProductsCarts save(ProductsCarts productsCarts) {
        productsCarts.setStatusProductsCarts("2");
        Products products = iProductsService.findOne(productsCarts.getProducts().getId()).get();
        Carts carts = iCartsService.findOne(productsCarts.getCarts().getId()).get();
        Long id = carts.getUser().getId();
        List<ProductsCarts> productsCartsList = findByUser(id);
        for (ProductsCarts p:productsCartsList) {
            if(Objects.equals(products.getId(), p.getProducts().getId())
                    && p.getProducts().getPrice() == products.getPrice() && Objects.equals(p.getStatusProductsCarts(), "2")){
                p.setQuantity(p.getQuantity()+productsCarts.getQuantity());
                return iProductsCartsRepository.save(p);
            }
        }
        return iProductsCartsRepository.save(productsCarts);
    }

    @Override
    public void remove(Long id) {
        ProductsCarts productsCartsOptional = findOne(id).get();
        if(productsCartsOptional !=null){
            iProductsCartsRepository.deleteById(id);
        }

    }

    @Override
    public List<ProductsCarts> findByIdMerchantService() {
        return iProductsCartsRepository.findAll();
    }

    @Override
    public ProductsCarts createS(Carts carts, Products products, int quantity,double money) {
        ProductsCarts productsCarts =new ProductsCarts();
        productsCarts.setProducts(products);
        productsCarts.setCarts(carts);
        productsCarts.setQuantity(quantity);
        productsCarts.setTotalPrice(money);
        productsCarts.setStatusProductsCarts("2");
        return iProductsCartsRepository.save(productsCarts);
    }
    @Override
    public ProductsCarts create(Carts carts, Products products, int quantity, Bills bills) {
        ProductsCarts productsCarts =new ProductsCarts();
        productsCarts.setProducts(products);
        productsCarts.setCarts(carts);
        productsCarts.setQuantity(quantity);
        double totalPrice ;
        totalPrice = products.getPrice()*quantity;
        productsCarts.setTotalPrice(totalPrice);
//        productsCarts.setBills(bills);
        return iProductsCartsRepository.save(productsCarts);
    }

    @Override
    public List<ProductsCarts> findPCByUser_Shop_Id(Long id, Long id_shop) {
        return iProductsCartsRepository.findPCByUser_Shop_Id(id,id_shop);
    }

    @Override
    public List<ProductsCarts> findPCByUser(Long id) {
        return iProductsCartsRepository.findPCByUser(id);
    }

    @Override
    public List<ProductsCarts> findByUserShop(Long id) {
        return iProductsCartsRepository.findByUserShop(id);
    }

    @Override
    public List<ProductsCarts> findBillByUserShop(Long id) {
        return iProductsCartsRepository.findBillByUserShop(id);
    }

    @Override
    public List<ProductsCarts> findBillByShopId(Long userId, Long shopId) {
        return iProductsCartsRepository.findBillByShopId(userId,shopId);
    }

    @Override
    public List<ProductsCarts> findBillByShopIdFilter(Long userId, Long shopId) {
        return iProductsCartsRepository.findBillByShopIdFilter(userId,shopId);
    }

    @Override
    public List<ProductsCarts> findByUserBills(Long id) {
        return iProductsCartsRepository.findByUserBills(id);
    }

    @Override
    public List<ProductsCarts> findByBillsId(Long id) {
        return iProductsCartsRepository.findByBillsId(id);
    }

    @Override
    public List<ProductsCarts> findByMerchantId(Long id) {
        return iProductsCartsRepository.findByMerchantId(id);
    }
}
