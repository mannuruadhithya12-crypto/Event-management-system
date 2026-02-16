package com.eventmanager.repository;

import com.eventmanager.model.JudgeAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JudgeAssignmentRepository extends JpaRepository<JudgeAssignment, String> {
    List<JudgeAssignment> findByJudgeId(String judgeId);

    boolean existsByJudgeIdAndEventId(String judgeId, String eventId);

    List<JudgeAssignment> findByEventId(String eventId);
}
