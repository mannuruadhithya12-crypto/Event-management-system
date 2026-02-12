package com.eventmanager.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Entity
@Table(name = "teams")
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;

    @ManyToOne
    @JoinColumn(name = "hackathon_id")
    private Hackathon hackathon;

    @OneToOne
    @JoinColumn(name = "leader_id")
    private User leader;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private java.util.List<TeamMember> members;

    private String projectName;

    @Column(columnDefinition = "TEXT")
    private String projectDescription;
    private String githubUrl;
    private String submissionStatus;
    private String joinCode;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    // Getters
}
