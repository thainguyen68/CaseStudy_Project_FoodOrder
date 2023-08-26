package com.example.casemd6.config;

import com.example.casemd6.jwt.CustomAccessDeniedHandler;
import com.example.casemd6.jwt.JwtAuthenticationTokenFilter;
import com.example.casemd6.jwt.RestAuthenticationEntryPoint;
import com.example.casemd6.service.impl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private UserService userService;

    @Bean
    public JwtAuthenticationTokenFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationTokenFilter();
    }

    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    @Override
    public AuthenticationManager authenticationManager() throws Exception {
        return super.authenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Autowired
    public void configureGlobalSecurity(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService).passwordEncoder(new BCryptPasswordEncoder(10));
    }

    @Bean
    public RestAuthenticationEntryPoint restServicesEntryPoint() {
        return new RestAuthenticationEntryPoint();
    }

    @Bean
    public CustomAccessDeniedHandler customAccessDeniedHandler() {
        return new CustomAccessDeniedHandler();
    }

    protected void configure(HttpSecurity http) throws Exception {
        // Disable crsf cho đường dẫn /api/**
        http.csrf().ignoringAntMatchers("/api/**");
        http.httpBasic().authenticationEntryPoint(restServicesEntryPoint());
        http.authorizeRequests()
                .antMatchers("/api/auth/**").permitAll()
                .antMatchers("/api/shops/**/").permitAll()
                .antMatchers("/api/users/**").permitAll()
                .antMatchers("/api/products/**").permitAll()
                .antMatchers("/api/city/**").permitAll()
                .antMatchers("/api/category/**").permitAll()
                .antMatchers("/api/carts/**").permitAll()
                .antMatchers("/api/products-carts/**").permitAll()
                .antMatchers("/api/vouchers/**").permitAll()
                .antMatchers("/api/bills/**").permitAll()
                .antMatchers("/api/shipper/**").permitAll()
                .antMatchers("/api/roles/**").permitAll()
//                .antMatchers(HttpMethod.GET, "/api/homestays/**", "/api/bookings/**").permitAll()
//                .antMatchers(HttpMethod.POST, "/api/homestays/**", "/api/bookings/**").hasAnyRole("ADMIN")
//                .antMatchers(HttpMethod.DELETE, "/api/homestays/**", "/api/bookings/**").hasAnyRole("ADMIN")
//                .antMatchers(HttpMethod.PUT, "/api/homestays/**", "/api/bookings/**").hasAnyRole("ADMIN")
                .anyRequest().authenticated()
                .and().csrf().disable();
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling().accessDeniedHandler(customAccessDeniedHandler());
        http.sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.cors();
    }
}
