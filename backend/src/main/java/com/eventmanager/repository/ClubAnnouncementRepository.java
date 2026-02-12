package com.eventmanager.repository;

import com.eventmanager.model.ClubAnnouncement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClubAnnouncementRepository extends JpaRepository<ClubAnnouncement, String> {
    List<ClubAnnouncement> findByClubIdOrderByCreatedAtDesc(String clubId);
}
