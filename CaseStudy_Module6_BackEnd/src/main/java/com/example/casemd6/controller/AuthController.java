package com.example.casemd6.controller;

import com.example.casemd6.jwt.service.JwtResponse;
import com.example.casemd6.jwt.service.JwtService;
import com.example.casemd6.model.User;
import com.example.casemd6.model.token.ConfirmationToken;
import com.example.casemd6.repository.ConfirmationTokenRepository.ConfirmationTokenRepository;
import com.example.casemd6.service.impl.EmailService;
import com.example.casemd6.service.impl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserService userService;
    @Autowired
    private ConfirmationTokenRepository confirmationTokenRepository;
    @Autowired
    private EmailService emailService;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<?> login(@RequestBody User user) {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtService.generateTokenLogin(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User userInfo = userService.findByUsername(user.getUsername());
            if(userInfo.getStatusUser().equals("1")){
                return ResponseEntity.ok(new JwtResponse(userInfo.getId(), jwt,
                        userInfo.getUsername(), userInfo.getUsername(), userDetails.getAuthorities(),userInfo.getImage()));
            }else {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
    }
    @RequestMapping(value="/register", method = RequestMethod.POST)
    public ResponseEntity<Void> register(@RequestBody User user){
        String password = passwordEncoder.encode(user.getPassword());
        user.setPassword(password);
        User existingUser = userService.findAllByEmailIdIgnoreCase(user.getEmail());
        if(existingUser != null){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else {
            userService.add(user);
            ConfirmationToken confirmationToken = new ConfirmationToken(user);
            confirmationTokenRepository.save(confirmationToken);
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(user.getEmail());
            mailMessage.setSubject("Chúc mừng bạn đã đăng kí thành công!");
            mailMessage.setText("Để xác thực vui lòng click vào đây : "
                    +"http://localhost:8080/api/auth/confirm-account?token="+confirmationToken.getConfirmationToken());
            emailService.sendEmail(mailMessage);
            return new ResponseEntity<>(HttpStatus.OK);
        }

    }
    @RequestMapping(value="/confirm-account", method = {RequestMethod.POST,RequestMethod.GET})
    public ResponseEntity<String> confirmUser(@RequestParam("token")String confirmationToken){
        ConfirmationToken token = confirmationTokenRepository.findByConfirmationToken(confirmationToken);
        if(token !=null){
            User user = userService.findAllByEmailIdIgnoreCase(token.getUser().getEmail());
            user.setStatusUser("1");
            userService.add(user);
            return new ResponseEntity<>("Xác Thực Thành Công",HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>("Xác Thực Thất Bại",HttpStatus.NO_CONTENT);
        }
    }

}
