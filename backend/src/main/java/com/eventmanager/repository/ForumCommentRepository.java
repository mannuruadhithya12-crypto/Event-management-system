package com.eventmanager.repository;

import com.eventmanager.model.ForumComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ForumCommentRepository extends JpaRepository<ForumComment, String> {
    List<ForumComment> findByPostIdOrderByCreatedAtAsc(String postId);
}
