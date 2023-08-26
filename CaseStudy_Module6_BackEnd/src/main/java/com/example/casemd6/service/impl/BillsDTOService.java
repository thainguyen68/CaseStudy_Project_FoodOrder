package com.example.casemd6.service.impl;

import com.example.casemd6.model.Bills;
import com.example.casemd6.model.BillsDTO;
import com.example.casemd6.model.ProductsCarts;
import com.example.casemd6.service.IBillsDTOService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class BillsDTOService implements IBillsDTOService {
    @Override
    public Iterable<BillsDTO> findAll() {
        return null;
    }

    @Override
    public Optional<BillsDTO> findOne(Long id) {
        return Optional.empty();
    }

    @Override
    public BillsDTO save(BillsDTO billsDTO) {
        return null;
    }

    @Override
    public void remove(Long id) {
    }

    @Override
    public List<BillsDTO> findAllByMerchant(List<Bills> bills, List<ProductsCarts> productsCarts) {
        List<BillsDTO> billsDTOList = new ArrayList<>();
        for (Bills bill : bills) {
            if (!isBills(billsDTOList, bill)) {
                BillsDTO billsDTO = new BillsDTO();
                billsDTO.setId(bill.getId());
                billsDTO.setUsername(bill.getUser().getUsername());
                List<ProductsCarts> productsCartsList = new ArrayList<>();
                for (ProductsCarts productsCart : productsCarts) {
                    if (Objects.equals(productsCart.getBills().getId(), billsDTO.getId())) {
                        billsDTO.setShops(productsCart.getProducts().getShops());
                        productsCartsList.add(productsCart);
                    }
                }
                billsDTO.setProductsCartsList(productsCartsList);
                double total = total(productsCartsList);
                billsDTO.setTotal(total);
                if (checkStatus(productsCartsList)) {
                    LocalDateTime localDateTime = maxLocal(productsCartsList);
                    billsDTO.setStatus("0");
                    billsDTO.setLocalDateTime(localDateTime);
                } else if (isCheckNot(productsCartsList)) {
                    LocalDateTime localDateTime = LocalDateTime.now();
                    billsDTO.setStatus("1");
                    billsDTO.setLocalDateTime(localDateTime);
                }else {
                    LocalDateTime localDateTime = LocalDateTime.now();
                    billsDTO.setStatus("2");
                    billsDTO.setLocalDateTime(localDateTime);
                }
                billsDTOList.add(billsDTO);
            }
        }

        return billsDTOList;
    }

    @Override
    public List<BillsDTO> findAll(Long id, List<ProductsCarts> productsCarts) {
        return null;
    }

    public double total(List<ProductsCarts> productsCarts) {
        double total = 0;
        for (ProductsCarts p : productsCarts) {
            total +=   p.getTotalPrice();
        }
        return total;
    }

    public boolean checkStatus(List<ProductsCarts> productsCarts) {
        for (ProductsCarts p : productsCarts) {
            if (Objects.equals(p.getStatusProductsCarts(), "0")) {
                return true;
            }
        }return false;
    }

    public boolean isCheckNot(List<ProductsCarts> productsCarts) {
        for (ProductsCarts p : productsCarts) {
            if (Objects.equals(p.getStatusProductsCarts(), "1")) {
                return true;
            }
        }
        return false;
    }

    public boolean isBills(List<BillsDTO> bills, Bills bills1) {
        for (BillsDTO b : bills) {
            if (Objects.equals(b.getId(), bills1.getId())) {
                return true;
            }
        }
        return false;
    }

    public LocalDateTime maxLocal(List<ProductsCarts> productsCarts) {
        if (!productsCarts.isEmpty()) {
            LocalDateTime localDateTime = productsCarts.get(0).getBills().getDateTime();
            for (int i = 1; i < productsCarts.size(); i++) {
                if (productsCarts.get(i).getBills().getDateTime().isAfter(localDateTime)) {
                    localDateTime = productsCarts.get(i).getBills().getDateTime();
                }
            }
            return localDateTime;
        } else {
            return null;
        }

    }

    public LocalDateTime minLocal(List<ProductsCarts> productsCarts) {
        if (!productsCarts.isEmpty()) {
            for (ProductsCarts p : productsCarts) {
                if (Objects.equals(p.getStatusProductsCarts(), "1")) {
                    LocalDateTime localDateTime = p.getBills().getDateTime();
                    return localDateTime;
                }
            }
        }
        return null;
    }
}