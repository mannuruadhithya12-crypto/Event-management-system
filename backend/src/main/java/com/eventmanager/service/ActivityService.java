package com.eventmanager.service;

import com.eventmanager.model.Activity;
import java.util.List;

public interface ActivityService {
    Activity logActivity(String userId, String type, String description, String targetId, String targetName);

    List<Activity> getUserTimeline(String userId);
}
