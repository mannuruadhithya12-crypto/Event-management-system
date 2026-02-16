package com.eventmanager.controller;

import com.eventmanager.model.Event;
import com.eventmanager.service.JudgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/judge")
@PreAuthorize("hasRole('DIRECTOR') or hasRole('JUDGE')")
// Note: As per Roles.java, JUDGE is a subRole.
// If using custom authority mapper, it might be ROLE_JUDGE.
// Safest is to allow Director/Judge or rely on service-level user check.
public class JudgeController {

    @Autowired
    private com.eventmanager.repository.JudgeScoreRepository judgeScoreRepository;
    @Autowired
    private com.eventmanager.repository.UserRepository userRepository;

    @Autowired
    private JudgeService judgeService;

    private com.eventmanager.model.User getCurrentUser() {
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            return userRepository
                    .findByEmail(((org.springframework.security.core.userdetails.UserDetails) principal).getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("Not authenticated");
    }

    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAssignedEvents() {
        return ResponseEntity.ok(judgeService.getAssignedEvents());
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {

        com.eventmanager.model.User judge = getCurrentUser();
        List<Event> events = judgeService.getAssignedEvents();

        // Count total assignments
        int totalAssigned = events.size();

        // Count completed evaluations (Status = SUBMITTED)
        // Need to fetch scores where judge is this judge
        List<com.eventmanager.model.JudgeScore> scores = judgeScoreRepository.findByJudge_Id(judge.getId());

        // Count completed (not draft)
        long completed = scores.stream()
                .filter(s -> !s.getIsDraft())
                .count();

        // submissions for all events.
        // For now, let's just return what we have.
        // Maybe "Pending" = Assigned Events that are not fully judged?
        // Let's stick to Assignments, Completed Scores, and maybe "In Progress"
        // (Drafts).

        long drafts = scores.stream().filter(com.eventmanager.model.JudgeScore::getIsDraft).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("assignedEvents", totalAssigned);
        stats.put("completedEvaluations", completed);
        stats.put("draftEvaluations", drafts);

        return ResponseEntity.ok(stats);
    }
}
