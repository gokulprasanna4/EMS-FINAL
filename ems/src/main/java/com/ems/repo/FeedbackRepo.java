package com.ems.repo;

import com.ems.modal.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeedbackRepo extends JpaRepository<Feedback, Long> {
    // To fetch feedback by specific user if needed
    List<Feedback> findByUserId(Long userId);
}