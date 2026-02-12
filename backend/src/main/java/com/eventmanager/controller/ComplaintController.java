package com.eventmanager.controller;

import com.eventmanager.model.Complaint;
import com.eventmanager.service.GrievanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {
    private final GrievanceService grievanceService;

    public ComplaintController(GrievanceService grievanceService) {
        this.grievanceService = grievanceService;
    }

    @PostMapping
    public Complaint submitComplaint(@RequestBody Map<String, String> payload) {
        return grievanceService.submitComplaint(
                payload.get("userId"),
                payload.get("type"),
                payload.get("subject"),
                payload.get("description"));
    }

    @GetMapping("/user/{userId}")
    public List<Complaint> getUserComplaints(@PathVariable String userId) {
        return grievanceService.getUserComplaints(userId);
    }

    @GetMapping
    public List<Complaint> getAllComplaints() {
        return grievanceService.getAllComplaints();
    }

    @PatchMapping("/{id}/status")
    public Complaint updateStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return grievanceService.updateComplaintStatus(
                id,
                payload.get("status"),
                payload.get("adminAction"));
    }
}
