package com.eventmanager.dto;

import lombok.Data;

@Data
public class CreateTeamRequest {
    private String name;
    private String hackathonId;
    private String eventId;
    private Integer maxMembers;
    private String requiredSkills;
    private String description;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getHackathonId() { return hackathonId; }
    public void setHackathonId(String hackathonId) { this.hackathonId = hackathonId; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public Integer getMaxMembers() { return maxMembers; }
    public void setMaxMembers(Integer maxMembers) { this.maxMembers = maxMembers; }
    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
