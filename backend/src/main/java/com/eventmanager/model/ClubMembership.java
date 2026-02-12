package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "club_memberships")
public class ClubMembership {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    @Column(nullable = false)
    private String role; // LEADER, COORDINATOR, MEMBER

    private LocalDateTime joinedAt = LocalDateTime.now();
    private String status; // ACTIVE, PENDING, INACTIVE
}
