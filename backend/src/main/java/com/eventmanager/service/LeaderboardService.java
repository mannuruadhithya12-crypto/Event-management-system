package com.eventmanager.service;

import com.eventmanager.model.JudgeScore;
import com.eventmanager.model.ScoreLock;
import com.eventmanager.model.Submission;
import com.eventmanager.repository.JudgeScoreRepository;
import com.eventmanager.repository.ScoreLockRepository;
import com.eventmanager.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    @Autowired
    private JudgeScoreRepository judgeScoreRepository;

    @Autowired
    private ScoreLockRepository scoreLockRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    public List<Map<String, Object>> getLeaderboard(String eventId) {
        // 1. Check if scores are locked (approved by HOD)
        // Only show leaderboard if locked? Or allow preview?
        // Requirement: "After approval: Score Lock Activated, Leaderboard Generated"
        // So we should probably check if locked.

        boolean isLocked = scoreLockRepository.findByEventId(eventId)
                .map(ScoreLock::getIsLocked)
                .orElse(false);

        if (!isLocked) {
            // Return empty or throw exception? For now, return empty to prevent premature
            // viewing.
            // Or maybe we allow it but mark as "Provisional"
            // Requirement says "Leaderboard Generated" AFTER approval.
            return new ArrayList<>();
        }

        // 2. Fetch all scores for the event
        List<Submission> submissions = submissionRepository.findAll().stream()
                .filter(s -> s.getEvent().getId().equals(eventId))
                .collect(Collectors.toList());

        List<Map<String, Object>> leaderboard = new ArrayList<>();

        for (Submission submission : submissions) {
            List<JudgeScore> scores = judgeScoreRepository.findBySubmission_Id(submission.getId());

            // Filter only SUBMITTED scores
            List<JudgeScore> finalScores = scores.stream()
                    .filter(s -> !s.getIsDraft())
                    .collect(Collectors.toList());

            if (finalScores.isEmpty())
                continue;

            double averageScore = finalScores.stream()
                    .mapToDouble(JudgeScore::getTotalScore)
                    .average()
                    .orElse(0.0);

            Map<String, Object> entry = new HashMap<>();
            entry.put("submissionId", submission.getId());
            entry.put("teamName", submission.getTeam() != null ? submission.getTeam().getName() : "Individual");
            entry.put("title", submission.getProjectTitle());
            entry.put("score", averageScore);
            // Rank will be assigned after sorting

            leaderboard.add(entry);
        }

        // 3. Sort by Score Descending
        leaderboard.sort((a, b) -> Double.compare((Double) b.get("score"), (Double) a.get("score")));

        // 4. Assign Ranks
        for (int i = 0; i < leaderboard.size(); i++) {
            leaderboard.get(i).put("rank", i + 1);
        }

        return leaderboard;
    }
}
