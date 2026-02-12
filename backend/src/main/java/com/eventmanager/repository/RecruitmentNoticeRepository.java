package com.eventmanager.repository;

import com.eventmanager.model.RecruitmentNotice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecruitmentNoticeRepository extends JpaRepository<RecruitmentNotice, String> {
    List<RecruitmentNotice> findByClubIdOrderByCreatedAtDesc(String clubId);

    List<RecruitmentNotice> findByStatusOrderByCreatedAtDesc(String status);
}
