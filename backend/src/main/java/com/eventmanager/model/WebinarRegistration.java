package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "webinar_registrations")
public class WebinarRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "webinar_id", nullable = false)
    private Webinar webinar;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User student;

    private String attendanceStatus = "ABSENT"; // PRESENT, ABSENT
    private Boolean certificateGenerated = false;
    private LocalDateTime registeredAt = LocalDateTime.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Webinar getWebinar() { return webinar; }
    public void setWebinar(Webinar webinar) { this.webinar = webinar; }
    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }
    public String getAttendanceStatus() { return attendanceStatus; }
    public void setAttendanceStatus(String attendanceStatus) { this.attendanceStatus = attendanceStatus; }
    public Boolean getCertificateGenerated() { return certificateGenerated; }
    public void setCertificateGenerated(Boolean certificateGenerated) { this.certificateGenerated = certificateGenerated; }
    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }
}
