package com.eventmanager.controller;

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
    public List<Hackathon> getAllHackathons() {
        return hackathonService.getAllHackathons();
    }

    @PostMapping
    public Hackathon createHackathon(@RequestBody Hackathon hackathon) {
        return hackathonService.createHackathon(hackathon);
    }

    @GetMapping("/student/{userId}")
    public List<Hackathon> getHackathonsByStudent(@PathVariable String userId) {
        return hackathonService.getHackathonsByStudent(userId);
    }

    @GetMapping("/organizer/{organizerId}")
    public List<Hackathon> getHackathonsByOrganizer(@PathVariable String organizerId) {
        return hackathonService.getHackathonsByOrganizer(organizerId);
    }

    @GetMapping("/student/{userId}/registered")
    public List<Hackathon> getRegisteredHackathons(@PathVariable String userId) {
        return hackathonService.getRegisteredHackathons(userId);
    }

    @GetMapping("/student/{userId}/completed")
    public List<Hackathon> getCompletedHackathons(@PathVariable String userId) {
        return hackathonService.getCompletedHackathons(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hackathon> getHackathonById(@PathVariable String id) {
        return hackathonService.getHackathonById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/problem-statements")
    public List<ProblemStatement> getProblemStatements(@PathVariable String id) {
        return hackathonService.getProblemStatements(id);
    }

    @PostMapping("/{id}/problem-statements")
    public ProblemStatement addProblemStatement(@PathVariable String id, @RequestBody ProblemStatement problemStatement) {
        return hackathonService.addProblemStatement(id, problemStatement);
    }

    @PostMapping("/{id}/teams")
    public Team createTeam(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return hackathonService.createTeam(id, payload.get("name"), payload.get("leaderId"));
    }

    @PostMapping("/{id}/teams/join")
    public Team joinTeam(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return hackathonService.joinTeam(id, payload.get("userId"), payload.get("joinCode"));
    }

    @GetMapping("/{id}/my-team")
    public ResponseEntity<Team> getMyTeam(@PathVariable String id, @RequestParam String userId) {
        return hackathonService.getTeamByUser(id, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/teams/student/{userId}")
    public List<Team> getTeamsByStudent(@PathVariable String userId) {
        return hackathonService.getTeamsByStudent(userId);
    }

    @GetMapping("/teams/{teamId}/members")
    public List<TeamMember> getTeamMembers(@PathVariable String teamId) {
        return hackathonService.getTeamMembers(teamId);
    }

    @GetMapping("/{id}/results")
    public List<HackathonResult> getResults(@PathVariable String id) {
        return hackathonService.getResults(id);
    }

    @PostMapping("/{id}/results")
    public ResponseEntity<Void> publishResults(@PathVariable String id, @RequestBody List<HackathonResult> results) {
        hackathonService.publishResults(id, results);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/recommendations/{userId}")
    public List<Hackathon> getRecommendations(@PathVariable String userId) {
        return hackathonService.getRecommendations(userId);
    }

    @GetMapping("/filter")
    public List<Hackathon> filterHackathons(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String mode,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) List<String> tags) {

        List<Hackathon> all = hackathonRepository.findAll();

        return all.stream()
                .filter(h -> search == null || search.isEmpty() || h.getTitle().toLowerCase().contains(search.toLowerCase())
                        || (h.getTags() != null && h.getTags().stream().anyMatch(t -> t.toLowerCase().contains(search.toLowerCase()))))
                .filter(h -> country == null || country.isEmpty() || (h.getCountry() != null && h.getCountry().equalsIgnoreCase(country)))
                .filter(h -> mode == null || mode.isEmpty() || (h.getMode() != null && h.getMode().equalsIgnoreCase(mode)))
                .filter(h -> status == null || status.isEmpty() || (h.getStatus() != null && h.getStatus().equalsIgnoreCase(status)))
                .filter(h -> tags == null || tags.isEmpty() || (h.getTags() != null && new HashSet<>(h.getTags()).containsAll(tags)))
                .collect(Collectors.toList());
    }

    @PostMapping("/{id}/bookmark")
    public ResponseEntity<?> toggleBookmark(@PathVariable String id, @RequestParam String userId) {
        Hackathon hackathon = hackathonRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Bookmark> existing = bookmarkRepository.findByUserIdAndHackathonId(userId, id);
        if (existing.isPresent()) {
            bookmarkRepository.delete(existing.get());
            return ResponseEntity.ok(Map.of("message", "removed"));
        } else {
            Bookmark b = new Bookmark();
            b.setHackathon(hackathon);
            b.setUser(user);
            bookmarkRepository.save(b);
            return ResponseEntity.ok(Map.of("message", "added"));
        }
    }

    @GetMapping("/bookmarks")
    public List<Hackathon> getBookmarks(@RequestParam String userId) {
        return bookmarkRepository.findByUserId(userId).stream()
                .map(Bookmark::getHackathon)
                .collect(Collectors.toList());
    }

    @PostMapping("/seed")
    public ResponseEntity<?> seedHackathons() {
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

        if (hackathonRepository.count() > 5) return ResponseEntity.ok(Map.of("message", "Users seeded (if missing), Hackathons already seeded"));

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
        return ResponseEntity.ok(Map.of("message", "Seeded 25 hackathons", "count", 25));
    }
}
