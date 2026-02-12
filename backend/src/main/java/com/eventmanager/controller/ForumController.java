package com.eventmanager.controller;

import com.eventmanager.model.ForumComment;
import com.eventmanager.model.ForumPost;
import com.eventmanager.service.ForumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/forum")
public class ForumController {

    @Autowired
    private ForumService forumService;

    @PostMapping("/posts")
    public ResponseEntity<ForumPost> createPost(@RequestParam String authorId, @RequestParam String title,
            @RequestBody String content, @RequestParam String category) {
        return ResponseEntity.ok(forumService.createPost(authorId, title, content, category));
    }

    @GetMapping("/posts")
    public ResponseEntity<List<ForumPost>> getAllPosts() {
        return ResponseEntity.ok(forumService.getAllPosts());
    }

    @GetMapping("/posts/category/{category}")
    public ResponseEntity<List<ForumPost>> getPostsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(forumService.getPostsByCategory(category));
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<ForumPost> getPostById(@PathVariable String id) {
        return ResponseEntity.ok(forumService.getPostById(id));
    }

    @PostMapping("/posts/{id}/upvote")
    public ResponseEntity<ForumPost> upvotePost(@PathVariable String id) {
        return ResponseEntity.ok(forumService.upvotePost(id));
    }

    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<ForumComment> addComment(@PathVariable String id, @RequestParam String authorId,
            @RequestBody String content) {
        return ResponseEntity.ok(forumService.addComment(id, authorId, content));
    }

    @GetMapping("/posts/{id}/comments")
    public ResponseEntity<List<ForumComment>> getComments(@PathVariable String id) {
        return ResponseEntity.ok(forumService.getComments(id));
    }
}
