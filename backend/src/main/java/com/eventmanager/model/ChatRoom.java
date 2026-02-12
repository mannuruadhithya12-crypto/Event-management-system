package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "chat_rooms")
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private String type; // PRIVATE, GROUP, EVENT, TEAM, CLUB
    private String targetId; // ID of the event, team, or club

    private LocalDateTime createdAt = LocalDateTime.now();
}
