package com.eventmanager.controller;

import com.eventmanager.model.Event;
import com.eventmanager.model.JudgeAssignment;
import com.eventmanager.model.User;
import com.eventmanager.repository.EventRepository;
import com.eventmanager.repository.JudgeAssignmentRepository;
import com.eventmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/judge-assignment")
public class JudgeAssignmentController {

    @Autowired
    private JudgeAssignmentRepository judgeAssignmentRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/assign")
    @PreAuthorize("hasAnyRole('HOD', 'FACULTY', 'FACULTY_COORDINATOR')")
    public ResponseEntity<?> assignJudge(@RequestBody Map<String, String> payload) {
        String eventId = payload.get("eventId");
        String judgeEmail = payload.get("judgeEmail");

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        User judge = userRepository.findByEmail(judgeEmail)
                .orElseThrow(() -> new RuntimeException("Judge not found"));

        // Verify user is actually a judge/director
        // For now, lenient check or strictly check subRole

        if (judgeAssignmentRepository.existsByJudgeIdAndEventId(judge.getId(), eventId)) {
            return ResponseEntity.badRequest().body("Judge already assigned to this event");
        }

        JudgeAssignment assignment = new JudgeAssignment();
        assignment.setEvent(event);
        assignment.setJudge(judge);

        judgeAssignmentRepository.save(assignment);

        return ResponseEntity.ok("Judge assigned successfully");
    }
}
