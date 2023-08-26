package com.example.casemd6.model;

import lombok.Data;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Entity
@Data
public class Products {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private int quantity ;
    private double price;
    @ElementCollection
    private List<String> image;
    private int views;
    private String statusProducts = "0";
    @ManyToOne
    private Shops shops;
    @ManyToOne
    private Voucher voucher ;
    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Category> categories;
}
