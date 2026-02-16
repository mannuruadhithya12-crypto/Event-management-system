package com.eventmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentAnalyticsDto {
    private String studentId;
    private String studentName;
    private String email;
    private String department;
    
    // Participation metrics
    private Integer eventsAttended;
    private Integer hackathonsParticipated;
    private Integer certificatesEarned;
    private Double attendanceRate;
    
    // Performance metrics
    private Double averageScore;
    private Integer totalPoints;
    private String performanceLevel; // Excellent, Good, Average, Poor
    
    // Activity history
    private List<Map<String, Object>> participationHistory;
}
