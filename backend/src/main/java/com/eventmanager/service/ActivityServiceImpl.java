package com.eventmanager.service;

import com.eventmanager.model.Activity;
import com.eventmanager.model.User;
import com.eventmanager.repository.ActivityRepository;
import com.eventmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ActivityServiceImpl implements ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Activity logActivity(String userId, String type, String description, String targetId, String targetName) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Activity activity = new Activity();
        activity.setUser(user);
        activity.setActivityType(type);
        activity.setDescription(description);
        activity.setTargetId(targetId);
        activity.setTargetName(targetName);

        return activityRepository.save(activity);
    }

    @Override
    public List<Activity> getUserTimeline(String userId) {
        return activityRepository.findByUserIdOrderByTimestampDesc(userId);
    }
}
