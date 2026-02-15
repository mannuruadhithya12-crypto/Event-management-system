package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user_badges")
public class UserBadge {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "badge_id", nullable = false)
    private Badge badge;

    private LocalDateTime awardedAt = LocalDateTime.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Badge getBadge() { return badge; }
    public void setBadge(Badge badge) { this.badge = badge; }

    public String getBadgeId() { return badge == null ? null : badge.getId(); }
    public void setBadgeId(String badgeId) { /* Derived */ }

    public String getName() { return badge == null ? null : badge.getName(); }
    public void setName(String name) { /* Derived */ }

    public String getIcon() { return badge == null ? null : badge.getIconUrl(); }
    public void setIcon(String icon) { /* Derived */ }

    public String getDescription() { return badge == null ? null : badge.getDescription(); }
    public void setDescription(String description) { /* Derived */ }

    public LocalDateTime getAwardedAt() { return awardedAt; }
    public void setAwardedAt(LocalDateTime awardedAt) { this.awardedAt = awardedAt; }
}
