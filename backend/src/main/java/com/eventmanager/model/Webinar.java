package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "webinars")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Webinar {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String speaker;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    private String meetingUrl;
    private String bannerUrl;
    private String category;

    @ManyToOne
    @JoinColumn(name = "college_id")
    private College college;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
