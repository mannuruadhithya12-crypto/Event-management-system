package com.eventmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FacultyStatsDto {
    private long myEventsCount;
    private long myHackathonsCount;
    private long activeRegistrationsCount;
    private long pendingApprovalsCount;
    private long resourcesUploadedCount;
    private long certificatesIssuedCount;
    private long studentParticipationCount;
    
    // Engagement metrics
    private double eventRegistrationGrowth;
    private double contentDownloadGrowth;
    private double hackathonTeamGrowth;
    
    // Recent activity counts
    private long recentEventRegistrations;
    private long recentSubmissions;
    private long recentFeedback;
}
