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
    public ResponseEntity<ForumPost> createPost(@RequestBody com.eventmanager.dto.ForumPostRequest request) {
        return ResponseEntity.ok(forumService.createPost(request.getAuthorId(), request.getTitle(), request.getContent(), request.getCategory()));
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

    @PostMapping("/posts/{id}/downvote")
    public ResponseEntity<ForumPost> downvotePost(@PathVariable String id) {
        return ResponseEntity.ok(forumService.downvotePost(id));
    }

    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<ForumComment> addComment(@PathVariable String id, @RequestBody com.eventmanager.dto.ForumCommentRequest request) {
        return ResponseEntity.ok(forumService.addComment(id, request.getAuthorId(), request.getContent()));
    }

    @GetMapping("/posts/{id}/comments")
    public ResponseEntity<List<ForumComment>> getComments(@PathVariable String id) {
        return ResponseEntity.ok(forumService.getComments(id));
    }
}
