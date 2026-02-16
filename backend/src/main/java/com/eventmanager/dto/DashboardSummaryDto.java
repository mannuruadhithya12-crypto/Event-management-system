package com.eventmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDto {
    private Long totalEvents;
    private Long totalHackathons;
    private Long activeRegistrations;
    private Long pendingApprovals;
    private Long resourcesUploaded;
    private Long certificatesIssued;
    private Long studentParticipationCount;
    
    // Growth metrics
    private Double eventRegistrationGrowth;
    private Double hackathonTeamGrowth;
    private Double contentDownloadGrowth;
    
    // Recent activity counts
    private Long recentEventRegistrations;
    private Long recentSubmissions;
    private Long recentFeedback;
}
