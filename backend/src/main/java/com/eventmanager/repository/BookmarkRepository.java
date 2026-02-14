package com.eventmanager.repository;

import com.eventmanager.model.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, String> {
    List<Bookmark> findByUserId(String userId);
    Optional<Bookmark> findByUserIdAndHackathonId(String userId, String hackathonId);
    void deleteByUserIdAndHackathonId(String userId, String hackathonId);
}
