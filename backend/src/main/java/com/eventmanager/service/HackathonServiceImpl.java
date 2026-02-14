package com.eventmanager.service;

import com.eventmanager.model.*;
import com.eventmanager.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class HackathonServiceImpl implements HackathonService {
    private final HackathonRepository hackathonRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final ProblemStatementRepository problemStatementRepository;
    private final HackathonResultRepository hackathonResultRepository;
    private final UserRepository userRepository;
    private final ActivityService activityService;
    private final NotificationService notificationService;
    private final CertificateService certificateService;

    public HackathonServiceImpl(HackathonRepository hackathonRepository,
            TeamRepository teamRepository,
            TeamMemberRepository teamMemberRepository,
            ProblemStatementRepository problemStatementRepository,
            HackathonResultRepository hackathonResultRepository,
            UserRepository userRepository,
            ActivityService activityService,
            NotificationService notificationService,
            CertificateService certificateService) {
        this.hackathonRepository = hackathonRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.problemStatementRepository = problemStatementRepository;
        this.hackathonResultRepository = hackathonResultRepository;
        this.userRepository = userRepository;
        this.activityService = activityService;
        this.notificationService = notificationService;
        this.certificateService = certificateService;
    }

    @Override
    public Hackathon createHackathon(Hackathon hackathon) {
        hackathon.setCreatedAt(LocalDateTime.now());
        hackathon.setUpdatedAt(LocalDateTime.now());
        return hackathonRepository.save(hackathon);
    }

    @Override
    public Optional<Hackathon> getHackathonById(String id) {
        return hackathonRepository.findById(id);
    }

    @Override
    public List<Hackathon> getAllHackathons() {
        return hackathonRepository.findAll();
    }

    @Override
    public List<Hackathon> getHackathonsByStudent(String userId) {
        return teamMemberRepository.findByUserId(userId).stream()
                .map(tm -> tm.getTeam().getHackathon())
                .distinct()
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public List<Hackathon> getHackathonsByOrganizer(String organizerId) {
        return hackathonRepository.findByOrganizerId(organizerId);
    }

    @Override
    public List<Hackathon> getRegisteredHackathons(String userId) {
        return getHackathonsByStudent(userId).stream()
                .filter(h -> !h.getStatus().equalsIgnoreCase("COMPLETED"))
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public List<Hackathon> getCompletedHackathons(String userId) {
        return getHackathonsByStudent(userId).stream()
                .filter(h -> h.getStatus().equalsIgnoreCase("COMPLETED"))
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public ProblemStatement addProblemStatement(String hackathonId, ProblemStatement problemStatement) {
        Hackathon hackathon = hackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new RuntimeException("Hackathon not found"));
        problemStatement.setHackathon(hackathon);
        return problemStatementRepository.save(problemStatement);
    }

    @Override
    public List<ProblemStatement> getProblemStatements(String hackathonId) {
        return problemStatementRepository.findByHackathonId(hackathonId);
    }

    @Override
    public Team createTeam(String hackathonId, String teamName, String leaderId) {
        Hackathon hackathon = hackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new RuntimeException("Hackathon not found"));
        User leader = userRepository.findById(leaderId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = new Team();
        team.setName(teamName);
        team.setHackathon(hackathon);
        team.setLeader(leader);
        team.setJoinCode(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        team.setCreatedAt(LocalDateTime.now());
        team.setUpdatedAt(LocalDateTime.now());

        Team savedTeam = teamRepository.save(team);

        TeamMember member = new TeamMember();
        member.setTeam(savedTeam);
        member.setUser(leader);
        member.setRole("LEADER");
        teamMemberRepository.save(member);

        activityService.logActivity(leaderId, "TEAM_CREATED",
                "Created team " + teamName + " for hackathon " + hackathon.getTitle(), savedTeam.getId(), teamName);

        return savedTeam;
    }

    @Override
    public Team joinTeam(String hackathonId, String userId, String joinCode) {
        Team team = teamRepository.findAll().stream()
                .filter(t -> t.getHackathon().getId().equals(hackathonId) && t.getJoinCode().equals(joinCode))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Invalid join code or team not found for this hackathon"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if already in a team for this hackathon
        Optional<Team> existing = getTeamByUser(hackathonId, userId);
        if (existing.isPresent()) {
            throw new RuntimeException("User is already in a team for this hackathon");
        }

        TeamMember member = new TeamMember();
        member.setTeam(team);
        member.setUser(user);
        member.setRole("MEMBER");
        teamMemberRepository.save(member);

        notificationService.createNotification(team.getLeader().getId(), "New Team Member",
                user.getName() + " joined your team " + team.getName(), "TEAM_MEMBER_JOINED", "HACKATHON");

        activityService.logActivity(userId, "TEAM_JOINED",
                "Joined team " + team.getName() + " for hackathon " + team.getHackathon().getTitle(), team.getId(),
                team.getName());

        return team;
    }

    @Override
    public List<TeamMember> getTeamMembers(String teamId) {
        return teamMemberRepository.findByTeamId(teamId);
    }

    @Override
    public List<Team> getTeamsByStudent(String userId) {
        return teamMemberRepository.findByUserId(userId).stream()
                .map(TeamMember::getTeam)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public Optional<Team> getTeamByUser(String hackathonId, String userId) {
        List<TeamMember> memberships = teamMemberRepository.findByUserId(userId);
        return memberships.stream()
                .map(TeamMember::getTeam)
                .filter(t -> t.getHackathon().getId().equals(hackathonId))
                .findFirst();
    }

    @Override
    public void publishResults(String hackathonId, List<HackathonResult> results) {
        Hackathon hackathon = hackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new RuntimeException("Hackathon not found"));

        results.forEach(res -> {
            res.setHackathon(hackathon);
            hackathonResultRepository.save(res);
        });

        hackathon.setResultsPublished(true);
        hackathon.setStatus("COMPLETED");
        hackathonRepository.save(hackathon);

        // Notify all participants and generate certificates
        List<Team> teams = teamRepository.findByHackathonId(hackathonId);
        teams.forEach(team -> {
            List<TeamMember> members = teamMemberRepository.findByTeamId(team.getId());

            // Find if this team won anything
            Optional<HackathonResult> teamResult = results.stream()
                    .filter(r -> r.getTeam().getId().equals(team.getId()))
                    .findFirst();

            members.forEach(member -> {
                // Participation certificate for everyone
                certificateService.generateHackathonCertificate(
                        member.getUser().getId(), hackathonId, "participation", null);

                // Winner certificate if applicable
                if (teamResult.isPresent()) {
                    certificateService.generateHackathonCertificate(
                            member.getUser().getId(), hackathonId, "winner",
                            teamResult.get().getRankPoint().toString());
                }

                notificationService.createNotification(member.getUser().getId(), "Results Published",
                        "Results for " + hackathon.getTitle() + " are now out!", "RESULTS_PUBLISHED", "HACKATHON");
            });
        });
    }

    @Override
    public List<HackathonResult> getResults(String hackathonId) {
        return hackathonResultRepository.findByHackathonId(hackathonId);
    }

    @Override
    public List<Hackathon> getRecommendations(String userId) {
        // Simple logic: return some hackathons that the user is not part of
        // In production, this would use ML models or skill matching
        List<Hackathon> all = hackathonRepository.findAll();
        return all.stream()
                .filter(h -> !"COMPLETED".equals(h.getStatus()))
                .limit(3)
                .collect(java.util.stream.Collectors.toList());
    }
}
