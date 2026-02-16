package com.eventmanager.controller;

import com.eventmanager.dto.ApiResponse;
import com.eventmanager.dto.AuthResponse;
import com.eventmanager.dto.LoginRequest;
import com.eventmanager.dto.MessageResponse;
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

    @Autowired
    com.eventmanager.repository.ClubHeadAssignmentRepository clubHeadAssignmentRepository;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        com.eventmanager.model.User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String jwt = jwtUtils.generateToken(user);

        com.eventmanager.dto.UserDto userDto = new com.eventmanager.dto.UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setRole(user.getRole());
        userDto.setAvatar(user.getAvatar());
        userDto.setJoinedAt(user.getJoinedAt());
        userDto.setPoints(user.getPoints());
        userDto.setStreak(user.getStreak());

        if (user.getCollege() != null) {
            userDto.setCollegeId(user.getCollege().getId());
            userDto.setCollegeName(user.getCollege().getName());
        }

        userDto.setDirectorRole(user.getDirectorRole());
        userDto.setSubRole(user.getSubRole());
        userDto.setAcademicYear(user.getAcademicYear());
        userDto.setClubHead(!clubHeadAssignmentRepository.findByFacultyIdAndIsActiveTrue(user.getId()).isEmpty());

        return ResponseEntity.ok(ApiResponse.success(new AuthResponse(jwt, userDto)));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<MessageResponse>> registerUser(
            @RequestBody com.eventmanager.dto.RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse.error("Error: Email is already in use!"));
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

        // Expanded Registration Logic
        if (com.eventmanager.security.Roles.STUDENT.equalsIgnoreCase(signUpRequest.getRole())) {
            user.setAcademicYear(signUpRequest.getAcademicYear());
            // Also map year for compatibility if academicYear is null but year is set
            if (user.getAcademicYear() == null && signUpRequest.getYear() != null) {
                user.setAcademicYear(signUpRequest.getYear());
            }
        } else if (com.eventmanager.security.Roles.FACULTY.equalsIgnoreCase(signUpRequest.getRole())) {
            user.setSubRole(signUpRequest.getFacultySubRole());
        } else if (com.eventmanager.security.Roles.DIRECTOR.equalsIgnoreCase(signUpRequest.getRole())) {
            user.setSubRole(signUpRequest.getDirectorRole()); // Frontend sends directorRole or we check
                                                              // directorSubRole?
            // Actually frontend might send it in 'directorRole' field of payload based on
            // previous logic?
            // Let's check RegisterRequest. It has directorRole.
            // We should also look for a generic subRole if sent.
            if (user.getSubRole() == null) {
                user.setSubRole(signUpRequest.getDirectorRole());
            }
        }

        // Fallback or explicit mapping if payload uses generic subRole
        if (signUpRequest.getSubRole() != null && user.getSubRole() == null) {
            user.setSubRole(signUpRequest.getSubRole());
        }

        // Backward compatibility for DirectorRole field
        if (signUpRequest.getDirectorRole() != null) {
            user.setDirectorRole(signUpRequest.getDirectorRole());
            if (user.getSubRole() == null)
                user.setSubRole(signUpRequest.getDirectorRole());
        }

        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("User registered successfully!",
                new MessageResponse("User registered successfully!")));
    }
}
