package com.eventmanager.service;

import com.eventmanager.dto.*;
import java.util.List;
import java.util.Map;

public interface WebinarService {
    List<WebinarDto> getAllWebinars(String userId);
    WebinarDto getWebinar(String id, String userId);
    WebinarDto createWebinar(String userId, CreateWebinarRequest request);
    WebinarDto updateWebinar(String id, CreateWebinarRequest request);
    void deleteWebinar(String id);
    void cancelWebinar(String id);
    
    void registerForWebinar(String userId, String webinarId);
    void unregisterForWebinar(String userId, String webinarId);
    List<WebinarRegistrationDto> getStudentRegistrations(String userId);
    
    void submitFeedback(String userId, String webinarId, Integer rating, String comment);
    List<WebinarDto> getUpcomingWebinars(String userId);
    
    Map<String, Object> getAnalytics();
    void seedWebinars();
    
    String generateCertificate(String userId, String webinarId);
    byte[] downloadCertificate(String userId, String webinarId);
    String joinWebinar(String userId, String webinarId);
}
