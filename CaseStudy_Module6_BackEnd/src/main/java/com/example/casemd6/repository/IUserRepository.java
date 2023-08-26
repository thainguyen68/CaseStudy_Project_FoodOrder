package com.example.casemd6.repository;

import com.example.casemd6.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

@Repository
public interface IUserRepository extends JpaRepository<User,Long> {
    User findAllByUsername(String username);
    User findAllByEmailIgnoreCase(String email);
    @Query(value = "select * from user where id = ? and status_user = 1;", nativeQuery = true)
    User findOneUserId(@PathVariable Long id);

}
