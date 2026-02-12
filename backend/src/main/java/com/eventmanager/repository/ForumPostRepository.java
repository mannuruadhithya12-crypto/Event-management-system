package com.eventmanager.repository;

import com.eventmanager.model.ForumPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ForumPostRepository extends JpaRepository<ForumPost, String> {
    List<ForumPost> findByCategoryOrderByCreatedAtDesc(String category);

    List<ForumPost> findAllByOrderByCreatedAtDesc();
}
