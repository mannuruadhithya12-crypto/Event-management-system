package com.eventmanager.service;

import com.eventmanager.model.Badge;
import com.eventmanager.model.UserBadge;
import java.util.List;

public interface GamificationService {
    void awardBadge(String userId, String badgeName);

    List<UserBadge> getUserBadges(String userId);

    List<Badge> getAllBadges();
}
