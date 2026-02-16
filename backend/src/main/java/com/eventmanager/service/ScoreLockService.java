package com.eventmanager.service;

import com.eventmanager.model.Event;
import com.eventmanager.model.ScoreLock;
import com.eventmanager.model.User;
import com.eventmanager.repository.EventRepository;
import com.eventmanager.repository.ScoreLockRepository;
import com.eventmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ScoreLockService {

    @Autowired
    private ScoreLockRepository scoreLockRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return userRepository.findByEmail(((UserDetails) principal).getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("Not authenticated");
    }

    @Transactional
    public ScoreLock lockEventScores(String eventId) {
        User hod = getCurrentUser(); // Assuming HOD calling this
        // Verify HOD logic or subRole logic here? Or rely on PreAuthorize in
        // Controller.

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Optional<ScoreLock> existingLock = scoreLockRepository.findByEventId(eventId);
        if (existingLock.isPresent()) {
            ScoreLock lock = existingLock.get();
            lock.setIsLocked(true);
            lock.setLockedBy(hod);
            lock.setLockedAt(java.time.LocalDateTime.now());
            return scoreLockRepository.save(lock);
        }

        ScoreLock newLock = new ScoreLock();
        newLock.setEvent(event);
        newLock.setLockedBy(hod);
        newLock.setIsLocked(true);
        newLock.setLockedAt(java.time.LocalDateTime.now());

        ScoreLock result = scoreLockRepository.save(newLock);

        // Trigger Certificate Generation and Announcement
        System.out.println("Triggering Certificate Generation for Event: " + eventId);
        // In a real system: certificateService.generateForEvent(eventId);

        return result;
    }

    public boolean isEventLocked(String eventId) {
        return scoreLockRepository.findByEventId(eventId)
                .map(ScoreLock::getIsLocked)
                .orElse(false);
    }
}
