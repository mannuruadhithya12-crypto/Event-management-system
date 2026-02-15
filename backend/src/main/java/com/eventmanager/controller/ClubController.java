package com.eventmanager.controller;

import com.eventmanager.dto.ApiResponse;
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
    public ResponseEntity<ApiResponse<List<ClubDto>>> getAllClubs() {
        return ResponseEntity.ok(ApiResponse.success(clubService.getAllClubs().stream().map(this::convertToDto).collect(Collectors.toList())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClubDto>> getClubById(@PathVariable String id) {
        return clubService.getClubById(id)
                .map(this::convertToDto)
                .map(dto -> ResponseEntity.ok(ApiResponse.success(dto)))
                .orElse(ResponseEntity.status(404).body(ApiResponse.error("Club not found")));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClubDto>> createClub(@RequestBody ClubDto clubDto) {
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
        return ResponseEntity.ok(ApiResponse.success(convertToDto(savedClub)));
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
    public ResponseEntity<ApiResponse<ClubAnnouncement>> createAnnouncement(
            @PathVariable String id,
            @RequestParam String authorId,
            @RequestParam String title,
            @RequestParam String content) {
        return ResponseEntity.ok(ApiResponse.success(clubService.createAnnouncement(id, authorId, title, content)));
    }

    @GetMapping("/{id}/announcements")
    public ResponseEntity<ApiResponse<List<ClubAnnouncement>>> getClubAnnouncements(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(clubService.getClubAnnouncements(id)));
    }

    // Memberships
    @PostMapping("/{id}/join-legacy")
    public ResponseEntity<ApiResponse<ClubMembership>> joinClubLegacy(@PathVariable String id, @RequestParam String userId) {
        return ResponseEntity.ok(ApiResponse.success(clubService.joinClub(id, userId)));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<ApiResponse<List<ClubMembership>>> getClubMembers(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(clubService.getClubMembers(id)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ClubMembership>>> getUserClubs(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.success(clubService.getUserClubs(userId)));
    }

    @PutMapping("/memberships/{membershipId}/role")
    public ResponseEntity<ApiResponse<Void>> updateMembershipRole(@PathVariable String membershipId, @RequestParam String role) {
        if (membershipId != null && role != null) {
            clubService.updateMembershipRole(membershipId, role);
        }
        return ResponseEntity.ok(ApiResponse.success("Role updated successfully", null));
    }

    // Recruitment Notices
    @PostMapping("/{id}/recruitments")
    public ResponseEntity<ApiResponse<RecruitmentNotice>> createRecruitment(
            @PathVariable String id,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String role,
            @RequestParam String requirements,
            @RequestParam String deadline) {
        return ResponseEntity.ok(ApiResponse.success(clubService.createRecruitmentNotice(id, title, description, role, requirements,
                java.time.LocalDateTime.parse(deadline))));
    }

    @GetMapping("/{id}/recruitments")
    public ResponseEntity<ApiResponse<List<RecruitmentNotice>>> getClubRecruitments(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(clubService.getClubRecruitmentNotices(id)));
    }

    @GetMapping("/recruitments/open")
    public ResponseEntity<ApiResponse<List<RecruitmentNotice>>> getAllOpenRecruitments() {
        return ResponseEntity.ok(ApiResponse.success(clubService.getAllOpenRecruitments()));
    }

    // Join Requests
    @PostMapping("/{id}/join-requests")
    public ResponseEntity<ApiResponse<ClubJoinRequest>> submitJoinRequest(
            @PathVariable String id,
            @RequestParam String userId,
            @RequestBody String message) {
        return ResponseEntity.ok(ApiResponse.success(clubService.submitJoinRequest(id, userId, message)));
    }

    @GetMapping("/{id}/join-requests")
    public ResponseEntity<ApiResponse<List<ClubJoinRequest>>> getClubJoinRequests(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(clubService.getClubJoinRequests(id)));
    }

    @PutMapping("/join-requests/{requestId}/status")
    public ResponseEntity<ApiResponse<ClubJoinRequest>> updateJoinRequestStatus(
            @PathVariable String requestId,
            @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success(clubService.updateJoinRequestStatus(requestId, status)));
    }
}
