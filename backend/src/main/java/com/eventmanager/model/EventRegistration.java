package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "event_registrations", indexes = {
    @Index(name = "idx_eventregistration_user", columnList = "user_id"),
    @Index(name = "idx_eventregistration_event", columnList = "event_id")
})
public class EventRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDateTime registrationDate = LocalDateTime.now();

    private String status = "REGISTERED"; 

    private Boolean certificateIssued = false;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Boolean getCertificateIssued() { return certificateIssued; }
    public void setCertificateIssued(Boolean certificateIssued) { this.certificateIssued = certificateIssued; }
}
