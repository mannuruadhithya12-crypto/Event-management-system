package com.eventmanager.controller;

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
    public EventFeedback submitFeedback(@PathVariable String eventId, @RequestBody Map<String, Object> payload) {
        return feedbackService.submitFeedback(
                eventId,
                (String) payload.get("userId"),
                (Integer) payload.get("rating"),
                (String) payload.get("comment"),
                (String) payload.get("suggestions"));
    }

    @GetMapping("/events/{eventId}")
    public List<EventFeedback> getEventFeedback(@PathVariable String eventId) {
        return feedbackService.getEventFeedback(eventId);
    }

    @GetMapping("/events/{eventId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable String eventId) {
        return ResponseEntity.ok(feedbackService.getAverageRating(eventId));
    }
}
