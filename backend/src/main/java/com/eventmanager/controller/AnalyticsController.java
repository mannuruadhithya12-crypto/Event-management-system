package com.eventmanager.controller;

import com.eventmanager.dto.ApiResponse;
import com.eventmanager.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/student/{userId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStudentDashboardStats(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getStudentDashboardStats(userId)));
    }

    @GetMapping("/club/{clubId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getClubAnalytics(@PathVariable String clubId) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getClubAnalytics(clubId)));
    }

    @GetMapping("/admin/{collegeId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCollegeAdminStats(@PathVariable String collegeId) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getCollegeAdminStats(collegeId)));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEventStats(@PathVariable String eventId) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getEventStats(eventId)));
    }

    @GetMapping("/rankings/colleges")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getCollegeRankings() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getCollegeRankings()));
    }
}
