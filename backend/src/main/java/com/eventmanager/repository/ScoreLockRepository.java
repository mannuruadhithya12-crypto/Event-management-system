package com.eventmanager.repository;

import com.eventmanager.model.ScoreLock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScoreLockRepository extends JpaRepository<ScoreLock, String> {
    boolean existsByEventId(String eventId);

    java.util.Optional<ScoreLock> findByEventId(String eventId);
}
