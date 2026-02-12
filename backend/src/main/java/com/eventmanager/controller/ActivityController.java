package com.eventmanager.controller;

import com.eventmanager.model.Activity;
import com.eventmanager.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "*")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Activity>> getUserTimeline(@PathVariable String userId) {
        return ResponseEntity.ok(activityService.getUserTimeline(userId));
    }
}
