package com.example.casemd6.controller;

import com.example.casemd6.model.Role;
import com.example.casemd6.service.IRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/roles")
public class RoleController {
    @Autowired
    private IRoleService iRoleService;

    @GetMapping("/{id}")
    public ResponseEntity<List<Role>> findAllByUser(@PathVariable Long id){
        List<Role> roleList = iRoleService.findAllByUserId(id);
        if (roleList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else {
            return new ResponseEntity<>(roleList,HttpStatus.ACCEPTED);
        }
    }
}
