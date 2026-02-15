package com.eventmanager.controller;

import com.eventmanager.dto.ApiResponse;
import com.eventmanager.model.*;
import com.eventmanager.repository.*;
import com.eventmanager.service.HackathonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hackathons")
public class HackathonController {

    private final HackathonService hackathonService;
    private final HackathonRepository hackathonRepository;
    private final UserRepository userRepository;
    private final BookmarkRepository bookmarkRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    public HackathonController(HackathonService hackathonService,
                               HackathonRepository hackathonRepository,
                               UserRepository userRepository,
                               BookmarkRepository bookmarkRepository,
                               org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.hackathonService = hackathonService;
        this.hackathonRepository = hackathonRepository;
        this.userRepository = userRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Hackathon>>> getAllHackathons() {
        return ResponseEntity.ok(ApiResponse.success(hackathonService.getAllHackathons()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Hackathon>> createHackathon(@RequestBody Hackathon hackathon) {
        return ResponseEntity.ok(ApiResponse.success(hackathonService.createHackathon(hackathon)));
    }

    @GetMapping("/student/{userId}")
    public ResponseEntity<ApiResponse<List<Hackathon>>> getHackathonsByStudent(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.success(hackathonService.getHackathonsByStudent(userId)));
    }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<ApiResponse<List<Hackathon>>> getHackathonsByOrganizer(@PathVariable String organizerId) {
        return ResponseEntity.ok(ApiResponse.success(hackathonService.getHackathonsByOrganizer(organizerId)));
    }

    @GetMapping("/student/{userId}/registered")
    public ResponseEntity<ApiResponse<List<Hackathon>>> getRegisteredHackathons(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.success(hackathonService.getRegisteredHackathons(userId)));
    }

    @GetMapping("/student/{userId}/completed")
    public ResponseEntity<ApiResponse<List<Hackathon>>> getCompletedHackathons(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.success(hackathonService.getCompletedHackathons(userId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Hackathon>> getHackathonById(@PathVariable String id) {
        return hackathonService.getHackathonById(id)
                .map(h -> ResponseEntity.ok(ApiResponse.success(h)))
                .orElse(ResponseEntity.status(404).body(ApiResponse.error("Hackathon not found")));
    }

    @GetMapping("/{id}/problem-statements")
    public ResponseEntity<ApiResponse<List<ProblemStatement>>> getProblemStatements(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(hackathonService.getProblemStatements(id)));
    }

    @PostMapping("/{id}/problem-statements")
    public ResponseEntity<ApiResponse<ProblemStatement>> addProblemStatement(@PathVariable String id, @RequestBody ProblemStatement problemStatement) {
        return ResponseEntity.ok(ApiResponse.success(hackathonService.addProblemStatement(id, problemStatement)));
    }

    @PostMapping("/{id}/teams")
    public ResponseEntity<ApiResponse<Team>> createTeam(@PathVariable String id, @RequestBody Map<String, String> payload) {
        try {
            return ResponseEntity.ok(ApiResponse.success(hackathonService.createTeam(id, payload.get("name"), payload.get("leaderId"))));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{id}/teams/join")
    public ResponseEntity<ApiResponse<Team>> joinTeam(@PathVariable String id, @RequestBody Map<String, String> payload) {
        try {
            return ResponseEntity.ok(ApiResponse.success(hackathonService.joinTeam(id, payload.get("userId"), payload.get("joinCode"))));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}/my-team")
    public ResponseEntity<ApiResponse<Team>> getMyTeam(@PathVariable String id, @RequestParam String userId) {
        return hackathonService.getTeamByUser(id, userId)
                .map(t -> ResponseEntity.ok(ApiResponse.success(t)))
                .orElse(ResponseEntity.ok(ApiResponse.success(null)));
    }

    @GetMapping("/teams/student/{userId}")
    public ResponseEntity<ApiResponse<List<Team>>> getTeamsByStudent(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.success(hackathonService.getTeamsByStudent(userId)));
    }

    @GetMapping("/teams/{teamId}/members")
    public ResponseEntity<ApiResponse<List<TeamMember>>> getTeamMembers(@PathVariable String teamId) {
        return ResponseEntity.ok(ApiResponse.success(hackathonService.getTeamMembers(teamId)));
    }

    @GetMapping("/{id}/results")
    public ResponseEntity<ApiResponse<List<HackathonResult>>> getResults(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(hackathonService.getResults(id)));
    }

    @PostMapping("/{id}/results")
    public ResponseEntity<ApiResponse<Void>> publishResults(@PathVariable String id, @RequestBody List<HackathonResult> results) {
        hackathonService.publishResults(id, results);
        return ResponseEntity.ok(ApiResponse.success("Results published successfully", null));
    }

    @GetMapping("/recommendations/{userId}")
    public ResponseEntity<ApiResponse<List<Hackathon>>> getRecommendations(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.success(hackathonService.getRecommendations(userId)));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<Hackathon>>> filterHackathons(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String mode,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(hackathonService.getHackathons(search, country, mode, status, tags, pageable)));
    }

    @PostMapping("/{id}/bookmark")
    public ResponseEntity<ApiResponse<Map<String, String>>> toggleBookmark(@PathVariable String id, @RequestParam String userId) {
        try {
            Hackathon hackathon = hackathonRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

            Optional<Bookmark> existing = bookmarkRepository.findByUserIdAndHackathonId(userId, id);
            if (existing.isPresent()) {
                bookmarkRepository.delete(existing.get());
                return ResponseEntity.ok(ApiResponse.success(Map.of("message", "removed")));
            } else {
                Bookmark b = new Bookmark();
                b.setHackathon(hackathon);
                b.setUser(user);
                bookmarkRepository.save(b);
                return ResponseEntity.ok(ApiResponse.success(Map.of("message", "added")));
            }
        } catch (Exception e) {
             return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/bookmarks")
    public ResponseEntity<ApiResponse<List<Hackathon>>> getBookmarks(@RequestParam String userId) {
        List<Hackathon> bookmarks = bookmarkRepository.findByUserId(userId).stream()
                .map(Bookmark::getHackathon)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(bookmarks));
    }

    @PostMapping("/seed")
    public ResponseEntity<ApiResponse<Map<String, Object>>> seedHackathons() {
        // Seed Users first if none exist
        if (userRepository.count() == 0) {
            com.eventmanager.model.User student = new com.eventmanager.model.User();
            student.setName("Adhithya ram");
            student.setEmail("student@test.com");
            student.setPassword(passwordEncoder.encode("password"));
            student.setRole("student");
            student.setJoinedAt(java.time.LocalDateTime.now());
            userRepository.save(student);

            com.eventmanager.model.User admin = new com.eventmanager.model.User();
            admin.setName("Admin User");
            admin.setEmail("admin@test.com");
            admin.setPassword(passwordEncoder.encode("password"));
            admin.setRole("admin");
            admin.setJoinedAt(java.time.LocalDateTime.now());
            userRepository.save(admin);

            com.eventmanager.model.User rocky = new com.eventmanager.model.User();
            rocky.setName("Rocky");
            rocky.setEmail("rocky@nexus.com");
            rocky.setPassword(passwordEncoder.encode("password"));
            rocky.setRole("student");
            rocky.setJoinedAt(java.time.LocalDateTime.now());
            userRepository.save(rocky);

            com.eventmanager.model.User john = new com.eventmanager.model.User();
            john.setName("john cena");
            john.setEmail("johncena@nexus.com");
            john.setPassword(passwordEncoder.encode("password"));
            john.setRole("student");
            john.setJoinedAt(java.time.LocalDateTime.now());
            userRepository.save(john);
        }

        if (hackathonRepository.count() > 5) return ResponseEntity.ok(ApiResponse.success(Map.of("message", "Users seeded (if missing), Hackathons already seeded")));

        String[] titles = {"AI Revolution Hack", "Web3 Summit", "GreenTech Challenge", "FinTech Disrupt", "HealthHacks 2024"};
        String[] countries = {"India", "USA", "UK", "Canada", "Singapore"};
        String[] modes = {"Online", "Offline", "Hybrid"};
        String[] statuses = {"OPEN", "CLOSED", "ONGOING", "COMPLETED"};

        for (int i = 0; i < 25; i++) {
            Hackathon h = new Hackathon();
            h.setTitle(titles[i % 5] + " " + (i + 1));
            h.setDescription("Join the ultimate coding battle to solve real-world problems.");
            h.setBannerImage("https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&w=800&q=60");
            h.setCountry(countries[i % 5]);
            h.setMode(modes[i % 3]);
            h.setStatus(statuses[i % 4]);
            h.setTags(Arrays.asList("AI", "Blockchain", "Cloud"));
            h.setPrizePool((i + 1) * 1000 + " USD");
            h.setMaxTeamSize(4);
            h.setMinTeamSize(2);
            h.setStartDate(LocalDate.now().plusDays(i * 2));
            h.setEndDate(LocalDate.now().plusDays(i * 2 + 2));
            h.setRegistrationDeadline(LocalDate.now().plusDays(i * 2 - 1));
            hackathonRepository.save(h);
        }
        return ResponseEntity.ok(ApiResponse.success(Map.of("message", "Seeded 25 hackathons", "count", 25)));
    }

    @PostMapping("/seed-registrations")
    public ResponseEntity<ApiResponse<Map<String, String>>> seedRegistrations(@RequestParam String userId) {
        try {
            hackathonService.seedStudentRegistrations(userId);
            return ResponseEntity.ok(ApiResponse.success(Map.of("message", "Seeded registrations for user " + userId)));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error(e.getMessage()));
        }
    }
}
