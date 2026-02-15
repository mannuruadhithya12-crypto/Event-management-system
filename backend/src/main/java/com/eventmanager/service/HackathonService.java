package com.eventmanager.service;

import com.eventmanager.model.Hackathon;
import com.eventmanager.model.ProblemStatement;
import com.eventmanager.model.Team;
import com.eventmanager.model.TeamMember;
import com.eventmanager.model.HackathonResult;
import java.util.List;
import java.util.Optional;

    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.Pageable;

    public interface HackathonService {
        Hackathon createHackathon(Hackathon hackathon);

        Optional<Hackathon> getHackathonById(String id);

        List<Hackathon> getAllHackathons();
        
        Page<Hackathon> getHackathons(String search, String country, String mode, String status, List<String> tags, Pageable pageable);

    List<Hackathon> getHackathonsByStudent(String userId);

    List<Hackathon> getHackathonsByOrganizer(String organizerId);

    List<Hackathon> getRegisteredHackathons(String userId);

    List<Hackathon> getCompletedHackathons(String userId);

    // Problem Statements
    ProblemStatement addProblemStatement(String hackathonId, ProblemStatement problemStatement);

    List<ProblemStatement> getProblemStatements(String hackathonId);

    // Team Management
    Team createTeam(String hackathonId, String teamName, String leaderId);

    Team joinTeam(String hackathonId, String userId, String joinCode);

    List<TeamMember> getTeamMembers(String teamId);

    List<Team> getTeamsByStudent(String userId);

    Optional<Team> getTeamByUser(String hackathonId, String userId);

    // Results
    void publishResults(String hackathonId, List<HackathonResult> results);

    List<HackathonResult> getResults(String hackathonId);

    // Recommendations
    List<Hackathon> getRecommendations(String userId);

    void seedStudentRegistrations(String userId);
}
