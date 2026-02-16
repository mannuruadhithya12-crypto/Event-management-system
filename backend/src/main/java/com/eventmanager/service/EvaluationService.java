package com.eventmanager.service;

import com.eventmanager.model.*;
import com.eventmanager.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EvaluationService {

    @Autowired
    private JudgeScoreRepository judgeScoreRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private JudgeService judgeService;

    @Autowired
    private ScoreLockRepository scoreLockRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            return userRepository
                    .findByEmail(((org.springframework.security.core.userdetails.UserDetails) principal).getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("Not authenticated");
    }

    @Transactional
    public JudgeScore submitScore(String submissionId, String criteriaScores, Double totalScore, String feedback,
            Boolean isDraft) {
        User judge = getCurrentUser();
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        // 1. Verify Judge is assigned to this Event
        if (!judgeService.isJudgeAssignedToEvent(submission.getEvent().getId())) {
            throw new RuntimeException("You are not assigned to judge this event.");
        }

        // 2. Check if Scores are Locked by HOD
        if (scoreLockRepository.existsByEventId(submission.getEvent().getId())) {
            Optional<ScoreLock> lock = scoreLockRepository.findByEventId(submission.getEvent().getId());
            if (lock.isPresent() && lock.get().getIsLocked()) {
                throw new RuntimeException("Scoring for this event has been locked by the HOD.");
            }
        }

        // 3. Check if Judge already submitted Final Score
        Optional<JudgeScore> existingScore = judgeScoreRepository.findByJudgeAndSubmission(judge, submission);
        if (existingScore.isPresent()) {
            JudgeScore score = existingScore.get();
            if (!score.getIsDraft()) {
                throw new RuntimeException(
                        "You have already submitted a final score for this project. Edits are no longer allowed.");
            }
            // Update existing
            score.setCriteriaScores(criteriaScores);
            score.setTotalScore(totalScore);
            score.setFeedback(feedback);
            score.setIsDraft(isDraft);
            return judgeScoreRepository.save(score);
        }

        // Create new
        JudgeScore newScore = new JudgeScore();
        newScore.setJudge(judge);
        newScore.setSubmission(submission);
        newScore.setCriteriaScores(criteriaScores);
        newScore.setTotalScore(totalScore);
        newScore.setFeedback(feedback);
        newScore.setIsDraft(isDraft);

        return judgeScoreRepository.save(newScore);
    }

    public List<JudgeScore> getScoresForEvent(String eventId) {
        return judgeScoreRepository.findAll().stream()
                .filter(s -> s.getSubmission().getEvent().getId().equals(eventId))
                .toList();
    }

    public Optional<JudgeScore> getScoreForSubmission(String submissionId) {
        User judge = getCurrentUser();
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        return judgeScoreRepository.findByJudgeAndSubmission(judge, submission);
    }

    public List<JudgeScore> getSubmittedScoresByEvent(String eventId) {
        // We can get all submissions for the event, then find scores for them
        // Or find all scores where isDraft = false and submission.event.id = eventId
        return judgeScoreRepository.findAll().stream()
                .filter(score -> !score.getIsDraft() &&
                        score.getSubmission() != null &&
                        score.getSubmission().getEvent() != null &&
                        score.getSubmission().getEvent().getId().equals(eventId))
                .collect(java.util.stream.Collectors.toList());
    }

    @Autowired
    private EventRepository eventRepository;

    public List<java.util.Map<String, Object>> getPendingSummaryForHOD() {
        List<Event> events = eventRepository.findAll();
        List<java.util.Map<String, Object>> summary = new java.util.ArrayList<>();

        for (Event event : events) {
            long pendingCount = judgeScoreRepository.findAll().stream()
                    .filter(score -> !score.getIsDraft() &&
                            score.getSubmission() != null &&
                            score.getSubmission().getEvent() != null &&
                            score.getSubmission().getEvent().getId().equals(event.getId()))
                    .count();

            boolean isLocked = scoreLockRepository.findByEventId(event.getId())
                    .map(ScoreLock::getIsLocked).orElse(false);

            if (pendingCount > 0 || isLocked) {
                java.util.Map<String, Object> map = new java.util.HashMap<>();
                map.put("eventId", event.getId());
                map.put("eventTitle", event.getTitle());
                map.put("pendingCount", pendingCount);
                map.put("isLocked", isLocked);
                map.put("status", event.getStatus());
                summary.add(map);
            }
        }
        return summary;
    }
}
