package com.eventmanager.controller;

import com.eventmanager.model.Event;
import com.eventmanager.model.EventRegistration;
import com.eventmanager.repository.EventRepository;
import com.eventmanager.repository.EventRegistrationRepository;
import com.eventmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
public class EventController {
    
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventRepository.save(event);
    }

    // Register for an event
    @PostMapping("/{eventId}/register")
    public ResponseEntity<?> registerForEvent(@PathVariable String eventId, @RequestParam String userId) {
        if (!eventRepository.existsById(eventId)) {
            return ResponseEntity.notFound().build();
        }
        
        com.eventmanager.model.User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Event event = eventRepository.findById(eventId).get();
        
        // Check if already registered
        boolean alreadyRegistered = eventRegistrationRepository.findByEventId(eventId).stream()
            .anyMatch(r -> r.getUser().getId().equals(userId));
            
        if (alreadyRegistered) {
            return ResponseEntity.badRequest().body("Already registered");
        }

        EventRegistration registration = new EventRegistration();
        registration.setEvent(event);
        registration.setUser(user);
        eventRegistrationRepository.save(registration);

        // Update count
        event.setRegisteredCount(event.getRegisteredCount() + 1);
        eventRepository.save(event);

        return ResponseEntity.ok("Registered successfully");
    }

    // Get events registered by student
    @GetMapping("/student/{userId}")
    public List<Event> getEventsByStudent(@PathVariable String userId) {
        return eventRegistrationRepository.findByUserId(userId).stream()
            .map(EventRegistration::getEvent)
            .collect(Collectors.toList());
    }

    // Get events organized by faculty
    @GetMapping("/organizer/{organizerId}")
    public List<Event> getEventsByOrganizer(@PathVariable String organizerId) {
        return eventRepository.findAll().stream()
            .filter(e -> e.getOrganizer() != null && e.getOrganizer().getId().equals(organizerId))
            .collect(Collectors.toList());
    }
}
