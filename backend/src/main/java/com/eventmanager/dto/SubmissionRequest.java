package com.eventmanager.dto;

import lombok.Data;

@Data
public class SubmissionRequest {
    private String projectUrl; // githubUrl
    private String demoUrl;
    private String fileUrl;
    private String description;

    public String getProjectUrl() { return projectUrl; }
    public void setProjectUrl(String projectUrl) { this.projectUrl = projectUrl; }
    public String getDemoUrl() { return demoUrl; }
    public void setDemoUrl(String demoUrl) { this.demoUrl = demoUrl; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
