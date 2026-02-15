package com.eventmanager.repository;

import com.eventmanager.model.SupportAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SupportAttachmentRepository extends JpaRepository<SupportAttachment, String> {
    List<SupportAttachment> findByTicketId(String ticketId);
}
