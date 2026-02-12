package com.eventmanager.controller;

import com.eventmanager.dto.AuthResponse;
import com.eventmanager.dto.LoginRequest;
import com.eventmanager.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    com.eventmanager.repository.UserRepository userRepository;

    @Autowired
    org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    com.eventmanager.repository.CollegeRepository collegeRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(authentication);

        com.eventmanager.model.User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
        com.eventmanager.dto.UserDto userDto = new com.eventmanager.dto.UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setRole(user.getRole());
        userDto.setAvatar(user.getAvatar());
        userDto.setJoinedAt(user.getJoinedAt());

        if (user.getCollege() != null) {
            userDto.setCollegeId(user.getCollege().getId());
            userDto.setCollegeName(user.getCollege().getName());
        }

        return ResponseEntity.ok(new AuthResponse(jwt, userDto));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody com.eventmanager.dto.RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Email is already in use!");
        }

        // Create new user's account
        com.eventmanager.model.User user = new com.eventmanager.model.User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setRole(signUpRequest.getRole());
        user.setJoinedAt(java.time.LocalDateTime.now());

        if (signUpRequest.getDepartment() != null) {
            user.setDepartment(signUpRequest.getDepartment());
        }

        if (signUpRequest.getYear() != null) {
            user.setYear(signUpRequest.getYear());
        }

        if (signUpRequest.getCollegeId() != null) {
            collegeRepository.findById(signUpRequest.getCollegeId()).ifPresent(user::setCollege);
        }

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}
