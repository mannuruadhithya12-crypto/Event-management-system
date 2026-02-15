package com.eventmanager.controller;

import com.eventmanager.dto.ApiResponse;
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
    public ResponseEntity<ApiResponse<Complaint>> submitComplaint(@RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(ApiResponse.success(grievanceService.submitComplaint(
                payload.get("userId"),
                payload.get("type"),
                payload.get("subject"),
                payload.get("description"))));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Complaint>>> getUserComplaints(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.success(grievanceService.getUserComplaints(userId)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Complaint>>> getAllComplaints() {
        return ResponseEntity.ok(ApiResponse.success(grievanceService.getAllComplaints()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Complaint>> updateStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(ApiResponse.success(grievanceService.updateComplaintStatus(
                id,
                payload.get("status"),
                payload.get("adminAction"))));
    }
}
