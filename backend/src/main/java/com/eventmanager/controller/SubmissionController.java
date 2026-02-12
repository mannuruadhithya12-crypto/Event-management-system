package com.eventmanager.controller;

import com.eventmanager.model.Submission;
import com.eventmanager.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "*")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<Submission> submitProject(@RequestBody Submission submission) {
        return ResponseEntity.ok(submissionService.submitProject(submission));
    }

    @GetMapping("/hackathon/{hackathonId}")
    public ResponseEntity<List<Submission>> getSubmissionsByHackathon(@PathVariable String hackathonId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByHackathon(hackathonId));
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<Submission>> getSubmissionsByTeam(@PathVariable String teamId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByTeam(teamId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Submission> getSubmissionById(@PathVariable String id) {
        return submissionService.getSubmissionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateSubmission(@PathVariable String id, @RequestBody Submission submission) {
        submission.setId(id);
        submissionService.updateSubmission(submission);
        return ResponseEntity.noContent().build();
    }
}
