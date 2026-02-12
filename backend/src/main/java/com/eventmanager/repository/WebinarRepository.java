package com.eventmanager.repository;

import com.eventmanager.model.Webinar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WebinarRepository extends JpaRepository<Webinar, String> {
    List<Webinar> findByCollegeId(String collegeId);

    List<Webinar> findByCategory(String category);
}
