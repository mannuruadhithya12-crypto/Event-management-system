package com.eventmanager.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CertificateDto {
    private String id;
    private String certificateId;
    private String studentId;
    private String studentName;
    private String eventId;
    private String eventTitle;
    private String category;
    private String role;
    private LocalDateTime issuedAt;
    private String status;
    private String qrCodeUrl;
    private String pdfUrl;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCertificateId() { return certificateId; }
    public void setCertificateId(String certificateId) { this.certificateId = certificateId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDateTime getIssuedAt() { return issuedAt; }
    public void setIssuedAt(LocalDateTime issuedAt) { this.issuedAt = issuedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getQrCodeUrl() { return qrCodeUrl; }
    public void setQrCodeUrl(String qrCodeUrl) { this.qrCodeUrl = qrCodeUrl; }

    public String getPdfUrl() { return pdfUrl; }
    public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }
}
