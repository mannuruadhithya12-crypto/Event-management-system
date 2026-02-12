package com.eventmanager.repository;

import com.eventmanager.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, String> {
    List<Submission> findByHackathonId(String hackathonId);

    List<Submission> findByEventId(String eventId);

    List<Submission> findByTeamId(String teamId);

    List<Submission> findByUserId(String userId);
}
