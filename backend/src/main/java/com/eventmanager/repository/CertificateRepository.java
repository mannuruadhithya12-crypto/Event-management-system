package com.eventmanager.repository;

import com.eventmanager.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, String> {
    List<Certificate> findByUserId(String userId);
    java.util.Optional<Certificate> findByCertificateId(String certificateId);
    long countByIssuerId(String issuerId);
    long countByUserId(String userId);
    boolean existsByUserIdAndEventId(String userId, String eventId);
    org.springframework.data.domain.Page<Certificate> findByIssuerId(String issuerId, org.springframework.data.domain.Pageable pageable);
    java.util.Optional<Certificate> findByCertificateIdAndVerificationCode(String certificateId, String verificationCode);
}
