package com.eventmanager.service;

import com.eventmanager.model.Certificate;
import java.util.List;

public interface CertificateService {
    Certificate generateCertificate(String userId, String eventId, String type, String position);

    Certificate generateHackathonCertificate(String userId, String hackathonId, String type, String position);

    byte[] downloadCertificatePdf(String certificateId);

    boolean verifyCertificate(String certificateNumber);

    List<Certificate> getUserCertificates(String userId);
}
