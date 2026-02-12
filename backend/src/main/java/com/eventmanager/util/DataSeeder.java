package com.eventmanager.util;

import com.eventmanager.model.*;
import com.eventmanager.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.Arrays;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CollegeRepository collegeRepository;
    private final UserRepository userRepository;
    private final HackathonRepository hackathonRepository;
    private final EventRepository eventRepository;

    public DataSeeder(CollegeRepository collegeRepository, UserRepository userRepository,
            HackathonRepository hackathonRepository, EventRepository eventRepository) {
        this.collegeRepository = collegeRepository;
        this.userRepository = userRepository;
        this.hackathonRepository = hackathonRepository;
        this.eventRepository = eventRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (collegeRepository.count() > 0)
            return;

        // Seed Colleges
        College c1 = new College();
        c1.setName("Tech University");
        c1.setShortName("TU");
        c1.setLocation("San Francisco, CA");
        c1.setDescription("Leading technology university focused on innovation and research.");
        c1.setStudentCount(15000);
        c1.setIsActive(true);
        collegeRepository.save(c1);

        College c2 = new College();
        c2.setName("State College of Engineering");
        c2.setShortName("SCE");
        c2.setLocation("Austin, TX");
        collegeRepository.save(c2);

        // Seed Users matching Frontend Demo Accounts

        // 1. Student
        User student = new User();
        student.setName("Alex Johnson");
        student.setEmail("student@college.edu");
        student.setPassword(new BCryptPasswordEncoder().encode("password"));
        student.setRole("student");
        student.setCollege(c1);
        userRepository.save(student);

        // 2. Faculty
        User faculty = new User();
        faculty.setName("Dr. Sarah Chen");
        faculty.setEmail("faculty@college.edu");
        faculty.setPassword(new BCryptPasswordEncoder().encode("password"));
        faculty.setRole("faculty");
        faculty.setCollege(c1);
        userRepository.save(faculty);

        // 3. College Admin
        User admin = new User();
        admin.setName("Michael Roberts");
        admin.setEmail("admin@college.edu");
        admin.setPassword(new BCryptPasswordEncoder().encode("password"));
        admin.setRole("college_admin");
        admin.setCollege(c1);
        userRepository.save(admin);

        // 4. Super Admin
        User superAdmin = new User();
        superAdmin.setName("Emma Wilson");
        superAdmin.setEmail("super@platform.com");
        superAdmin.setPassword(new BCryptPasswordEncoder().encode("password"));
        superAdmin.setRole("super_admin");
        userRepository.save(superAdmin);

        // 5. Judge
        User judge = new User();
        judge.setName("David Park");
        judge.setEmail("judge@hackathon.com");
        judge.setPassword(new BCryptPasswordEncoder().encode("password"));
        judge.setRole("judge");
        userRepository.save(judge);

        // Seed Hackathons
        Hackathon h1 = new Hackathon();
        h1.setTitle("AI Innovation Challenge 2024");
        h1.setDescription("Join the biggest AI hackathon of the year!");
        h1.setCollege(c1);
        h1.setOrganizer(admin);
        h1.setStartDate(LocalDate.now().plusDays(10));
        h1.setEndDate(LocalDate.now().plusDays(12));
        h1.setStatus("registration_open");
        hackathonRepository.save(h1);

        // Seed Events
        Event e1 = new Event();
        e1.setTitle("Tech Talk: AI Ethics");
        e1.setDescription("Discussion on AI Ethics.");
        e1.setCollege(c1);
        e1.setOrganizer(admin);
        e1.setStartDate(LocalDateTime.now().plusDays(5));
        e1.setEndDate(LocalDateTime.now().plusDays(5).plusHours(2));
        e1.setEventType("tech_talk");
        e1.setStatus("registration_open");
        eventRepository.save(e1);

        System.out.println("Database seeded successfully with demo accounts!");
    }
}
