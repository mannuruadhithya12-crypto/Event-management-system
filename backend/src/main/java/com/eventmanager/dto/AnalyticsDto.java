package com.eventmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDto {
    // Overview stats
    private Long totalEvents;
    private Long totalHackathons;
    private Long totalParticipants;
    private Double avgAttendance;
    
    // Trend data
    private List<Map<String, Object>> eventTrend;
    private List<Map<String, Object>> participationByDepartment;
    private List<Map<String, Object>> eventTypeDistribution;
    private List<Map<String, Object>> monthlyEngagement;
    
    // Performance metrics
    private Double eventSuccessRate;
    private Double hackathonCompletionRate;
    private Double studentEngagementScore;
}
