package com.example.casemd6.model.token;

import com.example.casemd6.model.Shops;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;
import java.util.UUID;

@Entity
@Data
public class ConfirmationTokenShops {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String confirmationTokenShops;
    private Date createdDate;
    @OneToOne(targetEntity = Shops.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "shops_id")
    private Shops shops;
    public ConfirmationTokenShops(Shops shops) {
        this.shops = shops;
        createdDate = new Date();
        confirmationTokenShops = UUID.randomUUID().toString();
    }
    public ConfirmationTokenShops() {

    }
}
