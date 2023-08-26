package com.example.casemd6.repository.ConfirmationTokenRepository;

import com.example.casemd6.model.token.ConfirmationTokenShops;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfirmationTokenShopsRepository extends JpaRepository<ConfirmationTokenShops,Long> {
    ConfirmationTokenShops findByConfirmationTokenShops(String confirmationTokenShops);
}
