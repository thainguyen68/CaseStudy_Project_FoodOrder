package com.example.casemd6.controller;

import com.example.casemd6.model.ImgDTO;
import com.example.casemd6.model.User;
import com.example.casemd6.service.impl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> findAll() {
        List<User> userList = userService.findAll();
        if (userList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(userList, HttpStatus.OK);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> findOneByUser(@PathVariable Long id) {
        User user = userService.findOneByStatus(id);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User user) {
        User user1 = userService.findOneByStatus(id);
        if (user1 == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            user1.setId(id);
            userService.add(user);
            return new ResponseEntity<>(user1, HttpStatus.OK);
        }
    }

    @PutMapping("/upload-img/{id}")
    public ResponseEntity<User> uploadImg(@PathVariable Long id, @RequestBody ImgDTO imgDTO) {
        User user1 = userService.findOne(id);
        if (user1 == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            user1.setId(id);
            user1.setImage(imgDTO.getImg());
            return new ResponseEntity<>(userService.uploadImg(user1), HttpStatus.OK);
        }
    }
    @PutMapping("/upload-role")
    public ResponseEntity<User> uploadRole(@RequestBody User user) {
       if (user == null){
           return new ResponseEntity<>(HttpStatus.NO_CONTENT);
       }else {

           userService.uploadRole(user);
           return new ResponseEntity<>(user,HttpStatus.OK);
       }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<User> deleteUser(@PathVariable Long id) {
        User user = userService.findOneByStatus(id);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            userService.delete(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<User> remove(@PathVariable Long id) {
        User user = userService.findOne(id);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            userService.delete(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }
}
