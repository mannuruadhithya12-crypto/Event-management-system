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
    private final ClubRepository clubRepository;
    private final ForumPostRepository postRepository;
    private final ForumCommentRepository commentRepository;

    public DataSeeder(CollegeRepository collegeRepository, UserRepository userRepository,
            HackathonRepository hackathonRepository, EventRepository eventRepository,
            ClubRepository clubRepository, ForumPostRepository postRepository,
            ForumCommentRepository commentRepository) {
        this.collegeRepository = collegeRepository;
        this.userRepository = userRepository;
        this.hackathonRepository = hackathonRepository;
        this.eventRepository = eventRepository;
        this.clubRepository = clubRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        College c1;
        College c2;

        if (collegeRepository.count() == 0) {
            // Seed Colleges
            c1 = new College();
            c1.setName("Tech University");
            c1.setShortName("TU");
            c1.setLocation("San Francisco, CA");
            c1.setDescription("Leading technology university focused on innovation and research.");
            c1.setStudentCount(15000);
            c1.setIsActive(true);
            collegeRepository.save(c1);

            c2 = new College();
            c2.setName("State College of Engineering");
            c2.setShortName("SCE");
            c2.setLocation("Austin, TX");
            collegeRepository.save(c2);
        } else {
            c1 = collegeRepository.findByShortName("TU").orElseThrow();
            c2 = collegeRepository.findByShortName("SCE").orElseThrow();
        }

        User student;
        User faculty;
        User admin;

        if (userRepository.count() == 0) {
            // Seed Users matching Frontend Demo Accounts

            // 1. Student
            student = new User();
            student.setName("Alex Johnson");
            student.setEmail("student@college.edu");
            student.setPassword(new BCryptPasswordEncoder().encode("password"));
            student.setRole("student");
            student.setCollege(c1);
            userRepository.save(student);

            // 2. Faculty
            faculty = new User();
            faculty.setName("Dr. Sarah Chen");
            faculty.setEmail("faculty@college.edu");
            faculty.setPassword(new BCryptPasswordEncoder().encode("password"));
            faculty.setRole("faculty");
            faculty.setCollege(c1);
            userRepository.save(faculty);

            // 3. College Admin
            admin = new User();
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
        } else {
            student = userRepository.findByEmail("student@college.edu").orElseThrow();
            faculty = userRepository.findByEmail("faculty@college.edu").orElseThrow();
            admin = userRepository.findByEmail("admin@college.edu").orElseThrow();
        }

        if (hackathonRepository.count() == 0) {
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
        }

        if (eventRepository.count() == 0) {
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
        }

        // Seed Forum Posts and Comments
        if (postRepository.count() == 0) {
            ForumPost p1 = new ForumPost();
            p1.setTitle("Best resources for learning React?");
            p1.setContent("I'm starting with React and looking for good tutorials or courses. Any recommendations?");
            p1.setCategory("Technology");
            p1.setAuthor(student);
            p1.setUpvotes(15);
            p1.setCreatedAt(LocalDateTime.now().minusDays(2));
            ForumPost savedP1 = postRepository.save(p1);

            ForumComment c1_comment = new ForumComment();
            c1_comment.setPost(savedP1);
            c1_comment.setAuthor(faculty);
            c1_comment.setContent("Check out the official documentation, it's very comprehensive.");
            c1_comment.setCreatedAt(LocalDateTime.now().minusDays(1));
            commentRepository.save(c1_comment);

            ForumPost p2 = new ForumPost();
            p2.setTitle("Hackathon Team Building");
            p2.setContent("Looking for teammates for the upcoming AI Hackathon. I'm good with Python and ML.");
            p2.setCategory("Hackathons");
            p2.setAuthor(student);
            p2.setUpvotes(8);
            p2.setCreatedAt(LocalDateTime.now().minusHours(5));
            postRepository.save(p2);
            
            System.out.println("Seeded Forum Posts and Comments");
        }
        Club club1 = new Club();
        club1.setName("AI & Machine Learning Club");
        club1.setDescription("Explore the fascinating world of Artificial Intelligence and Machine Learning. Join us for workshops, hackathons, and research projects in cutting-edge AI technologies.");
        club1.setCollege(c1);
        club1.setFacultyAdvisor(faculty);
        club1.setPresident(student);
        club1.setCategory("Technology");
        club1.setTags("AI,ML,Deep Learning,Neural Networks");
        club1.setBannerUrl("https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800");
        club1.setLogoUrl("https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200");
        club1.setActive(true);
        club1.setAchievements("Winner of National AI Hackathon 2023, Published 5 research papers");
        clubRepository.save(club1);

        Club club2 = new Club();
        club2.setName("Robotics & Automation Society");
        club2.setDescription("Build, program, and compete with robots! From basic Arduino projects to advanced autonomous systems, we cover it all.");
        club2.setCollege(c1);
        club2.setFacultyAdvisor(faculty);
        club2.setPresident(student);
        club2.setCategory("Engineering");
        club2.setTags("Robotics,Automation,Arduino,ROS");
        club2.setBannerUrl("https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800");
        club2.setLogoUrl("https://images.unsplash.com/photo-1563207153-f403bf289096?w=200");
        club2.setActive(true);
        club2.setAchievements("1st Place in RoboCup 2023, 3 International Competitions");
        clubRepository.save(club2);

        Club club3 = new Club();
        club3.setName("Web Development Guild");
        club3.setDescription("Master modern web technologies including React, Node.js, and cloud deployment. Build real-world projects and contribute to open source.");
        club3.setCollege(c1);
        club3.setFacultyAdvisor(faculty);
        club3.setPresident(student);
        club3.setCategory("Technology");
        club3.setTags("Web Dev,React,Node.js,Full Stack");
        club3.setBannerUrl("https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800");
        club3.setLogoUrl("https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=200");
        club3.setActive(true);
        club3.setAchievements("Developed 10+ production apps, 50+ open source contributions");
        clubRepository.save(club3);

        Club club4 = new Club();
        club4.setName("Cybersecurity Alliance");
        club4.setDescription("Learn ethical hacking, network security, and cryptography. Participate in CTF competitions and security audits.");
        club4.setCollege(c1);
        club4.setFacultyAdvisor(faculty);
        club4.setPresident(student);
        club4.setCategory("Security");
        club4.setTags("Cybersecurity,Ethical Hacking,CTF,Cryptography");
        club4.setBannerUrl("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800");
        club4.setLogoUrl("https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=200");
        club4.setActive(true);
        club4.setAchievements("Top 10 in National CTF Championship, 25+ security audits completed");
        clubRepository.save(club4);

        Club club5 = new Club();
        club5.setName("Data Science & Analytics Club");
        club5.setDescription("Dive into data analysis, visualization, and predictive modeling. Work with real datasets and industry partners.");
        club5.setCollege(c1);
        club5.setFacultyAdvisor(faculty);
        club5.setPresident(student);
        club5.setCategory("Data Science");
        club5.setTags("Data Science,Analytics,Python,R,Tableau");
        club5.setBannerUrl("https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800");
        club5.setLogoUrl("https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=200");
        club5.setActive(true);
        club5.setAchievements("Partnered with 5 companies, 15+ data projects completed");
        clubRepository.save(club5);

        Club club6 = new Club();
        club6.setName("Mobile App Developers");
        club6.setDescription("Create amazing mobile experiences for iOS and Android. Learn Flutter, React Native, and native development.");
        club6.setCollege(c2);
        club6.setFacultyAdvisor(faculty);
        club6.setPresident(student);
        club6.setCategory("Technology");
        club6.setTags("Mobile Dev,Flutter,React Native,iOS,Android");
        club6.setBannerUrl("https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800");
        club6.setLogoUrl("https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=200");
        club6.setActive(true);
        club6.setAchievements("20+ apps published, 100K+ downloads");
        clubRepository.save(club6);

        Club club7 = new Club();
        club7.setName("Cloud Computing Enthusiasts");
        club7.setDescription("Master AWS, Azure, and GCP. Learn DevOps, containerization, and serverless architectures.");
        club7.setCollege(c1);
        club7.setFacultyAdvisor(faculty);
        club7.setPresident(student);
        club7.setCategory("Cloud");
        club7.setTags("Cloud,AWS,Azure,DevOps,Kubernetes");
        club7.setBannerUrl("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800");
        club7.setLogoUrl("https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200");
        club7.setActive(true);
        club7.setAchievements("AWS Certified members: 15, 3 cloud migration projects");
        clubRepository.save(club7);

        Club club8 = new Club();
        club8.setName("Blockchain & Crypto Society");
        club8.setDescription("Explore blockchain technology, smart contracts, and decentralized applications. Build the future of Web3.");
        club8.setCollege(c1);
        club8.setFacultyAdvisor(faculty);
        club8.setPresident(student);
        club8.setCategory("Blockchain");
        club8.setTags("Blockchain,Crypto,Web3,Smart Contracts,DeFi");
        club8.setBannerUrl("https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800");
        club8.setLogoUrl("https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=200");
        club8.setActive(true);
        club8.setAchievements("Developed 5 DApps, 2 blockchain research papers");
        clubRepository.save(club8);

        System.out.println("Database seeded successfully with demo accounts and clubs!");
    }
}
