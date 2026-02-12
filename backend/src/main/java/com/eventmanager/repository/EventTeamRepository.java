package com.eventmanager.repository;

import com.eventmanager.model.EventTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventTeamRepository extends JpaRepository<EventTeam, String> {
    List<EventTeam> findByEventId(String eventId);

    List<EventTeam> findByUserId(String userId);

    Optional<EventTeam> findByEventIdAndUserId(String eventId, String userId);
}
