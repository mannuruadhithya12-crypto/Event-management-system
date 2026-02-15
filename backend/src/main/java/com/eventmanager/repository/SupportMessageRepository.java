package com.eventmanager.repository;

import com.eventmanager.model.SupportMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SupportMessageRepository extends JpaRepository<SupportMessage, String> {
    List<SupportMessage> findByTicketIdOrderBySentAtAsc(String ticketId);
}
