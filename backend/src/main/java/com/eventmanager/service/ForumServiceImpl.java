package com.eventmanager.service;

import com.eventmanager.model.ForumComment;
import com.eventmanager.model.ForumPost;
import com.eventmanager.model.User;
import com.eventmanager.repository.ForumCommentRepository;
import com.eventmanager.repository.ForumPostRepository;
import com.eventmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ForumServiceImpl implements ForumService {

    @Autowired
    private ForumPostRepository postRepository;

    @Autowired
    private ForumCommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityService activityService;

    @Override
    public ForumPost createPost(String authorId, String title, String content, String category) {
        User author = userRepository.findById(authorId).orElseThrow(() -> new RuntimeException("Author not found"));

        ForumPost post = new ForumPost();
        post.setAuthor(author);
        post.setTitle(title);
        post.setContent(content);
        post.setCategory(category);

        ForumPost savedPost = postRepository.save(post);
        activityService.logActivity(authorId, "FORUM_POST", "Created a forum post: " + title, savedPost.getId(), title);

        return savedPost;
    }

    @Override
    public List<ForumPost> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public List<ForumPost> getPostsByCategory(String category) {
        return postRepository.findByCategoryOrderByCreatedAtDesc(category);
    }

    @Override
    public ForumPost getPostById(String id) {
        return postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
    }

    @Override
    public ForumPost upvotePost(String postId) {
        ForumPost post = getPostById(postId);
        post.setUpvotes(post.getUpvotes() + 1);
        return postRepository.save(post);
    }

    @Override
    public ForumPost downvotePost(String postId) {
        ForumPost post = getPostById(postId);
        post.setDownvotes(post.getDownvotes() + 1);
        return postRepository.save(post);
    }

    @Override
    public ForumComment addComment(String postId, String authorId, String content) {
        ForumPost post = getPostById(postId);
        User author = userRepository.findById(authorId).orElseThrow(() -> new RuntimeException("Author not found"));

        ForumComment comment = new ForumComment();
        comment.setPost(post);
        comment.setAuthor(author);
        comment.setContent(content);

        ForumComment savedComment = commentRepository.save(comment);
        activityService.logActivity(authorId, "FORUM_COMMENT", "Commented on: " + post.getTitle(), post.getId(),
                post.getTitle());

        return savedComment;
    }

    @Override
    public List<ForumComment> getComments(String postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }

    @Override
    public void seedPosts() {
        if (postRepository.count() > 0) return;

        User author = userRepository.findAll().stream().findFirst().orElse(null);
        if (author == null) return;

        String[] titles = {
            "Best resources for learning React?",
            "How to structure a Spring Boot project?",
            "Hackathon team needed for AI challenge",
            "What is the best way to deploy MERN stack?",
            "Experience with Google Cloud vs AWS?"
        };

        String[] categories = {"General", "Technical", "Team Formation", "Career", "Showcase"};

        for (int i = 0; i < titles.length; i++) {
            createPost(author.getId(), titles[i], "I'm looking for some advice/help regarding " + titles[i], categories[i % categories.length]);
        }
    }
}
