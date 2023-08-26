package com.example.casemd6.service.impl;

import com.example.casemd6.model.Role;
import com.example.casemd6.model.User;
import com.example.casemd6.model.UserPrinciple;
import com.example.casemd6.repository.IShopsRepository;
import com.example.casemd6.repository.IUserRepository;
import com.example.casemd6.service.IShopsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Objects;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private IUserRepository iUserRepository;
    @Autowired
    private IShopsService iShopsService;

    public User findByUsername(String username) {
        return iUserRepository.findAllByUsername(username);
    }

    public boolean add(User user) {
        iUserRepository.save(user);
        return true;
    }

    public User findOneByStatus(Long id) {
        return iUserRepository.findOneUserId(id);
    }

    public void delete(Long id) {
        User user = iUserRepository.findById(id).orElse(null);
        if (user != null) {
            int status = Integer.parseInt(user.getStatusUser());
            if (status != 1) {
                user.setStatusUser("1");
                iShopsService.turnOnShop(user);
            } else {
                user.setStatusUser("0");
                iShopsService.removeShop(user);

            }
            iUserRepository.save(user);
        }

    }

    public UserDetails loadUserByUsername(String username) {
        List<User> users = iUserRepository.findAll();
        for (User user : users) {
            if (Objects.equals(user.getUsername(), username)) {
                return UserPrinciple.build(user);
            }
        }
        return null;
    }
    public User uploadRole(User user){
        return iUserRepository.save(user);
    }
    public User findAllByEmailIdIgnoreCase(String email) {
        return iUserRepository.findAllByEmailIgnoreCase(email);
    }

    public List<User> findAll() {
        return iUserRepository.findAll();
    }

    public User findOne(Long id) {
        return iUserRepository.findById(id).get();
    }

    public User uploadImg(User user) {
        return iUserRepository.save(user);
    }
}
