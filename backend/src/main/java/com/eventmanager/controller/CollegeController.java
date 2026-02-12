package com.eventmanager.controller;

import com.eventmanager.model.College;
import com.eventmanager.repository.CollegeRepository;
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
    public List<College> getAllColleges() {
        return collegeRepository.findAll();
    }

    @GetMapping("/{id}")
    public College getCollege(@PathVariable String id) {
        return collegeRepository.findById(id).orElse(null);
    }
}
