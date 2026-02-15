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

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getFacultyAdvisorId() { return facultyAdvisorId; }
    public void setFacultyAdvisorId(String facultyAdvisorId) { this.facultyAdvisorId = facultyAdvisorId; }

    public String getFacultyAdvisorName() { return facultyAdvisorName; }
    public void setFacultyAdvisorName(String facultyAdvisorName) { this.facultyAdvisorName = facultyAdvisorName; }

    public String getPresidentId() { return presidentId; }
    public void setPresidentId(String presidentId) { this.presidentId = presidentId; }

    public String getPresidentName() { return presidentName; }
    public void setPresidentName(String presidentName) { this.presidentName = presidentName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getAchievements() { return achievements; }
    public void setAchievements(String achievements) { this.achievements = achievements; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }
}
