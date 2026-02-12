package com.eventmanager.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.Data;

@Data
@Entity
@Table(name = "certificates")
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne
    @JoinColumn(name = "hackathon_id")
    private Hackathon hackathon;

    private String type; // participation, winner
    private String position;
    private LocalDate issueDate;
    private String certificateUrl;
    private String certificateNumber;
    private Boolean verified;

    public String getId() {
        return id;
    }
    // Getters
}
