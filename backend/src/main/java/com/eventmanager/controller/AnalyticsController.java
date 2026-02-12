package com.eventmanager.controller;

import com.eventmanager.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/student/{userId}")
    public ResponseEntity<Map<String, Object>> getStudentDashboardStats(@PathVariable String userId) {
        return ResponseEntity.ok(analyticsService.getStudentDashboardStats(userId));
    }

    @GetMapping("/club/{clubId}")
    public ResponseEntity<Map<String, Object>> getClubAnalytics(@PathVariable String clubId) {
        return ResponseEntity.ok(analyticsService.getClubAnalytics(clubId));
    }

    @GetMapping("/admin/{collegeId}")
    public ResponseEntity<Map<String, Object>> getCollegeAdminStats(@PathVariable String collegeId) {
        return ResponseEntity.ok(analyticsService.getCollegeAdminStats(collegeId));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<Map<String, Object>> getEventStats(@PathVariable String eventId) {
        return ResponseEntity.ok(analyticsService.getEventStats(eventId));
    }

    @GetMapping("/rankings/colleges")
    public ResponseEntity<java.util.List<Map<String, Object>>> getCollegeRankings() {
        return ResponseEntity.ok(analyticsService.getCollegeRankings());
    }
}
