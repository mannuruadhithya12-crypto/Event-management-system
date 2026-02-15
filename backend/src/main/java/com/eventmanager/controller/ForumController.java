package com.eventmanager.controller;

import com.eventmanager.dto.ApiResponse;
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
    public ResponseEntity<ApiResponse<ForumPost>> createPost(@RequestBody com.eventmanager.dto.ForumPostRequest request) {
        return ResponseEntity.ok(ApiResponse.success(forumService.createPost(request.getAuthorId(), request.getTitle(), request.getContent(), request.getCategory())));
    }

    @GetMapping("/posts")
    public ResponseEntity<ApiResponse<List<ForumPost>>> getAllPosts() {
        return ResponseEntity.ok(ApiResponse.success(forumService.getAllPosts()));
    }

    @GetMapping("/posts/category/{category}")
    public ResponseEntity<ApiResponse<List<ForumPost>>> getPostsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(ApiResponse.success(forumService.getPostsByCategory(category)));
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<ApiResponse<ForumPost>> getPostById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(forumService.getPostById(id)));
    }

    @PostMapping("/posts/{id}/upvote")
    public ResponseEntity<ApiResponse<ForumPost>> upvotePost(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(forumService.upvotePost(id)));
    }

    @PostMapping("/posts/{id}/downvote")
    public ResponseEntity<ApiResponse<ForumPost>> downvotePost(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(forumService.downvotePost(id)));
    }

    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<ApiResponse<ForumComment>> addComment(@PathVariable String id, @RequestBody com.eventmanager.dto.ForumCommentRequest request) {
        return ResponseEntity.ok(ApiResponse.success(forumService.addComment(id, request.getAuthorId(), request.getContent())));
    }

    @GetMapping("/posts/{id}/comments")
    public ResponseEntity<ApiResponse<List<ForumComment>>> getComments(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(forumService.getComments(id)));
    }

    @PostMapping("/seed")
    public ResponseEntity<ApiResponse<String>> seed() {
        forumService.seedPosts();
        return ResponseEntity.ok(ApiResponse.success("Forum seeded successfully", null));
    }
}
