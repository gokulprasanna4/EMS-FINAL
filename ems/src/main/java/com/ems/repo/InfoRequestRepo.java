package com.ems.repo;

import com.ems.modal.InfoRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InfoRequestRepo extends JpaRepository<InfoRequest, Long> {
    // To fetch requests by specific user
    List<InfoRequest> findByUserId(Long userId);
}