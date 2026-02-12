package com.eventmanager.service;

import com.eventmanager.model.*;
import com.eventmanager.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ClubServiceImpl implements ClubService {

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private ClubAnnouncementRepository announcementRepository;

    @Autowired
    private ClubMembershipRepository membershipRepository;

    @Autowired
    private RecruitmentNoticeRepository recruitmentNoticeRepository;

    @Autowired
    private ClubJoinRequestRepository joinRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityService activityService;

    @Autowired
    private NotificationService notificationService;

    @Override
    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    @Override
    public List<Club> getClubsByCollege(String collegeId) {
        return clubRepository.findByCollegeId(collegeId);
    }

    @Override
    public Optional<Club> getClubById(String id) {
        return clubRepository.findById(id);
    }

    @Override
    public Club createClub(Club club) {
        return clubRepository.save(club);
    }

    @Override
    public Club updateClub(String id, Club clubDetails) {
        return clubRepository.findById(id).map(club -> {
            club.setName(clubDetails.getName());
            club.setDescription(clubDetails.getDescription());
            club.setBannerUrl(clubDetails.getBannerUrl());
            club.setLogoUrl(clubDetails.getLogoUrl());
            club.setCategory(clubDetails.getCategory());
            club.setTags(clubDetails.getTags());
            club.setAchievements(clubDetails.getAchievements());
            club.setFacultyAdvisor(clubDetails.getFacultyAdvisor());
            club.setPresident(clubDetails.getPresident());
            club.setActive(clubDetails.isActive());
            return clubRepository.save(club);
        }).orElseThrow(() -> new RuntimeException("Club not found with id " + id));
    }

    @Override
    public void deleteClub(String id) {
        clubRepository.deleteById(id);
    }

    @Override
    public ClubAnnouncement createAnnouncement(String clubId, String authorId, String title, String content) {
        Club club = clubRepository.findById(clubId).orElseThrow(() -> new RuntimeException("Club not found"));
        User author = userRepository.findById(authorId).orElseThrow(() -> new RuntimeException("User not found"));

        ClubAnnouncement announcement = new ClubAnnouncement();
        announcement.setClub(club);
        announcement.setAuthor(author);
        announcement.setTitle(title);
        announcement.setContent(content);

        ClubAnnouncement savedAnnouncement = announcementRepository.save(announcement);

        activityService.logActivity(authorId, "CLUB_POST", "Posted an announcement in " + club.getName(),
                savedAnnouncement.getId(), title);

        return savedAnnouncement;
    }

    @Override
    public List<ClubAnnouncement> getClubAnnouncements(String clubId) {
        return announcementRepository.findByClubIdOrderByCreatedAtDesc(clubId);
    }

    @Override
    public ClubMembership joinClub(String clubId, String userId) {
        Club club = clubRepository.findById(clubId).orElseThrow(() -> new RuntimeException("Club not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        ClubMembership membership = new ClubMembership();
        membership.setClub(club);
        membership.setUser(user);
        membership.setRole("MEMBER");
        membership.setStatus("PENDING");

        ClubMembership savedMembership = membershipRepository.save(membership);

        activityService.logActivity(userId, "JOINED_CLUB", "Joined " + club.getName(),
                club.getId(), club.getName());

        notificationService.createNotification(userId, "Welcome to " + club.getName(),
                "Your membership request is " + membership.getStatus(), "INFO", "CLUB");

        return savedMembership;
    }

    @Override
    public List<ClubMembership> getClubMembers(String clubId) {
        return membershipRepository.findByClubId(clubId);
    }

    @Override
    public List<ClubMembership> getUserClubs(String userId) {
        return membershipRepository.findByUserId(userId);
    }

    @Override
    public void updateMembershipRole(String membershipId, String role) {
        ClubMembership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new RuntimeException("Membership not found"));
        membership.setRole(role);
        membershipRepository.save(membership);
    }

    @Override
    public RecruitmentNotice createRecruitmentNotice(String clubId, String title, String description, String role,
            String requirements, LocalDateTime deadline) {
        Club club = clubRepository.findById(clubId).orElseThrow(() -> new RuntimeException("Club not found"));

        RecruitmentNotice notice = new RecruitmentNotice();
        notice.setClub(club);
        notice.setTitle(title);
        notice.setDescription(description);
        notice.setRole(role);
        notice.setRequirements(requirements);
        notice.setDeadline(deadline);

        RecruitmentNotice savedNotice = recruitmentNoticeRepository.save(notice);
        activityService.logActivity(club.getPresident().getId(), "CLUB_RECRUITMENT",
                "Posted a recruitment notice for " + role + " in " + club.getName(), savedNotice.getId(), title);

        return savedNotice;
    }

    @Override
    public List<RecruitmentNotice> getClubRecruitmentNotices(String clubId) {
        return recruitmentNoticeRepository.findByClubIdOrderByCreatedAtDesc(clubId);
    }

    @Override
    public List<RecruitmentNotice> getAllOpenRecruitments() {
        return recruitmentNoticeRepository.findByStatusOrderByCreatedAtDesc("OPEN");
    }

    @Override
    public ClubJoinRequest submitJoinRequest(String clubId, String userId, String message) {
        Club club = clubRepository.findById(clubId).orElseThrow(() -> new RuntimeException("Club not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        ClubJoinRequest request = new ClubJoinRequest();
        request.setClub(club);
        request.setUser(user);
        request.setMessage(message);

        ClubJoinRequest savedRequest = joinRequestRepository.save(request);
        notificationService.createNotification(club.getPresident().getId(), "New Join Request",
                user.getName() + " wants to join " + club.getName(), "INFO", "CLUB");

        return savedRequest;
    }

    @Override
    public List<ClubJoinRequest> getClubJoinRequests(String clubId) {
        return joinRequestRepository.findByClubIdOrderByCreatedAtDesc(clubId);
    }

    @Override
    public ClubJoinRequest updateJoinRequestStatus(String requestId, String status) {
        ClubJoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status);

        if ("APPROVED".equals(status)) {
            // Automatically add as member
            ClubMembership membership = new ClubMembership();
            membership.setClub(request.getClub());
            membership.setUser(request.getUser());
            membership.setRole("MEMBER");
            membership.setStatus("ACTIVE");
            membershipRepository.save(membership);

            notificationService.createNotification(request.getUser().getId(), "Club Request Approved",
                    "You are now a member of " + request.getClub().getName(), "SUCCESS", "CLUB");
        } else {
            notificationService.createNotification(request.getUser().getId(), "Club Request Update",
                    "Your request to join " + request.getClub().getName() + " was " + status.toLowerCase(), "WARNING",
                    "CLUB");
        }

        return joinRequestRepository.save(request);
    }
}
