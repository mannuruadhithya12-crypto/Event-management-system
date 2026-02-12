package com.eventmanager.controller;

import com.eventmanager.dto.ClubDto;
import com.eventmanager.model.*;
import com.eventmanager.repository.CollegeRepository;
import com.eventmanager.repository.UserRepository;
import com.eventmanager.service.ClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    @Autowired
    private ClubService clubService;

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<ClubDto> getAllClubs() {
        return clubService.getAllClubs().stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClubDto> getClubById(@PathVariable String id) {
        return clubService.getClubById(id)
                .map(this::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ClubDto> createClub(@RequestBody ClubDto clubDto) {
        Club club = new Club();
        club.setName(clubDto.getName());
        club.setDescription(clubDto.getDescription());
        club.setBannerUrl(clubDto.getBannerUrl());
        club.setLogoUrl(clubDto.getLogoUrl());
        club.setCategory(clubDto.getCategory());
        club.setTags(clubDto.getTags());
        club.setAchievements(clubDto.getAchievements());

        College college = collegeRepository.findById(clubDto.getCollegeId())
                .orElseThrow(() -> new RuntimeException("College not found"));
        club.setCollege(college);

        if (clubDto.getFacultyAdvisorId() != null) {
            User advisor = userRepository.findById(clubDto.getFacultyAdvisorId())
                    .orElseThrow(() -> new RuntimeException("Advisor not found"));
            club.setFacultyAdvisor(advisor);
        }

        if (clubDto.getPresidentId() != null) {
            User president = userRepository.findById(clubDto.getPresidentId())
                    .orElseThrow(() -> new RuntimeException("President not found"));
            club.setPresident(president);
        }

        Club savedClub = clubService.createClub(club);
        return ResponseEntity.ok(convertToDto(savedClub));
    }

    // Helper method to convert Entity to DTO
    private ClubDto convertToDto(Club club) {
        ClubDto dto = new ClubDto();
        dto.setId(club.getId());
        dto.setName(club.getName());
        dto.setDescription(club.getDescription());
        dto.setBannerUrl(club.getBannerUrl());
        dto.setLogoUrl(club.getLogoUrl());
        dto.setCategory(club.getCategory());
        dto.setTags(club.getTags());
        dto.setAchievements(club.getAchievements());
        dto.setActive(club.isActive());
        dto.setCreatedAt(club.getCreatedAt());

        if (club.getCollege() != null) {
            dto.setCollegeId(club.getCollege().getId());
            dto.setCollegeName(club.getCollege().getName());
        }

        if (club.getFacultyAdvisor() != null) {
            dto.setFacultyAdvisorId(club.getFacultyAdvisor().getId());
            dto.setFacultyAdvisorName(club.getFacultyAdvisor().getName());
        }

        if (club.getPresident() != null) {
            dto.setPresidentId(club.getPresident().getId());
            dto.setPresidentName(club.getPresident().getName());
        }

        return dto;
    }

    // Announcements
    @PostMapping("/{id}/announcements")
    public ResponseEntity<ClubAnnouncement> createAnnouncement(
            @PathVariable String id,
            @RequestParam String authorId,
            @RequestParam String title,
            @RequestParam String content) {
        return ResponseEntity.ok(clubService.createAnnouncement(id, authorId, title, content));
    }

    @GetMapping("/{id}/announcements")
    public ResponseEntity<List<ClubAnnouncement>> getClubAnnouncements(@PathVariable String id) {
        return ResponseEntity.ok(clubService.getClubAnnouncements(id));
    }

    // Memberships
    @PostMapping("/{id}/join-legacy")
    public ResponseEntity<ClubMembership> joinClubLegacy(@PathVariable String id, @RequestParam String userId) {
        return ResponseEntity.ok(clubService.joinClub(id, userId));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<ClubMembership>> getClubMembers(@PathVariable String id) {
        return ResponseEntity.ok(clubService.getClubMembers(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ClubMembership>> getUserClubs(@PathVariable String userId) {
        return ResponseEntity.ok(clubService.getUserClubs(userId));
    }

    @PutMapping("/memberships/{membershipId}/role")
    public ResponseEntity<Void> updateMembershipRole(@PathVariable String membershipId, @RequestParam String role) {
        if (membershipId != null && role != null) {
            clubService.updateMembershipRole(membershipId, role);
        }
        return ResponseEntity.ok().build();
    }

    // Recruitment Notices
    @PostMapping("/{id}/recruitments")
    public ResponseEntity<RecruitmentNotice> createRecruitment(
            @PathVariable String id,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String role,
            @RequestParam String requirements,
            @RequestParam String deadline) {
        return ResponseEntity.ok(clubService.createRecruitmentNotice(id, title, description, role, requirements,
                java.time.LocalDateTime.parse(deadline)));
    }

    @GetMapping("/{id}/recruitments")
    public ResponseEntity<List<RecruitmentNotice>> getClubRecruitments(@PathVariable String id) {
        return ResponseEntity.ok(clubService.getClubRecruitmentNotices(id));
    }

    @GetMapping("/recruitments/open")
    public ResponseEntity<List<RecruitmentNotice>> getAllOpenRecruitments() {
        return ResponseEntity.ok(clubService.getAllOpenRecruitments());
    }

    // Join Requests
    @PostMapping("/{id}/join-requests")
    public ResponseEntity<ClubJoinRequest> submitJoinRequest(
            @PathVariable String id,
            @RequestParam String userId,
            @RequestBody String message) {
        return ResponseEntity.ok(clubService.submitJoinRequest(id, userId, message));
    }

    @GetMapping("/{id}/join-requests")
    public ResponseEntity<List<ClubJoinRequest>> getClubJoinRequests(@PathVariable String id) {
        return ResponseEntity.ok(clubService.getClubJoinRequests(id));
    }

    @PutMapping("/join-requests/{requestId}/status")
    public ResponseEntity<ClubJoinRequest> updateJoinRequestStatus(
            @PathVariable String requestId,
            @RequestParam String status) {
        return ResponseEntity.ok(clubService.updateJoinRequestStatus(requestId, status));
    }
}
