package com.example.casemd6.service;

import com.example.casemd6.model.Role;

import java.util.List;

public interface IRoleService extends IGeneralService<Role>{
    List<Role> findAllByUserId(Long id);
}
