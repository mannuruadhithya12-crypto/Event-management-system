package com.eventmanager.controller;

import com.eventmanager.model.*;
import com.eventmanager.service.GovernanceService;
import com.eventmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/governance")
public class GovernanceController {

    @Autowired
    private GovernanceService governanceService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/approve/event/{id}")
    public ResponseEntity<?> approveEvent(@PathVariable String id, @RequestParam String comments,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails) {
        User actor = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        governanceService.approveEvent(id, actor, comments);
        return ResponseEntity.ok("Event Approved");
    }

    @PostMapping("/approve/hackathon/{id}")
    public ResponseEntity<?> approveHackathon(@PathVariable String id, @RequestParam String comments,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails) {
        User actor = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        governanceService.approveHackathon(id, actor, comments);
        return ResponseEntity.ok("Hackathon Approved");
    }

    @PostMapping("/assign-judge/{eventId}")
    public ResponseEntity<?> assignJudge(@PathVariable String eventId, @RequestParam String judgeId,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails) {
        User actor = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        governanceService.assignJudge(eventId, judgeId, actor);
        return ResponseEntity.ok("Judge Assigned");
    }

    @PostMapping("/submit-score/{submissionId}")
    public ResponseEntity<?> submitScore(@PathVariable String submissionId, @RequestBody JudgeScore scoreDetails,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails) {
        User judge = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        governanceService.submitScore(submissionId, scoreDetails, judge);
        return ResponseEntity.ok("Score Submitted");
    }

    @PostMapping("/lock-scores/{id}")
    public ResponseEntity<?> lockScores(@PathVariable String id, @RequestParam String comments,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails) {
        User actor = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        governanceService.lockScores(id, actor, comments);
        return ResponseEntity.ok("Scores Locked & Finalized");
    }
}
