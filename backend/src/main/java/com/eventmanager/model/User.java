package com.eventmanager.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;
    private String email;
    private String password; // Will need this for real auth
    private String avatar;
    private String role; // student, admin, college_admin

    @ManyToOne
    @JoinColumn(name = "college_id")
    private College college;

    private String department;

    @Column(name = "study_year")

    private Integer year;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String skills; // comma-separated

    private Integer points = 0;
    private Integer streak = 0;

    private LocalDateTime joinedAt = LocalDateTime.now();

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    // Getters/Setters
}
