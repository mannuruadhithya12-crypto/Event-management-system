package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "support_attachments")
public class SupportAttachment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "ticket_id", nullable = false)
    private SupportTicket ticket;

    private String fileName;
    private String fileUrl;
    private String fileType;

    private LocalDateTime uploadedAt = LocalDateTime.now();
}
