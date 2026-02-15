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
    private Integer capacity;
    private Integer registeredCount;
    private String organizerName;
    private String collegeName;
    private String prizes;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBannerImage() { return bannerImage; }
    public void setBannerImage(String bannerImage) { this.bannerImage = bannerImage; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public String getRegistrationStatus() { return registrationStatus; }
    public void setRegistrationStatus(String registrationStatus) { this.registrationStatus = registrationStatus; }

    public Boolean getCertificateIssued() { return certificateIssued; }
    public void setCertificateIssued(Boolean certificateIssued) { this.certificateIssued = certificateIssued; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    
    public Integer getRegisteredCount() { return registeredCount; }
    public void setRegisteredCount(Integer registeredCount) { this.registeredCount = registeredCount; }

    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPrizes() { return prizes; }
    public void setPrizes(String prizes) { this.prizes = prizes; }
}
