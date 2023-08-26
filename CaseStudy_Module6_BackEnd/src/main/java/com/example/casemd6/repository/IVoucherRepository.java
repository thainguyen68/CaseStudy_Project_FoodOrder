package com.example.casemd6.repository;

import com.example.casemd6.model.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Repository
public interface IVoucherRepository extends JpaRepository<Voucher,Long> {
    @Query(value = "select * from voucher inner join products p on voucher.id = p.voucher_id and p.id = ?;",nativeQuery = true)
    Voucher findAllByProduct(@PathVariable Long id);
}
