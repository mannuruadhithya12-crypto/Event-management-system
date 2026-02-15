package com.eventmanager.controller;

import com.eventmanager.dto.*;
import com.eventmanager.service.WebinarService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/webinars")
public class WebinarController {

    private final WebinarService webinarService;

    public WebinarController(WebinarService webinarService) {
        this.webinarService = webinarService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WebinarDto>>> getAllWebinars(@RequestParam(required = false) String userId) {
        return ResponseEntity.ok(ApiResponse.success(webinarService.getAllWebinars(userId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WebinarDto>> getWebinar(@PathVariable String id, @RequestParam(required = false) String userId) {
        return ResponseEntity.ok(ApiResponse.success(webinarService.getWebinar(id, userId)));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<WebinarDto>> createWebinar(@RequestParam String userId, @RequestBody CreateWebinarRequest request) {
        return ResponseEntity.ok(ApiResponse.success(webinarService.createWebinar(userId, request)));
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<ApiResponse<WebinarDto>> updateWebinar(@PathVariable String id, @RequestBody CreateWebinarRequest request) {
        return ResponseEntity.ok(ApiResponse.success(webinarService.updateWebinar(id, request)));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelWebinar(@PathVariable String id) {
        webinarService.cancelWebinar(id);
        return ResponseEntity.ok(ApiResponse.success("Webinar cancelled successfully", null));
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<ApiResponse<Void>> deleteWebinar(@PathVariable String id) {
        webinarService.deleteWebinar(id);
        return ResponseEntity.ok(ApiResponse.success("Webinar deleted successfully", null));
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<ApiResponse<Void>> register(@PathVariable String id, @RequestParam String userId) {
        webinarService.registerForWebinar(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Registered successfully", null));
    }

    @DeleteMapping("/{id}/unregister")
    public ResponseEntity<ApiResponse<Void>> unregister(@PathVariable String id, @RequestParam String userId) {
        webinarService.unregisterForWebinar(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Unregistered successfully", null));
    }

    @GetMapping("/student/my")
    public ResponseEntity<ApiResponse<List<WebinarRegistrationDto>>> getMyRegistrations(@RequestParam String userId) {
        return ResponseEntity.ok(ApiResponse.success(webinarService.getStudentRegistrations(userId)));
    }

    // Duplicate endpoint alias for frontend compatibility
    @GetMapping("/api/student/webinars")
    public ResponseEntity<ApiResponse<List<WebinarRegistrationDto>>> getStudentWebinars(@RequestParam String userId) {
        return ResponseEntity.ok(ApiResponse.success(webinarService.getStudentRegistrations(userId)));
    }

    @PostMapping("/{id}/feedback")
    public ResponseEntity<ApiResponse<Void>> submitFeedback(@PathVariable String id, @RequestParam String userId, @RequestBody Map<String, Object> payload) {
        Integer rating = (Integer) payload.get("rating");
        String comment = (String) payload.get("comment");
        webinarService.submitFeedback(userId, id, rating, comment);
        return ResponseEntity.ok(ApiResponse.success("Feedback submitted", null));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.success(webinarService.getAnalytics()));
    }


    @PostMapping("/{id}/join")
    public ResponseEntity<ApiResponse<Map<String, String>>> joinWebinar(@PathVariable String id, @RequestParam String userId) {
        String meetingLink = webinarService.joinWebinar(userId, id);
        return ResponseEntity.ok(ApiResponse.success(Map.of("message", "Joined successfully", "url", meetingLink)));
    }

    @PostMapping("/seed")
    public ResponseEntity<ApiResponse<Map<String, String>>> seed() {
        webinarService.seedWebinars();
        return ResponseEntity.ok(ApiResponse.success(Map.of("message", "Seeded 25 webinars")));
    }
}
