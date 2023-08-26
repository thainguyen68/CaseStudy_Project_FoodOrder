package com.example.casemd6.repository;

import com.example.casemd6.model.Carts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICartsRepository extends JpaRepository<Carts,Long> {
}
