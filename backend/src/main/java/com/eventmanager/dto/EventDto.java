package com.eventmanager.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class EventDto {
    private String id;
    private String title;
    private String description;
    private String bannerImage;
    private String mode;
    private String location;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status; // REGISTERED, ATTENDED, CANCELLED, COMPLETED
    private String registrationStatus; // REGISTERED, CANCELLED, ATTENDED
    private Boolean certificateIssued;
    private String organizerName;
    private String collegeName;
    private Integer registeredCount;
    private Integer capacity;
}
