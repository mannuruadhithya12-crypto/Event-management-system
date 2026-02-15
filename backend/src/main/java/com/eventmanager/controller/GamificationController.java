package com.eventmanager.controller;

import com.eventmanager.dto.ApiResponse;
import com.eventmanager.model.Badge;
import com.eventmanager.model.UserBadge;
import com.eventmanager.service.GamificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/gamification")
public class GamificationController {

    @Autowired
    private GamificationService gamificationService;

    @PostMapping("/award")
    public ResponseEntity<ApiResponse<Void>> awardBadge(@RequestParam String userId, @RequestParam String badgeName) {
        gamificationService.awardBadge(userId, badgeName);
        return ResponseEntity.ok(ApiResponse.success("Badge awarded", null));
    }

    @GetMapping("/badges/user/{userId}")
    public ResponseEntity<ApiResponse<List<UserBadge>>> getUserBadges(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.success(gamificationService.getUserBadges(userId)));
    }

    @GetMapping("/badges")
    public ResponseEntity<ApiResponse<List<Badge>>> getAllBadges() {
        return ResponseEntity.ok(ApiResponse.success(gamificationService.getAllBadges()));
    }
}
