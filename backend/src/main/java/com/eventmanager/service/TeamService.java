package com.eventmanager.service;

import com.eventmanager.dto.*;
import java.util.List;

public interface TeamService {
    List<TeamDto> getMyTeams(String userId);
    List<TeamDto> getMyInvites(String userId);
    TeamDto getTeam(String teamId);
    TeamDto createTeam(String userId, CreateTeamRequest request);
    void inviteMember(String teamId, String email);
    void acceptInvite(String teamId, String userId);
    void leaveTeam(String teamId, String userId);
    void submitProject(String teamId, SubmissionRequest request);
}
