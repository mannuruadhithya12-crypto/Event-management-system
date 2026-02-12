package com.eventmanager.repository;

import com.eventmanager.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, String> {
    List<Team> findByHackathonId(String hackathonId);

    List<Team> findByLeaderId(String leaderId);
}
