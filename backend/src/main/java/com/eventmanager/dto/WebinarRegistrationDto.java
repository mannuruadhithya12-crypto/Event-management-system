package com.eventmanager.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class WebinarRegistrationDto {
    private String id;
    private String webinarId;
    private String webinarTitle;
    private String speakerName;
    private LocalDateTime startDate;
    private String status;
    private String attendanceStatus;
    private Boolean certificateGenerated;
    private LocalDateTime registeredAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getWebinarId() { return webinarId; }
    public void setWebinarId(String webinarId) { this.webinarId = webinarId; }
    public String getWebinarTitle() { return webinarTitle; }
    public void setWebinarTitle(String webinarTitle) { this.webinarTitle = webinarTitle; }
    public String getSpeakerName() { return speakerName; }
    public void setSpeakerName(String speakerName) { this.speakerName = speakerName; }
    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getAttendanceStatus() { return attendanceStatus; }
    public void setAttendanceStatus(String attendanceStatus) { this.attendanceStatus = attendanceStatus; }
    public Boolean getCertificateGenerated() { return certificateGenerated; }
    public void setCertificateGenerated(Boolean certificateGenerated) { this.certificateGenerated = certificateGenerated; }
    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }
}
