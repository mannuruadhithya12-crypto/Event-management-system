package com.eventmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDto {
    private Integer rank;
    private String teamId;
    private String teamName;
    private Integer totalScore;
    private Integer innovationScore;
    private Integer implementationScore;
    private Integer presentationScore;
    private Integer impactScore;
    private String status;
}
