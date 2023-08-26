package com.example.casemd6.service;

import com.example.casemd6.model.User;

public interface IUserService extends IGeneralService<User>{
     boolean checkStatus(User user);
}
