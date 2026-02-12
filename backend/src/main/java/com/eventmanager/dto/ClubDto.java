package com.eventmanager.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ClubDto {
    private String id;
    private String name;
    private String description;
    private String collegeId;
    private String collegeName;
    private String facultyAdvisorId;
    private String facultyAdvisorName;
    private String presidentId;
    private String presidentName;
    private String bannerUrl;
    private String logoUrl;
    private String category;
    private String tags;
    private String achievements;
    private boolean isActive;
    private LocalDateTime createdAt;

    public String getCollegeId() {
        return collegeId;
    }

    public void setCollegeId(String collegeId) {
        this.collegeId = collegeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
