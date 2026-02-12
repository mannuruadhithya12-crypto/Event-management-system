package com.eventmanager.controller;

import com.eventmanager.model.Webinar;
import com.eventmanager.service.WebinarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/webinars")
@CrossOrigin(origins = "*")
public class WebinarController {

    @Autowired
    private WebinarService webinarService;

    @PostMapping
    public ResponseEntity<Webinar> createWebinar(@RequestBody Webinar webinar) {
        return ResponseEntity.ok(webinarService.createWebinar(webinar));
    }

    @GetMapping
    public ResponseEntity<List<Webinar>> getAllWebinars() {
        return ResponseEntity.ok(webinarService.getAllWebinars());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Webinar> getWebinarById(@PathVariable String id) {
        return webinarService.getWebinarById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/college/{collegeId}")
    public ResponseEntity<List<Webinar>> getWebinarsByCollege(@PathVariable String collegeId) {
        return ResponseEntity.ok(webinarService.getWebinarsByCollege(collegeId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWebinar(@PathVariable String id) {
        webinarService.deleteWebinar(id);
        return ResponseEntity.noContent().build();
    }
}
