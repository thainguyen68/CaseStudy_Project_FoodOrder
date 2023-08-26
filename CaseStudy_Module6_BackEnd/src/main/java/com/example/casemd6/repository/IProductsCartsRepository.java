package com.example.casemd6.repository;

import com.example.casemd6.model.ProductsCarts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Repository
public interface IProductsCartsRepository extends JpaRepository<ProductsCarts, Long> {
    @Query(value = "select * from products_carts p inner join products p2 on p.products_id = p2.id\n" +
            "    inner join carts c on p.carts_id = c.id inner join user u on  c.user_id = u.id where user_id = ? and p.status_products_carts = 2;", nativeQuery = true)
    List<ProductsCarts> findByIdUser(@PathVariable Long id);

    @Query(value = "select * from products_carts p\n" +
            "    inner join carts c on p.carts_id = c.id inner join user on  c.user_id = user.id where user_id = ?;", nativeQuery = true)
    List<ProductsCarts> findByUser(@PathVariable Long id);

    @Query(value = "select * from products_carts p inner join products p2 on p.products_id = p2.id\n" +
            "    inner join carts c on p.carts_id = c.id inner join user u on  c.user_id = u.id where user_id = ? and  (p.status_products_carts = 2 or p.status_products_carts = 5);", nativeQuery = true)
    List<ProductsCarts> findByIdUserCart(@PathVariable Long id);

    @Query(value = "select * from products_carts p inner join products p2 on p.products_id = p2.id\n" +
            "    inner join carts c on p.carts_id = c.id inner join user u on  c.user_id = u.id where user_id = ? and p.status_products_carts != 2 ", nativeQuery = true)
    List<ProductsCarts> findByIdMerchant(@PathVariable Long id);

    @Query(value = "select *\n" +
            "from products_carts p\n" +
            "         inner join products p2 on p.products_id = p2.id\n" +
            "         inner join shops s on p2.shops_id = s.id\n" +
            "         inner join user u on s.user_id = u.id\n" +
            "where user_id = ? and p.status_products_carts = 2 ; ", nativeQuery = true)
    List<ProductsCarts> findByIdMerchantService(@PathVariable Long id);

    @Query(value = "select *\n" +
            "from products_carts p\n" +
            "         inner join products p2 on p.products_id = p2.id\n" +
            "         inner join shops s on p2.shops_id = s.id\n" +
            "         inner join user u on s.user_id = u.id\n" +
            "where user_id = ? and p.status_products_carts != 2 ; ", nativeQuery = true)
    List<ProductsCarts> findByIdMerchantServiceAll(@PathVariable Long id);

    @Query(value = "select *\n" +
            "from products_carts p\n" +
            "         inner join products p2 on p.products_id = p2.id\n" +
            "         inner join shops s on p2.shops_id = s.id\n" +
            "         inner join user u on s.user_id = u.id\n" +
            "where user_id =:id and s.id = :id_shop and s.status_shops = '0'; ", nativeQuery = true)
    List<ProductsCarts> findPCByUser_Shop_Id(@Param("id") Long id,
                                             @Param("id_shop") Long id_shop);

    @Query(value = "select *\n" +
            "from products_carts pc\n" +
            "         inner join carts p2 on pc.carts_id = p2.id\n" +
            "         inner join user u on p2.user_id = u.id\n" +
            "where user_id = ?; ", nativeQuery = true)
    List<ProductsCarts> findPCByUser(@PathVariable Long id);

    //    Tìm pc theo bill_id
    @Query(value = "select * from products_carts p join bills b on b.id = p.bills_id where b.id = ?;", nativeQuery = true)
    List<ProductsCarts> findByBillsId(@PathVariable Long id);

    //    Tìm PC theo ch shop vs status = 2
    @Query(value = "select *\n" +
            "from products_carts pc\n" +
            "         inner join products p on pc.products_id = p.id\n" +
            "         inner join shops s on p.shops_id = s.id\n" +
            "         inner join user u on s.user_id = u.id\n" +
            "where user_id = ? and pc.status_products_carts = 2; ", nativeQuery = true)
    List<ProductsCarts> findByUserShop(@PathVariable Long id);


    //    Tìm PC theo ch shop vs status = 2
    @Query(value = "select *\n" +
            "from products_carts pc\n" +
            "         inner join products p on pc.products_id = p.id\n" +
            "         inner join shops s on p.shops_id = s.id\n" +
            "         inner join user u on s.user_id = u.id\n" +
            "where user_id = ? and pc.status_products_carts != 2; ",nativeQuery = true)
    List<ProductsCarts> findByMerchantId(@PathVariable Long id);


    @Query(value = "select *\n" +
            "from products_carts pc\n" +
            "         inner join products p on pc.products_id = p.id\n" +
            "         inner join shops s on p.shops_id = s.id\n" +
            "         inner join user u on s.user_id = u.id\n" +
            "where user_id = ? and pc.status_products_carts = 0; ", nativeQuery = true)
    List<ProductsCarts> findBillByUserShop(@PathVariable Long id);

    @Query(value = "select *\n" +
            "from products_carts pc\n" +
            "         inner join products p on pc.products_id = p.id\n" +
            "         inner join shops s on p.shops_id = s.id\n" +
            "         inner join user u on s.user_id = u.id\n" +
            "where user_id = ? and s.id=? and pc.status_products_carts = 0; ", nativeQuery = true)
    List<ProductsCarts> findBillByShopId(@PathVariable Long user_id ,@PathVariable Long shopId);

    // Tìm PC theo userid vs shop status !=2
    @Query(value = "select *\n" +
            "from products_carts pc\n" +
            "         inner join products p on pc.products_id = p.id\n" +
            "         inner join shops s on p.shops_id = s.id\n" +
            "         inner join user u on s.user_id = u.id\n" +
            "where user_id = ? and s.id=? and pc.status_products_carts != 2; ", nativeQuery = true)
    List<ProductsCarts> findBillByShopIdFilter(@PathVariable Long user_id ,@PathVariable Long shopId);

    @Query(value = "select * from products_carts p\n" +
            "join bills b on b.id = p.bills_id where b.user_id = ?;", nativeQuery = true)
    List<ProductsCarts> findByUserBills(@PathVariable Long id);
}
