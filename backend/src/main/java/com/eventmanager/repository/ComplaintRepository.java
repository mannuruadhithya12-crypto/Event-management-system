package com.eventmanager.repository;

import com.eventmanager.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, String> {
    List<Complaint> findByReporterIdOrderByCreatedAtDesc(String reporterId);

    List<Complaint> findByStatusOrderByCreatedAtDesc(String status);
}
