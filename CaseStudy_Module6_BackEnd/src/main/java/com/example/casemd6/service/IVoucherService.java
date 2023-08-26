package com.example.casemd6.service;

import com.example.casemd6.model.Voucher;

import java.util.List;

public interface IVoucherService extends IGeneralService<Voucher> {
    Voucher findAllByProduct(Long id);
}
