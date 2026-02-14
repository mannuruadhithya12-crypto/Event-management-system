package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "hackathon_results")
public class HackathonResult {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "hackathon_id", nullable = false)
    private Hackathon hackathon;

    @OneToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    private Integer rankPoint; 
    private String prize;
    private String feedback;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Hackathon getHackathon() { return hackathon; }
    public void setHackathon(Hackathon hackathon) { this.hackathon = hackathon; }
    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }
    public Integer getRankPoint() { return rankPoint; }
    public void setRankPoint(Integer rankPoint) { this.rankPoint = rankPoint; }
    public String getPrize() { return prize; }
    public void setPrize(String prize) { this.prize = prize; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
}
