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

    // For members, we might need a separate join table or a OneToMany if we want to
    // track members closely.
    // Simplify for now, maybe just a JSON string or simplified relation if strict
    // relational mapping is too complex for this stage.
    // But let's try a strict mapping.

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
