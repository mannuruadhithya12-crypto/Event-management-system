package com.eventmanager.config;

import com.eventmanager.model.College;
import com.eventmanager.model.User;
import com.eventmanager.repository.CollegeRepository;
import com.eventmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;

import java.time.LocalDateTime;

@Component
public class DataInitializer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CollegeRepository collegeRepository;

    @PostConstruct
    public void init() {
        // Create demo college if it doesn't exist
        College demoCollege = null;
        if (collegeRepository.count() == 0) {
            demoCollege = new College();
            demoCollege.setName("Tech University");
            demoCollege.setLocation("California, USA");
            demoCollege.setDescription("A leading technology university");
            demoCollege = collegeRepository.save(demoCollege);
            System.out.println("✓ Created demo college: Tech University");
        } else {
            demoCollege = collegeRepository.findAll().get(0);
        }

        // Create demo users if they don't exist
        createDemoUserIfNotExists("student@college.edu", "Alex Johnson", "student", demoCollege, "Computer Science", 3);
        createDemoUserIfNotExists("faculty@college.edu", "Dr. Sarah Chen", "faculty", demoCollege, "Computer Science",
                null);
        createDemoUserIfNotExists("admin@college.edu", "Michael Roberts", "college_admin", demoCollege, null, null);
        createDemoUserIfNotExists("super@platform.com", "Emma Wilson", "super_admin", null, null, null);
        createDemoUserIfNotExists("judge@hackathon.com", "David Park", "judge", null, null, null);

        System.out.println("✓ Demo users initialization complete!");
    }

    private void createDemoUserIfNotExists(String email, String name, String role, College college, String department,
            Integer year) {
        if (!userRepository.existsByEmail(email)) {
            User user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setPassword(passwordEncoder.encode("password")); // BCrypt hash of "password"
            user.setRole(role);
            user.setCollege(college);
            user.setDepartment(department);
            user.setYear(year);
            user.setJoinedAt(LocalDateTime.now());
            user.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=" + name.split(" ")[0]);

            // Set initial points and streak based on role
            switch (role) {
                case "student":
                    user.setPoints(1250);
                    user.setStreak(21);
                    break;
                case "faculty":
                    user.setPoints(500);
                    user.setStreak(5);
                    break;
                case "college_admin":
                    user.setPoints(1000);
                    user.setStreak(10);
                    break;
                case "super_admin":
                    user.setPoints(2000);
                    user.setStreak(30);
                    break;
                case "judge":
                    user.setPoints(800);
                    user.setStreak(15);
                    break;
            }

            userRepository.save(user);
            System.out.println("✓ Created demo user: " + email + " (role: " + role + ")");
        }
    }
}
