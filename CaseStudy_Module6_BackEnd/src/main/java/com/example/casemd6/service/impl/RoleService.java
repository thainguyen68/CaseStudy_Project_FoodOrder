package com.example.casemd6.service.impl;

import com.example.casemd6.model.Role;
import com.example.casemd6.repository.IRolesRepository;
import com.example.casemd6.service.IRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService implements IRoleService {
    @Autowired
    private IRolesRepository iRolesRepository;
    @Override
    public Iterable<Role> findAll() {
        return null;
    }

    @Override
    public Optional<Role> findOne(Long id) {
        return Optional.empty();
    }

    @Override
    public Role save(Role role) {
        return null;
    }

    @Override
    public void remove(Long id) {

    }

    @Override
    public List<Role> findAllByUserId(Long id) {
        return iRolesRepository.findAllByUserId(id);
    }
}
