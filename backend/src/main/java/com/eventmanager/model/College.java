package com.eventmanager.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Entity
@Table(name = "colleges")
public class College {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;
    private String shortName;
    private String logo;
    private String location;
    private String website;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer foundedYear;
    private Integer studentCount;
    private Integer facultyCount;
    private Boolean isActive;
    private LocalDateTime createdAt;

    // Stats embedded or transient? For now simplify.

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
    // Add other getters/setters as needed
}
