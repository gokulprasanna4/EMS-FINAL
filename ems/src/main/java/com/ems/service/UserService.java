package com.ems.service;

import com.ems.dto.UserDto;
import com.ems.dto.UserResponse;
import com.ems.modal.User;
import com.ems.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired private UserRepo userRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    public List<UserResponse> getUsersByRole(User.Role role) {
        return userRepo.findAll().stream()
                .filter(u -> u.getRole() == role)
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    public UserResponse createUser(UserDto dto, User.Role role) {
        if (userRepo.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        User user = new User(); // <--- Uses defaults (7, 7, 15) from User.java automatically
        
        user.setUsername(dto.getUsername());
        if(dto.getPassword() == null || dto.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password is required");
        }
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(role);
        user.setReportingId(dto.getReportingId());
        user.setActive(true);

        mapFields(user, dto); // Helper to map common fields

        return new UserResponse(userRepo.save(user));
    }

    public UserResponse updateUser(Long id, UserDto dto) {
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getUsername().equals(dto.getUsername()) && userRepo.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken");
        }
        user.setUsername(dto.getUsername());

        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        user.setReportingId(dto.getReportingId());

        mapFields(user, dto); // Update fields

        return new UserResponse(userRepo.save(user));
    }

    private void mapFields(User user, UserDto dto) {
        if(dto.getMobileNumber() != null) user.setMobileNumber(dto.getMobileNumber());
        if(dto.getAge() != null) user.setAge(dto.getAge());
        if(dto.getJoiningDate() != null) user.setJoiningDate(dto.getJoiningDate());
        if(dto.getExperience() != null) user.setExperience(dto.getExperience());
        
        if(dto.getDepartment() != null) {
            try { user.setDepartment(User.Department.valueOf(dto.getDepartment())); } catch (Exception e) {}
        }
        if(dto.getEmploymentType() != null) {
            try { user.setEmploymentType(User.EmploymentType.valueOf(dto.getEmploymentType())); } catch (Exception e) {}
        }

        if(dto.getSickLeaveBalance() != null) user.setSickLeaveBalance(dto.getSickLeaveBalance());
        if(dto.getCasualLeaveBalance() != null) user.setCasualLeaveBalance(dto.getCasualLeaveBalance());
        if(dto.getEarnedLeaveBalance() != null) user.setEarnedLeaveBalance(dto.getEarnedLeaveBalance());
    }

    public void deleteUser(Long id) {
        if (!userRepo.existsById(id)) throw new RuntimeException("User not found");
        userRepo.deleteById(id);
    }
}