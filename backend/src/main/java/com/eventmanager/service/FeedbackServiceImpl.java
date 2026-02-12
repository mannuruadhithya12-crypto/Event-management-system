package com.eventmanager.service;

import com.eventmanager.model.EventFeedback;
import com.eventmanager.model.Event;
import com.eventmanager.model.User;
import com.eventmanager.repository.EventFeedbackRepository;
import com.eventmanager.repository.EventRepository;
import com.eventmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    @Autowired
    private EventFeedbackRepository feedbackRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public EventFeedback submitFeedback(String eventId, String userId, Integer rating, String comment,
            String suggestions) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        EventFeedback feedback = new EventFeedback();
        feedback.setEvent(event);
        feedback.setStudent(user);
        feedback.setRating(rating);
        feedback.setComment(comment);
        feedback.setSuggestions(suggestions);

        return feedbackRepository.save(feedback);
    }

    @Override
    public List<EventFeedback> getEventFeedback(String eventId) {
        return feedbackRepository.findByEventId(eventId);
    }

    @Override
    public Double getAverageRating(String eventId) {
        List<EventFeedback> feedbacks = feedbackRepository.findByEventId(eventId);
        if (feedbacks.isEmpty())
            return 0.0;
        return feedbacks.stream().mapToInt(EventFeedback::getRating).average().orElse(0.0);
    }
}
