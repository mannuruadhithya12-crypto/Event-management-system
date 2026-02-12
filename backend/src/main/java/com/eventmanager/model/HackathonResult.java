package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "hackathon_results")
public class HackathonResult {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "hackathon_id", nullable = false)
    private Hackathon hackathon;

    @OneToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    private Integer rankPoint; // 1 for 1st, 2 for 2nd, etc.
    private String prize;
    private String feedback;
}
