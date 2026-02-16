package com.eventmanager.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "webinar_attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebinarAttendance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "webinar_id", nullable = false)
    private Webinar webinar;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime joinedAt;
    
    private LocalDateTime leftAt;
    
    private Integer durationMinutes; // Calculated duration
    
    @Column(nullable = false)
    private Boolean attended = false;
    
    private String ipAddress;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
}
