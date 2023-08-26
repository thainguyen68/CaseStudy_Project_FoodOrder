package com.example.casemd6.model;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
public class Bills {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime dateTime;
    private String status = "2";
    @ManyToOne
    private User user;
    @ManyToOne
    private Shops shops;

}
