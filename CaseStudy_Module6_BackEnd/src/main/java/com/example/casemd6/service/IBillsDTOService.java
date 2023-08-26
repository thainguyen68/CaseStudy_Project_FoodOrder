package com.example.casemd6.service;

import com.example.casemd6.model.Bills;
import com.example.casemd6.model.BillsDTO;
import com.example.casemd6.model.ProductsCarts;

import java.util.List;

public interface IBillsDTOService extends IGeneralService<BillsDTO> {
    List<BillsDTO> findAllByMerchant(List<Bills> bills, List<ProductsCarts> productsCarts);
    List<BillsDTO> findAll(Long id, List<ProductsCarts> productsCarts);
}
