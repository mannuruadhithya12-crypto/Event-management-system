package com.eventmanager.service;

import com.eventmanager.model.Badge;
import com.eventmanager.model.UserBadge;
import com.eventmanager.model.User;
import com.eventmanager.repository.BadgeRepository;
import com.eventmanager.repository.UserBadgeRepository;
import com.eventmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GamificationServiceImpl implements GamificationService {

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private UserBadgeRepository userBadgeRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void awardBadge(String userId, String badgeName) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Badge badge = badgeRepository.findByName(badgeName).orElseThrow(() -> new RuntimeException("Badge not found"));

        // Check if already awarded
        List<UserBadge> currentBadges = userBadgeRepository.findByUserId(userId);
        boolean alreadyHas = currentBadges.stream().anyMatch(ub -> ub.getBadge().getName().equals(badgeName));

        if (!alreadyHas) {
            UserBadge userBadge = new UserBadge();
            userBadge.setUser(user);
            userBadge.setBadge(badge);
            userBadgeRepository.save(userBadge);
        }
    }

    @Override
    public List<UserBadge> getUserBadges(String userId) {
        return userBadgeRepository.findByUserId(userId);
    }

    @Override
    public List<Badge> getAllBadges() {
        return badgeRepository.findAll();
    }
}
