package com.eventmanager.controller;

import com.eventmanager.model.Badge;
import com.eventmanager.model.UserBadge;
import com.eventmanager.service.GamificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/gamification")
@CrossOrigin(origins = "*")
public class GamificationController {

    @Autowired
    private GamificationService gamificationService;

    @PostMapping("/award")
    public ResponseEntity<Void> awardBadge(@RequestParam String userId, @RequestParam String badgeName) {
        gamificationService.awardBadge(userId, badgeName);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/badges/user/{userId}")
    public ResponseEntity<List<UserBadge>> getUserBadges(@PathVariable String userId) {
        return ResponseEntity.ok(gamificationService.getUserBadges(userId));
    }

    @GetMapping("/badges")
    public ResponseEntity<List<Badge>> getAllBadges() {
        return ResponseEntity.ok(gamificationService.getAllBadges());
    }
}
