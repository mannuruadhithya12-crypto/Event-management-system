package com.eventmanager.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;
    private String bannerImage;

    @ManyToOne
    @JoinColumn(name = "college_id")
    private College college;

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private User organizer;

    private String eventType;
    private String mode;
    private String location;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime registrationDeadline;

    private Integer capacity;
    private Integer registeredCount = 0;
    private String status = "DRAFT"; // DRAFT, PENDING_APPROVAL, PUBLISHED, REGISTRATION_OPEN, REGISTRATION_CLOSED,
                                     // LIVE, COMPLETED, RESULTS_PUBLISHED, ARCHIVED
    private Boolean isPublic = true;

    @Column(columnDefinition = "TEXT")
    private String rules;

    @Column(columnDefinition = "TEXT")
    private String prizes;

    @Column(columnDefinition = "TEXT")
    private String guidelines;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
    // Getters/Setters
}
