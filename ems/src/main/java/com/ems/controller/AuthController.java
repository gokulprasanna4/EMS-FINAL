package com.ems.controller;
import com.ems.config.JwtUtils;
import com.ems.dto.AuthRequest;
import com.ems.dto.AuthResponse;
import com.ems.modal.User;
import com.ems.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ems/auth")
public class AuthController {
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserRepo userRepo;
    @Autowired private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
        User user = userRepo.findByUsername(authRequest.getUsername()).orElseThrow();
        String token = jwtUtils.generateToken(authRequest.getUsername());
        return ResponseEntity.ok(new AuthResponse(token, user));
    }
}