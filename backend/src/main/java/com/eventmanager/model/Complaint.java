package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "complaints")
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User reporter;

    private String type; // MISCONDUCT, RESULT_APPEAL, OTHER
    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    private String status; // OPEN, UNDER_REVIEW, RESOLVED, CLOSED

    @Column(columnDefinition = "TEXT")
    private String adminAction;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime resolvedAt;
}
