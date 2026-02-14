package com.eventmanager.repository;

import com.eventmanager.model.WebinarFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WebinarFeedbackRepository extends JpaRepository<WebinarFeedback, String> {
    List<WebinarFeedback> findByWebinarId(String webinarId);
}
