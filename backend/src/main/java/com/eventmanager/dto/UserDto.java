package com.eventmanager.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDto {
    private String id;
    private String name;
    private String email;
    private String role;
    private String avatar;
    private String collegeId;
    private String collegeName;
    private LocalDateTime joinedAt;
}
