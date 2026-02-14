package com.eventmanager.controller;

import com.eventmanager.dto.*;
import com.eventmanager.service.ChatService;
import com.eventmanager.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class TeamController {

    private final TeamService teamService;
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public TeamController(TeamService teamService, ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.teamService = teamService;
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/teams")
    public List<TeamDto> getMyTeams(@RequestParam String userId) {
        return teamService.getMyTeams(userId);
    }

    @GetMapping("/team/{id}")
    public ResponseEntity<TeamDto> getTeam(@PathVariable String id) {
        return ResponseEntity.ok(teamService.getTeam(id));
    }

    @PostMapping("/team/create")
    public ResponseEntity<TeamDto> createTeam(@RequestBody CreateTeamRequest request, @RequestParam String userId) {
        return ResponseEntity.ok(teamService.createTeam(userId, request));
    }

    @GetMapping("/team/invites")
    public List<TeamDto> getMyInvites(@RequestParam String userId) {
        return teamService.getMyInvites(userId);
    }

    @PostMapping("/team/{id}/invite")
    public ResponseEntity<?> inviteMember(@PathVariable String id, @RequestBody InviteRequest request) {
        teamService.inviteMember(id, request.getEmail());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/team/{id}/accept")
    public ResponseEntity<?> acceptInvite(@PathVariable String id, @RequestParam String userId) {
        teamService.acceptInvite(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/team/{id}/leave")
    public ResponseEntity<?> leaveTeam(@PathVariable String id, @RequestParam String userId) {
        teamService.leaveTeam(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/team/{id}/submit")
    public ResponseEntity<?> submitProject(@PathVariable String id, @RequestBody SubmissionRequest request) {
        teamService.submitProject(id, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/team/{id}/chat")
    public ResponseEntity<?> sendChatMessage(@PathVariable String id, @RequestBody Map<String, String> payload, @RequestParam String userId) {
        String content = payload.get("content");
        String type = payload.get("type"); // TEXT, IMAGE, FILE
        
        // Find or create the team chat room correctly
        com.eventmanager.model.ChatRoom room = chatService.getOrCreateRoom("TEAM", id, "TEAM_" + id);
        
        com.eventmanager.model.ChatMessage message = chatService.saveMessage(room.getId(), userId, content, type);
        messagingTemplate.convertAndSend("/topic/messages/TEAM_" + id, message);
        
        return ResponseEntity.ok(message);
    }
}
