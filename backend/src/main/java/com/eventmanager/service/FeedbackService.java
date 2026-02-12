package com.eventmanager.service;

import com.eventmanager.model.EventFeedback;
import java.util.List;

public interface FeedbackService {
    EventFeedback submitFeedback(String eventId, String userId, Integer rating, String comment, String suggestions);

    List<EventFeedback> getEventFeedback(String eventId);

    Double getAverageRating(String eventId);
}
