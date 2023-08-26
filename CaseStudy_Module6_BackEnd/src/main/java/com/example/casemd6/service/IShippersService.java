package com.example.casemd6.service;

import com.example.casemd6.model.Shippers;

import java.util.List;

public interface IShippersService extends IGeneralService<Shippers>{
    List<Shippers>findShipperByShopId(Long shopId);
    List<Shippers>findShipperByStatus();
}
