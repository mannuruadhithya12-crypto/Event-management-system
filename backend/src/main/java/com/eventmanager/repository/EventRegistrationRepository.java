package com.eventmanager.repository;

import com.eventmanager.model.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, String> {
    List<EventRegistration> findByUserId(String userId);

    List<EventRegistration> findByEventId(String eventId);

    long countByEventId(String eventId);
}
