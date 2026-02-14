package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "webinar_feedback")
public class WebinarFeedback {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "webinar_id", nullable = false)
    private Webinar webinar;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User student;

    private Integer rating;
    
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    private LocalDateTime createdAt = LocalDateTime.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Webinar getWebinar() { return webinar; }
    public void setWebinar(Webinar webinar) { this.webinar = webinar; }
    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
