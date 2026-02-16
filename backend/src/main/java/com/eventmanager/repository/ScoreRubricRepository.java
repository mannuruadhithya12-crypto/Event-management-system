package com.eventmanager.repository;

import com.eventmanager.model.ScoreRubric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScoreRubricRepository extends JpaRepository<ScoreRubric, String> {
    List<ScoreRubric> findByEventId(String eventId);
}
