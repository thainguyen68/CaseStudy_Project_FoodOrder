package com.example.casemd6.repository;

import com.example.casemd6.model.Products;
import com.example.casemd6.model.Shippers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IShippersRepository extends JpaRepository<Shippers, Long> {

    @Query(value = "SELECT * FROM shippers WHERE status_shippers = 0", nativeQuery = true)
    List<Shippers> findShipperByStatusZero();

    @Query(value = "select * from shippers join shops_shippers on shippers.id =  shops_shippers.shippers_id where shops_shippers.shops_id =:shopsId",nativeQuery = true)
    List<Shippers> findShipperByShopId(@Param("shopsId") Long shopsId);
    @Modifying
    @Query(value = "insert into shippers_shops(shippers_id,shops_id) values (:shippersId,:shopsId)", nativeQuery = true)
    void addShipperToShop(@Param("shippersId") Long shippersId, @Param("shopsId") Long shopsId);


    @Modifying
    @Query(value = "DELETE  FROM shippers_shops WHERE shops_id=:shopsId",nativeQuery = true)
    void deleteShippersByShopId(@Param("shopsId") Long shopsId);
}
