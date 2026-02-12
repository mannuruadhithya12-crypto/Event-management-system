package com.eventmanager.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role;
    private String collegeId;
    private String department;
    private Integer year;
}
