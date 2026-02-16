package com.eventmanager.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resource {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String fileUrl;
    
    private String fileType; // pdf, doc, video, etc.
    
    private Long fileSize; // in bytes
    
    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club club;
    
    @ManyToOne
    @JoinColumn(name = "uploader_id", nullable = false)
    private User uploader;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt;
    
    private Integer downloadCount = 0;
    
    private String category; // tutorial, documentation, template, etc.
    
    private String tags;
}
