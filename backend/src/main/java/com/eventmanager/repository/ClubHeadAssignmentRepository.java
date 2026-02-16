package com.eventmanager.repository;

import com.eventmanager.model.ClubHeadAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClubHeadAssignmentRepository extends JpaRepository<ClubHeadAssignment, String> {
    List<ClubHeadAssignment> findByFacultyIdAndIsActiveTrue(String facultyId);

    Optional<ClubHeadAssignment> findByFacultyIdAndClubIdAndIsActiveTrue(String facultyId, String clubId);
}
