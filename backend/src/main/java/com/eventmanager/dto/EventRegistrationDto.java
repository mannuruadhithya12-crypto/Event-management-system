package com.eventmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRegistrationDto {
    private String id;
    private String eventId;
    private String userId;
    private String userName;
    private String userEmail;
    private String department;
    private String college;
    private Boolean attended;
    private Boolean certificateIssued;
    private LocalDateTime registeredAt;
}
