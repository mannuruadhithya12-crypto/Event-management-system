package com.eventmanager.service;

import com.eventmanager.model.Notification;
import java.util.List;

public interface NotificationService {
    Notification createNotification(String userId, String title, String message, String type, String category);

    List<Notification> getUserNotifications(String userId);

    void markAsRead(String notificationId);

    void markAllAsRead(String userId);

    long getUnreadCount(String userId);
}
