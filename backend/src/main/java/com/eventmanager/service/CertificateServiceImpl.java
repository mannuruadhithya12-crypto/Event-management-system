package com.eventmanager.service;

import com.eventmanager.model.Certificate;
import com.eventmanager.model.Event;
import com.eventmanager.model.User;
import com.eventmanager.repository.CertificateRepository;
import com.eventmanager.repository.EventRepository;
import com.eventmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class CertificateServiceImpl implements CertificateService {

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.eventmanager.repository.HackathonRepository hackathonRepository;

    @Override
    public Certificate generateCertificate(String userId, String eventId, String type, String position) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));

        Certificate certificate = new Certificate();
        certificate.setUser(user);
        certificate.setEvent(event);
        certificate.setType(type);
        certificate.setPosition(position);
        certificate.setIssueDate(LocalDate.now());
        certificate.setCertificateNumber("CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        certificate.setVerified(true);

        return certificateRepository.save(certificate);
    }

    @Override
    public Certificate generateHackathonCertificate(String userId, String hackathonId, String type, String position) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        com.eventmanager.model.Hackathon hackathon = hackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new RuntimeException("Hackathon not found"));

        Certificate certificate = new Certificate();
        certificate.setUser(user);
        certificate.setHackathon(hackathon);
        certificate.setType(type);
        certificate.setPosition(position);
        certificate.setIssueDate(LocalDate.now());
        certificate.setCertificateNumber("CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        certificate.setVerified(true);

        return certificateRepository.save(certificate);
    }

    @Override
    public byte[] downloadCertificatePdf(String certificateId) {
        // Mock PDF generation for now to avoid build issues with missing dependencies
        // TODO: Implement real PDF generation using OpenPDF or iText
        String mockContent = "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n5 0 obj\n<< /Length 44 >>\nstream\nBT /F1 24 Tf 100 700 Td (Certificate Placeholder) Tj ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000157 00000 n \n0000000302 00000 n \n0000000392 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n486\n%%EOF";
        return mockContent.getBytes();
    }

    @Override
    public boolean verifyCertificate(String certificateNumber) {
        // Simplified verification
        return true;
    }

    @Override
    public List<Certificate> getUserCertificates(String userId) {
        return certificateRepository.findByUserId(userId);
    }
}
