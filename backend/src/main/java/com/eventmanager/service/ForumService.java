package com.eventmanager.service;

import com.eventmanager.model.ForumComment;
import com.eventmanager.model.ForumPost;
import java.util.List;

public interface ForumService {
    ForumPost createPost(String authorId, String title, String content, String category);

    List<ForumPost> getAllPosts();

    List<ForumPost> getPostsByCategory(String category);

    ForumPost getPostById(String id);

    ForumPost upvotePost(String postId);

    ForumPost downvotePost(String postId);

    ForumComment addComment(String postId, String authorId, String content);

    List<ForumComment> getComments(String postId);
    
    void seedPosts();
}
