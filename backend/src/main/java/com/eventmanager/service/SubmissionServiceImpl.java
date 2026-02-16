package com.eventmanager.service;

import com.eventmanager.model.Submission;
import com.eventmanager.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SubmissionServiceImpl implements SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final ActivityService activityService;
    private final NotificationService notificationService;

    public SubmissionServiceImpl(SubmissionRepository submissionRepository,
            ActivityService activityService,
            NotificationService notificationService) {
        this.submissionRepository = submissionRepository;
        this.activityService = activityService;
        this.notificationService = notificationService;
    }

    @Override
    public Submission submitProject(Submission submission) {
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setStatus(Submission.SubmissionStatus.PENDING);
        Submission saved = submissionRepository.save(submission);

        String userId = submission.getUser() != null ? submission.getUser().getId() : null;
        if (userId != null) {
            String targetTitle = submission.getHackathon() != null ? submission.getHackathon().getTitle() : "Event";
            activityService.logActivity(userId, "SUBMISSION_CREATED",
                    "Submitted project " + submission.getProjectTitle() + " for " + targetTitle, saved.getId(),
                    targetTitle);

            if (submission.getTeam() != null && submission.getTeam().getLeader() != null) {
                notificationService.createNotification(submission.getTeam().getLeader().getId(), "Team Submission",
                        "Your team project " + submission.getProjectTitle() + " has been submitted.", "TEAM_SUBMISSION",
                        "HACKATHON");
            }
        }

        return saved;
    }

    @Override
    public List<Submission> getSubmissionsByHackathon(String hackathonId) {
        return submissionRepository.findByHackathonId(hackathonId);
    }

    @Override
    public List<Submission> getSubmissionsByTeam(String teamId) {
        return submissionRepository.findByTeamId(teamId);
    }

    @Override
    public Optional<Submission> getSubmissionById(String id) {
        return submissionRepository.findById(id);
    }

    @Override
    public void updateSubmission(Submission submission) {
        submissionRepository.save(submission);
    }
}
