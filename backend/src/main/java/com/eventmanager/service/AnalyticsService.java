package com.eventmanager.service;

import java.util.Map;

public interface AnalyticsService {
    Map<String, Object> getStudentDashboardStats(String userId);

    Map<String, Object> getClubAnalytics(String clubId);

    Map<String, Object> getCollegeAdminStats(String collegeId);

    Map<String, Object> getEventStats(String eventId);

    java.util.List<Map<String, Object>> getCollegeRankings();
}
