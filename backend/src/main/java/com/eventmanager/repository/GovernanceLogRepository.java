package com.eventmanager.repository;

import com.eventmanager.model.GovernanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GovernanceLogRepository extends JpaRepository<GovernanceLog, String> {
}
