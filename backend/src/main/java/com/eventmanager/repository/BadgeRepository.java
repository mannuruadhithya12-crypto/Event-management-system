package com.eventmanager.repository;

import com.eventmanager.model.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, String> {
    Optional<Badge> findByName(String name);
}
