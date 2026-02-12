package com.eventmanager.dto;

import com.eventmanager.model.TeamRole;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventTeamMemberDto {
    private String id;
    private String eventId;
    private String userId;
    private String userName;
    private String userEmail;
    private TeamRole role;
    private String assignedById;
    private String assignedByName;
    private LocalDateTime assignedAt;
}
