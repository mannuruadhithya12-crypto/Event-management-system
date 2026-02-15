package com.eventmanager.controller;

import com.eventmanager.dto.ApiResponse;
import com.eventmanager.model.Submission;
import com.eventmanager.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<ApiResponse<Submission>> submitProject(@RequestBody Submission submission) {
        return ResponseEntity.ok(ApiResponse.success(submissionService.submitProject(submission)));
    }

    @GetMapping("/hackathon/{hackathonId}")
    public ResponseEntity<ApiResponse<List<Submission>>> getSubmissionsByHackathon(@PathVariable String hackathonId) {
        return ResponseEntity.ok(ApiResponse.success(submissionService.getSubmissionsByHackathon(hackathonId)));
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<ApiResponse<List<Submission>>> getSubmissionsByTeam(@PathVariable String teamId) {
        return ResponseEntity.ok(ApiResponse.success(submissionService.getSubmissionsByTeam(teamId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Submission>> getSubmissionById(@PathVariable String id) {
        return submissionService.getSubmissionById(id)
                .map(sub -> ResponseEntity.ok(ApiResponse.success(sub)))
                .orElse(ResponseEntity.status(404).body(ApiResponse.error("Submission not found")));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> updateSubmission(@PathVariable String id, @RequestBody Submission submission) {
        submission.setId(id);
        submissionService.updateSubmission(submission);
        return ResponseEntity.ok(ApiResponse.success("Submission updated successfully", null));
    }
}
