package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "submissions")
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "hackathon_id")
    private Hackathon hackathon;
    
    @Column(name = "hackathon_id", insertable = false, updatable = false)
    private String hackathonId; // Read-only denormalized field

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;
    
    @Column(name = "event_id", insertable = false, updatable = false)
    private String eventId; // Read-only denormalized field

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;
    
    @Column(name = "team_id", insertable = false, updatable = false)
    private String teamId; // Read-only denormalized field

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "user_id", insertable = false, updatable = false)
    private String userId; // Read-only denormalized field

    private String projectTitle;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String githubUrl;
    private String demoUrl;
    private String videoUrl;
    private String pptUrl;
    private String fileUrl;

    private Double score;
    
    // Individual scoring criteria
    private Integer innovationScore = 0;
    private Integer implementationScore = 0;
    private Integer presentationScore = 0;
    private Integer impactScore = 0;
    private Integer totalScore = 0;
    
    private String feedback;

    private LocalDateTime submittedAt = LocalDateTime.now();
    
    @Enumerated(EnumType.STRING)
    private SubmissionStatus status = SubmissionStatus.PENDING;
    
    public enum SubmissionStatus {
        PENDING, EVALUATED, REJECTED
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Hackathon getHackathon() { return hackathon; }
    public void setHackathon(Hackathon hackathon) { this.hackathon = hackathon; }
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getProjectTitle() { return projectTitle; }
    public void setProjectTitle(String projectTitle) { this.projectTitle = projectTitle; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }
    public String getDemoUrl() { return demoUrl; }
    public void setDemoUrl(String demoUrl) { this.demoUrl = demoUrl; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public String getPptUrl() { return pptUrl; }
    public void setPptUrl(String pptUrl) { this.pptUrl = pptUrl; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
