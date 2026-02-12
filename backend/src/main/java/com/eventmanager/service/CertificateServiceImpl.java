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
        // Mock PDF generation logic
        return "PDF content for certificate".getBytes();
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
