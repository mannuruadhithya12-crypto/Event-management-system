package com.eventmanager.repository;

import com.eventmanager.model.Hackathon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface HackathonRepository extends JpaRepository<Hackathon, String>, JpaSpecificationExecutor<Hackathon> {
    List<Hackathon> findByOrganizerId(String organizerId);
}
