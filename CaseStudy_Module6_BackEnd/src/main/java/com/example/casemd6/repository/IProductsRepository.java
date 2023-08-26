package com.example.casemd6.repository;

import com.example.casemd6.model.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Repository

public interface IProductsRepository extends JpaRepository<Products, Long> {

    @Query(value = "select * from Products where Products .name like :name", nativeQuery = true)
    List<Products> findByName(@Param("name") String name);

    @Query(value = "SELECT * FROM products WHERE status_products = 0 ORDER BY id DESC", nativeQuery = true)
    List<Products> findProductsByStatusZero();

    @Query(value = "SELECT *FROM products p JOIN products_categories pc ON p.id = pc.products_id WHERE pc.categories_id =:categoryId and p.status_products = 0", nativeQuery = true)
    List<Products> findProductByCategoryId(@Param("categoryId") Long categoryId);

    //    @Query(value = "select * from products inner join voucher_shops vs on products.shops_id = vs.shops_id and voucher_id where status_products = 0;", nativeQuery = true)
//    List<Products> findProductsByStatusZero();
    @Query(value = "SELECT p.* FROM products p JOIN shops s ON p.shops_id = s.id JOIN city c ON s.city_id = c.id WHERE c.id = :cityId", nativeQuery = true)
    List<Products> findProductsByCityId(Long cityId);

    @Query(value = "SELECT p.* FROM products p JOIN shops s ON p.shops_id = s.id JOIN city c ON s.city_id = c.id join  products_categories pc ON p.id = pc.products_id WHERE c.id = :cityId AND pc.categories_id =:categoryId ", nativeQuery = true)
    List<Products> findProductsByCategoriesIdAndCityId(@Param("categoryId") Long categoryId,
                                                       @Param("cityId") Long cityId);
    List<Products> findAllByShops_Id(Long id);
    List<Products> findAllByOrderByPriceAsc();

    List<Products> findAllByOrderByPriceDesc();

    List<Products> findAllByOrderByViewsDesc();

    @Query(value = "SELECT * FROM products WHERE status_products = 0 ORDER BY views DESC", nativeQuery = true)
    List<Products> findProductsByView();

    @Query(value = "select * from products where shops_id =:shopId", nativeQuery = true)
    List<Products> findProductsByShopId(@Param("shopId") Long shopId);
}
