package com.example.casemd6.jwt.service;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class JwtResponse {

    private Long id;
    private String token;
    private String type = "Bearer";
    private String username;
    private String name;
    private String image;
    private final Collection<? extends GrantedAuthority> authorities;

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public JwtResponse(Long id, String token, String username, String name, Collection<? extends GrantedAuthority> authorities, String image) {
        this.id = id;
        this.token = token;
        this.username = username;
        this.name = name;
        this.image = image;
        this.authorities = authorities;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return type;
    }

    public void setTokenType(String tokenType) {
        this.type = tokenType;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
}
