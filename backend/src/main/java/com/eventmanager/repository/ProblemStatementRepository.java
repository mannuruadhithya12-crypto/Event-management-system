package com.eventmanager.repository;

import com.eventmanager.model.ProblemStatement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProblemStatementRepository extends JpaRepository<ProblemStatement, String> {
    List<ProblemStatement> findByHackathonId(String hackathonId);
}
