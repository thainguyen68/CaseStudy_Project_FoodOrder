package com.example.casemd6.repository;

import com.example.casemd6.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Repository
public interface IRolesRepository extends JpaRepository<Role,Long> {
    @Query(value = "select * from role r inner join user_roles ur on r.id = ur.roles_id\n" +
            "inner join user u on ur.user_id = u.id and u.id = ?;",nativeQuery = true)
    List<Role> findAllByUserId(@PathVariable Long id);
}
