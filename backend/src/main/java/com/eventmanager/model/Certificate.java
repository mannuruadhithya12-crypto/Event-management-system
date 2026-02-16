package com.eventmanager.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "certificates")
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "user_id", insertable = false, updatable = false)
    private String userId; // Read-only denormalized field

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;
    
    @Column(name = "event_id", insertable = false, updatable = false)
    private String eventId; // Read-only denormalized field

    @ManyToOne
    @JoinColumn(name = "hackathon_id")
    private Hackathon hackathon;
    
    @Column(name = "hackathon_id", insertable = false, updatable = false)
    private String hackathonId; // Read-only denormalized field
    
    @ManyToOne
    @JoinColumn(name = "issuer_id")
    private User issuer; // Faculty who issued the certificate
    
    @Column(name = "issuer_id", insertable = false, updatable = false)
    private String issuerId; // Read-only denormalized field

    @Column(unique = true, nullable = false)
    private String certificateId; // Public unique ID

    private String title;
    private String category; // hackathon, event, webinar, workshop
    private String studentName; // Denormalized for PDF/Public view stability
    private String role;
    private LocalDateTime issuedAt;
    
    @Enumerated(EnumType.STRING)
    private CertificateStatus status = CertificateStatus.VERIFIED;

    @Column(columnDefinition = "TEXT")
    private String qrCodeUrl;
    @Column(columnDefinition = "TEXT")
    private String pdfUrl;
    
    @Column(unique = true)
    private String verificationCode; // Unique code for QR verification

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum CertificateStatus {
        VERIFIED, REVOKED
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public Hackathon getHackathon() { return hackathon; }
    public void setHackathon(Hackathon hackathon) { this.hackathon = hackathon; }

    public String getCertificateId() { return certificateId; }
    public void setCertificateId(String certificateId) { this.certificateId = certificateId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDateTime getIssuedAt() { return issuedAt; }
    public void setIssuedAt(LocalDateTime issuedAt) { this.issuedAt = issuedAt; }

    public CertificateStatus getStatus() { return status; }
    public void setStatus(CertificateStatus status) { this.status = status; }

    public String getQrCodeUrl() { return qrCodeUrl; }
    public void setQrCodeUrl(String qrCodeUrl) { this.qrCodeUrl = qrCodeUrl; }

    public String getPdfUrl() { return pdfUrl; }
    public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
