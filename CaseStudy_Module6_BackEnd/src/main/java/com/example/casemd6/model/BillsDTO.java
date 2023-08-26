package com.example.casemd6.model;

import javax.persistence.ManyToOne;
import java.time.LocalDateTime;
import java.util.List;

public class BillsDTO {
    private Long id;
    private String username;
    private LocalDateTime localDateTime;
    private List<ProductsCarts> productsCartsList;
    private String status;
    private double total;
    private Shops shops;

    public BillsDTO(Long id, String username, LocalDateTime localDateTime, List<ProductsCarts> productsCartsList, String status, double total,Shops shops) {
        this.id = id;
        this.username = username;
        this.localDateTime = localDateTime;
        this.productsCartsList = productsCartsList;
        this.status = status;
        this.total = total;
        this.shops = shops;
    }

    public Shops getShops() {
        return shops;
    }

    public void setShops(Shops shops) {
        this.shops = shops;
    }

    public BillsDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocalDateTime getLocalDateTime() {
        return localDateTime;
    }

    public void setLocalDateTime(LocalDateTime localDateTime) {
        this.localDateTime = localDateTime;
    }

    public List<ProductsCarts> getProductsCartsList() {
        return productsCartsList;
    }

    public void setProductsCartsList(List<ProductsCarts> productsCartsList) {
        this.productsCartsList = productsCartsList;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}
