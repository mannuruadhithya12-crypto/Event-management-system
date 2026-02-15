package com.eventmanager.repository;

import com.eventmanager.model.SupportFAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SupportFAQRepository extends JpaRepository<SupportFAQ, String> {
    List<SupportFAQ> findByIsActiveTrueOrderByDisplayOrderAsc();
    List<SupportFAQ> findByCategoryAndIsActiveTrue(String category);
}
