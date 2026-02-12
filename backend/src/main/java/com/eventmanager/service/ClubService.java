package com.eventmanager.service;

import com.eventmanager.model.Club;
import com.eventmanager.model.ClubAnnouncement;
import com.eventmanager.model.ClubMembership;
import com.eventmanager.model.ClubJoinRequest;
import com.eventmanager.model.RecruitmentNotice;
import java.util.List;
import java.util.Optional;

public interface ClubService {
    List<Club> getAllClubs();

    List<Club> getClubsByCollege(String collegeId);

    Optional<Club> getClubById(String id);

    Club createClub(Club club);

    Club updateClub(String id, Club clubDetails);

    void deleteClub(String id);

    // Announcements
    ClubAnnouncement createAnnouncement(String clubId, String authorId, String title, String content);

    List<ClubAnnouncement> getClubAnnouncements(String clubId);

    // Memberships
    ClubMembership joinClub(String clubId, String userId);

    List<ClubMembership> getClubMembers(String clubId);

    List<ClubMembership> getUserClubs(String userId);

    void updateMembershipRole(String membershipId, String role);

    // Recruitment & Join Requests
    RecruitmentNotice createRecruitmentNotice(String clubId, String title, String description, String role,
            String requirements, java.time.LocalDateTime deadline);

    List<RecruitmentNotice> getClubRecruitmentNotices(String clubId);

    List<RecruitmentNotice> getAllOpenRecruitments();

    ClubJoinRequest submitJoinRequest(String clubId, String userId, String message);

    List<ClubJoinRequest> getClubJoinRequests(String clubId);

    ClubJoinRequest updateJoinRequestStatus(String requestId, String status);
}
