package com.eventmanager.controller;

import com.eventmanager.dto.ApiResponse;
import com.eventmanager.model.EventFeedback;
import com.eventmanager.service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping("/events/{eventId}")
    public ResponseEntity<ApiResponse<EventFeedback>> submitFeedback(@PathVariable String eventId, @RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(ApiResponse.success(feedbackService.submitFeedback(
                eventId,
                (String) payload.get("userId"),
                (Integer) payload.get("rating"),
                (String) payload.get("comment"),
                (String) payload.get("suggestions"))));
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<ApiResponse<List<EventFeedback>>> getEventFeedback(@PathVariable String eventId) {
        return ResponseEntity.ok(ApiResponse.success(feedbackService.getEventFeedback(eventId)));
    }

    @GetMapping("/events/{eventId}/average")
    public ResponseEntity<ApiResponse<Double>> getAverageRating(@PathVariable String eventId) {
        return ResponseEntity.ok(ApiResponse.success(feedbackService.getAverageRating(eventId)));
    }
}
