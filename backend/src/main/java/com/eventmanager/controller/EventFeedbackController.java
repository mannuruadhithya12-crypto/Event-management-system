package com.eventmanager.controller;

import com.eventmanager.model.Event;
import com.eventmanager.model.EventFeedback;
import com.eventmanager.model.User;
import com.eventmanager.repository.EventFeedbackRepository;
import com.eventmanager.repository.EventRepository;
import com.eventmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class EventFeedbackController {

    @Autowired
    private EventFeedbackRepository feedbackRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/event")
    public ResponseEntity<?> submitFeedback(@RequestBody Map<String, Object> payload) {
        String eventId = (String) payload.get("eventId");
        String userId = (String) payload.get("userId");
        Integer rating = payload.get("rating") != null ? ((Number) payload.get("rating")).intValue() : 0;
        String comment = (String) payload.get("comment");
        String suggestions = (String) payload.get("suggestions");

        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) return ResponseEntity.badRequest().body("Event not found");

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.badRequest().body("User not found");

        EventFeedback feedback = new EventFeedback();
        feedback.setEvent(event);
        feedback.setStudent(user);
        feedback.setRating(rating);
        feedback.setComment(comment);
        feedback.setSuggestions(suggestions);
        
        feedbackRepository.save(feedback); // Let entity set timestamp

        return ResponseEntity.ok("Feedback submitted successfully");
    }
}
