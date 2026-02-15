package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "webinars")
public class Webinar {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String speakerName;
    
    @Column(columnDefinition = "TEXT")
    private String speakerBio;
    
    private String hostCollege;
    private String mode; // Online, Offline, Hybrid
    private String meetingLink;
    
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer duration; // in minutes
    
    private Integer maxParticipants;
    private Integer registeredCount = 0;
    
    private String bannerImage;
    private String status = "UPCOMING"; // UPCOMING, ONGOING, COMPLETED, CANCELLED
    
    @Column(columnDefinition = "TEXT")
    private String agenda;
    
    private String createdBy; // User ID of creator
    private LocalDateTime createdAt = LocalDateTime.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSpeakerName() { return speakerName; }
    public void setSpeakerName(String speakerName) { this.speakerName = speakerName; }
    public String getSpeakerBio() { return speakerBio; }
    public void setSpeakerBio(String speakerBio) { this.speakerBio = speakerBio; }
    public String getHostCollege() { return hostCollege; }
    public void setHostCollege(String hostCollege) { this.hostCollege = hostCollege; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }
    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }
    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }
    public Integer getRegisteredCount() { return registeredCount; }
    public void setRegisteredCount(Integer registeredCount) { this.registeredCount = registeredCount; }
    public String getBannerImage() { return bannerImage; }
    public void setBannerImage(String bannerImage) { this.bannerImage = bannerImage; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getAgenda() { return agenda; }
    public void setAgenda(String agenda) { this.agenda = agenda; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
