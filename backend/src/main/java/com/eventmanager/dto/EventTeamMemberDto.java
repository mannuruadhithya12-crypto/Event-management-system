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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public TeamRole getRole() { return role; }
    public void setRole(TeamRole role) { this.role = role; }

    public String getAssignedById() { return assignedById; }
    public void setAssignedById(String assignedById) { this.assignedById = assignedById; }

    public String getAssignedByName() { return assignedByName; }
    public void setAssignedByName(String assignedByName) { this.assignedByName = assignedByName; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
}
