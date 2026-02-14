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
    public List<WebinarDto> getAllWebinars(@RequestParam(required = false) String userId) {
        return webinarService.getAllWebinars(userId);
    }

    @GetMapping("/{id}")
    public WebinarDto getWebinar(@PathVariable String id, @RequestParam(required = false) String userId) {
        return webinarService.getWebinar(id, userId);
    }

    @PostMapping("/create")
    public ResponseEntity<WebinarDto> createWebinar(@RequestParam String userId, @RequestBody CreateWebinarRequest request) {
        return ResponseEntity.ok(webinarService.createWebinar(userId, request));
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<WebinarDto> updateWebinar(@PathVariable String id, @RequestBody CreateWebinarRequest request) {
        return ResponseEntity.ok(webinarService.updateWebinar(id, request));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelWebinar(@PathVariable String id) {
        webinarService.cancelWebinar(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<?> deleteWebinar(@PathVariable String id) {
        webinarService.deleteWebinar(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<?> register(@PathVariable String id, @RequestParam String userId) {
        webinarService.registerForWebinar(userId, id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/student/my")
    public List<WebinarRegistrationDto> getMyRegistrations(@RequestParam String userId) {
        return webinarService.getStudentRegistrations(userId);
    }

    @PostMapping("/{id}/feedback")
    public ResponseEntity<?> submitFeedback(@PathVariable String id, @RequestParam String userId, @RequestBody Map<String, Object> payload) {
        Integer rating = (Integer) payload.get("rating");
        String comment = (String) payload.get("comment");
        webinarService.submitFeedback(userId, id, rating, comment);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/analytics")
    public Map<String, Object> getAnalytics() {
        return webinarService.getAnalytics();
    }

    @PostMapping("/seed")
    public ResponseEntity<?> seed() {
        webinarService.seedWebinars();
        return ResponseEntity.ok(Map.of("message", "Webinars seeded successfully"));
    }
}
