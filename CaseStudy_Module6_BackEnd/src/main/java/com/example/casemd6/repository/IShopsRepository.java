package com.example.casemd6.repository;

import com.example.casemd6.model.Shops;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@Repository
public interface IShopsRepository extends JpaRepository<Shops,Long> {
    @Query(value = "select * from shops where status_shops ='0';",nativeQuery = true)
    List<Shops> findAllStatus();
    @Query(value = "select * from shops inner join user u on shops.user_id = u.id where status_shops = '0' and user_id = ?;",nativeQuery = true)
    List<Shops> findShopByUserId(@PathVariable Long id);

    @Query(value = "select * from shops inner join user u on shops.user_id = u.id where user_id = ? and status_shops = '0';",nativeQuery = true)
    List<Shops> findAllShopByUserId(@PathVariable Long id);

    @Query(value = "select * from shops inner join user u on shops.user_id = u.id where user_id = ?;",nativeQuery = true)
    List<Shops> findAllShopByUserId123(@PathVariable Long id);
    List<Shops> findAllByUser_Id(Long id);
    @Query(value = "select * from shops where  status_shops = '0' and id = ?;",nativeQuery = true)
    Optional<Shops> findOneStatus(@PathVariable Long id);
    Shops findAllByEmailIgnoreCase(String email);

}
