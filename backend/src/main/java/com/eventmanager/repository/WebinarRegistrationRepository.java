package com.eventmanager.repository;

import com.eventmanager.model.Webinar;
import com.eventmanager.model.WebinarRegistration;
import com.eventmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WebinarRegistrationRepository extends JpaRepository<WebinarRegistration, String> {
    List<WebinarRegistration> findByStudentId(String studentId);
    List<WebinarRegistration> findByWebinarId(String webinarId);
    Optional<WebinarRegistration> findByWebinarAndStudent(Webinar webinar, User student);
    long countByWebinarId(String webinarId);
}
