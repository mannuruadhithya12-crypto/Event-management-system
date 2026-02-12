package com.eventmanager.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Entity
@Table(name = "leaderboard_entries")
public class LeaderboardEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private Integer score;
    private Integer rank;
    private LocalDateTime lastUpdated;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "hackathon_id")
    private Hackathon hackathon;
}
