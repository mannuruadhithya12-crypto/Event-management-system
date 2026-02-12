package com.eventmanager.repository;

import com.eventmanager.model.HackathonResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HackathonResultRepository extends JpaRepository<HackathonResult, String> {
    List<HackathonResult> findByHackathonId(String hackathonId);

    HackathonResult findByTeamId(String teamId);
}
