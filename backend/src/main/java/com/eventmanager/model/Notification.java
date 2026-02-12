package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String title;
    private String message;
    private String type; // INFO, SUCCESS, WARNING, ERROR
    private String category; // EVENT, CLUB, SYSTEM
    private Boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    // Explicitly adding getters/setters for JPA if Lombok has issues in some envs
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
