package com.eventmanager.repository;

import com.eventmanager.model.ClubJoinRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClubJoinRequestRepository extends JpaRepository<ClubJoinRequest, String> {
    List<ClubJoinRequest> findByClubIdOrderByCreatedAtDesc(String clubId);

    List<ClubJoinRequest> findByUserIdOrderByCreatedAtDesc(String userId);
}
