package com.eventmanager.service;

import com.eventmanager.model.Complaint;
import com.eventmanager.model.User;
import com.eventmanager.repository.ComplaintRepository;
import com.eventmanager.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class GrievanceServiceImpl implements GrievanceService {
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public GrievanceServiceImpl(ComplaintRepository complaintRepository, UserRepository userRepository) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Complaint submitComplaint(String userId, String type, String subject, String description) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = new Complaint();
        complaint.setReporter(user);
        complaint.setType(type);
        complaint.setSubject(subject);
        complaint.setDescription(description);
        complaint.setStatus("OPEN");
        complaint.setCreatedAt(LocalDateTime.now());

        return complaintRepository.save(complaint);
    }

    @Override
    public List<Complaint> getUserComplaints(String userId) {
        return complaintRepository.findByReporterIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    @Override
    public Complaint updateComplaintStatus(String id, String status, String adminAction) {
        Complaint complaint = getComplaintById(id);
        complaint.setStatus(status);
        complaint.setAdminAction(adminAction);

        if ("RESOLVED".equals(status) || "CLOSED".equals(status)) {
            complaint.setResolvedAt(LocalDateTime.now());
        }

        return complaintRepository.save(complaint);
    }

    @Override
    public Complaint getComplaintById(String id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
    }
}
