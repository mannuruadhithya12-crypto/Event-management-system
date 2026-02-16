package com.eventmanager.repository;

import com.eventmanager.model.LeaderboardLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LeaderboardLogRepository extends JpaRepository<LeaderboardLog, String> {
    List<LeaderboardLog> findByEventId(String eventId);
}
