package com.eventmanager.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreateWebinarRequest {
    private String title;
    private String description;
    private String speakerName;
    private String speakerBio;
    private String hostCollege;
    private String mode;
    private String meetingLink;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer duration;
    private Integer maxParticipants;
    private String bannerImage;

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
    public String getBannerImage() { return bannerImage; }
    public void setBannerImage(String bannerImage) { this.bannerImage = bannerImage; }
}
