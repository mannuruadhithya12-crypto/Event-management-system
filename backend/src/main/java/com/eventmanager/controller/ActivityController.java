package com.eventmanager.controller;

import com.eventmanager.dto.ApiResponse;
import com.eventmanager.model.Activity;
import com.eventmanager.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Activity>>> getUserTimeline(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.success(activityService.getUserTimeline(userId)));
    }
}
