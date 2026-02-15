package com.eventmanager.controller;

import com.eventmanager.dto.ApiResponse;
import com.eventmanager.model.College;
import com.eventmanager.repository.CollegeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/colleges")
public class CollegeController {
    private final CollegeRepository collegeRepository;

    public CollegeController(CollegeRepository collegeRepository) {
        this.collegeRepository = collegeRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<College>>> getAllColleges() {
        return ResponseEntity.ok(ApiResponse.success(collegeRepository.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<College>> getCollege(@PathVariable String id) {
        return collegeRepository.findById(id)
                .map(college -> ResponseEntity.ok(ApiResponse.success(college)))
                .orElse(ResponseEntity.status(404).body(ApiResponse.error("College not found")));
    }
}
