package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "recruitment_notices")
public class RecruitmentNotice {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club club;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String role;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    private LocalDateTime deadline;

    private String status = "OPEN"; // OPEN, CLOSED

    private LocalDateTime createdAt = LocalDateTime.now();
}
