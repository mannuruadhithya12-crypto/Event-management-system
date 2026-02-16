package com.eventmanager.service;

import com.eventmanager.model.Submission;
import java.util.List;
import java.util.Optional;

public interface SubmissionService {
    Submission submitProject(Submission submission);

    List<Submission> getSubmissionsByHackathon(String hackathonId);

    List<Submission> getSubmissionsByTeam(String teamId);

    List<Submission> getSubmissionsByEvent(String eventId);

    Optional<Submission> getSubmissionById(String id);

    void updateSubmission(Submission submission);
}
