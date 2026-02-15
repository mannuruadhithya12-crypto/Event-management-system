package com.eventmanager.repository;

import com.eventmanager.model.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, String> {
    List<SupportTicket> findByUserIdOrderByCreatedAtDesc(String userId);
    List<SupportTicket> findByStatus(String status);
    List<SupportTicket> findByCategory(String category);
}
