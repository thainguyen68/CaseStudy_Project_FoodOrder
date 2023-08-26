package com.example.casemd6.repository.ConfirmationTokenRepository;


import com.example.casemd6.model.token.ConfirmationToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken,Long> {
    ConfirmationToken findByConfirmationToken(String confirmationToken);

}
