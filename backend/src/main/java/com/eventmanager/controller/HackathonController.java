package com.eventmanager.controller;

import com.eventmanager.model.Hackathon;
import com.eventmanager.model.ProblemStatement;
import com.eventmanager.model.Team;
import com.eventmanager.model.TeamMember;
import com.eventmanager.service.HackathonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hackathons")
public class HackathonController {
    private final HackathonService hackathonService;

    public HackathonController(HackathonService hackathonService) {
        this.hackathonService = hackathonService;
    }

    @GetMapping
    public List<Hackathon> getAllHackathons() {
        return hackathonService.getAllHackathons();
    }

    @PostMapping
    public Hackathon createHackathon(@RequestBody Hackathon hackathon) {
        return hackathonService.createHackathon(hackathon);
    }

    @GetMapping("/student/{userId}")
    public List<Hackathon> getHackathonsByStudent(@PathVariable String userId) {
        return hackathonService.getHackathonsByStudent(userId);
    }

    @GetMapping("/organizer/{organizerId}")
    public List<Hackathon> getHackathonsByOrganizer(@PathVariable String organizerId) {
        return hackathonService.getHackathonsByOrganizer(organizerId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hackathon> getHackathonById(@PathVariable String id) {
        return hackathonService.getHackathonById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/problem-statements")
    public List<ProblemStatement> getProblemStatements(@PathVariable String id) {
        return hackathonService.getProblemStatements(id);
    }

    @PostMapping("/{id}/problem-statements")
    public ProblemStatement addProblemStatement(@PathVariable String id,
            @RequestBody ProblemStatement problemStatement) {
        return hackathonService.addProblemStatement(id, problemStatement);
    }

    @PostMapping("/{id}/teams")
    public Team createTeam(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return hackathonService.createTeam(id, payload.get("name"), payload.get("leaderId"));
    }

    @PostMapping("/{id}/teams/join")
    public Team joinTeam(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return hackathonService.joinTeam(id, payload.get("userId"), payload.get("joinCode"));
    }

    @GetMapping("/{id}/my-team")
    public ResponseEntity<Team> getMyTeam(@PathVariable String id, @RequestParam String userId) {
        return hackathonService.getTeamByUser(id, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/teams/student/{userId}")
    public List<Team> getTeamsByStudent(@PathVariable String userId) {
        return hackathonService.getTeamsByStudent(userId);
    }

    @GetMapping("/teams/{teamId}/members")
    public List<TeamMember> getTeamMembers(@PathVariable String teamId) {
        return hackathonService.getTeamMembers(teamId);
    }

    @GetMapping("/{id}/results")
    public List<com.eventmanager.model.HackathonResult> getResults(@PathVariable String id) {
        return hackathonService.getResults(id);
    }

    @PostMapping("/{id}/results")
    public ResponseEntity<Void> publishResults(@PathVariable String id,
            @RequestBody List<com.eventmanager.model.HackathonResult> results) {
        hackathonService.publishResults(id, results);
        return ResponseEntity.ok().build();
    }
}
