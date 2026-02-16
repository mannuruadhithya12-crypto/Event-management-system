package com.eventmanager.service;

import com.eventmanager.model.Event;
import com.eventmanager.model.JudgeAssignment;
import com.eventmanager.model.User;
import com.eventmanager.repository.JudgeAssignmentRepository;
import com.eventmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JudgeService {

    @Autowired
    private JudgeAssignmentRepository judgeAssignmentRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return userRepository.findByEmail(((UserDetails) principal).getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("Not authenticated");
    }

    public List<Event> getAssignedEvents() {
        User judge = getCurrentUser();
        List<JudgeAssignment> assignments = judgeAssignmentRepository.findByJudgeId(judge.getId());
        return assignments.stream()
                .map(JudgeAssignment::getEvent)
                .collect(Collectors.toList());
    }

    public boolean isJudgeAssignedToEvent(String eventId) {
        User judge = getCurrentUser();
        return judgeAssignmentRepository.existsByJudgeIdAndEventId(judge.getId(), eventId);
    }
}
