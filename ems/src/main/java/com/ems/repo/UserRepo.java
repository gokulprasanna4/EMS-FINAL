package com.ems.repo;

import com.ems.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    
    // Note: findById(Long id) is provided by JpaRepository automatically.
    // If you have legacy code using findByUserId, you can uncomment this:
    Optional<User> findByUserId(Long userId);
}