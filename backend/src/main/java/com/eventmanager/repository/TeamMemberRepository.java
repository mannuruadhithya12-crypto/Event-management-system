package com.eventmanager.repository;

import com.eventmanager.model.Team;
import com.eventmanager.model.TeamMember;
import com.eventmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, String> {
    List<TeamMember> findByTeamId(String teamId);

    Optional<TeamMember> findByTeamAndUser(Team team, User user);

    List<TeamMember> findByUserId(String userId);
}
