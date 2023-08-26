package com.example.casemd6.model;

import lombok.Data;

import javax.persistence.*;
import java.sql.Time;
import java.util.Set;

@Entity
@Data
public class Shops {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String phone;
    private String description;
    private String email;
    private Time startTime;
    private Time endTime;
    private String statusShops = "2";
    @ManyToOne
    private User user;
    @ManyToOne
    private City city;
    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Shippers> shippers;
}
