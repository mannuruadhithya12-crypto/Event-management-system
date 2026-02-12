package com.eventmanager.service;

import com.eventmanager.model.Complaint;
import java.util.List;

public interface GrievanceService {
    Complaint submitComplaint(String userId, String type, String subject, String description);

    List<Complaint> getUserComplaints(String userId);

    List<Complaint> getAllComplaints();

    Complaint updateComplaintStatus(String id, String status, String adminAction);

    Complaint getComplaintById(String id);
}
