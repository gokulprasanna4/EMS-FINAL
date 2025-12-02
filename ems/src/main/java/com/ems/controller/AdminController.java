package com.ems.controller;

import com.ems.dto.FeedbackResponse;
import com.ems.dto.InfoRequestResponse;
import com.ems.dto.UserDto;
import com.ems.dto.UserResponse;
import com.ems.modal.*;
import com.ems.repo.*;
import com.ems.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // IMPORT
import org.springframework.security.core.context.SecurityContextHolder; // IMPORT
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/ems/admin")
public class AdminController {

    @Autowired private UserService userService;
    @Autowired private FeedbackRepo feedbackRepo;
    @Autowired private InfoRequestRepo infoRequestRepo;
    @Autowired private UserRepo userRepo;

    @GetMapping("/managers")
    public ResponseEntity<List<UserResponse>> getManagers() {
        return ResponseEntity.ok(userService.getUsersByRole(User.Role.MANAGER));
    }

    @PostMapping("/manager/create")
    public ResponseEntity<?> createManager(@RequestBody UserDto dto) {
        try {
            // FIX: Default Reporting ID to Current Admin
            if (dto.getReportingId() == null) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                userRepo.findByUsername(auth.getName())
                        .ifPresent(admin -> dto.setReportingId(admin.getUserId()));
            }
            return new ResponseEntity<>(userService.createUser(dto, User.Role.MANAGER), HttpStatus.CREATED);
        } catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @PutMapping("/manager/update/{id}")
    public ResponseEntity<?> updateManager(@PathVariable Long id, @RequestBody UserDto dto) {
        try {
            return ResponseEntity.ok(userService.updateUser(id, dto));
        } catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @DeleteMapping("/manager/delete/{id}")
    public ResponseEntity<?> deleteManager(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("Deleted");
    }

    @GetMapping("/feedbacks")
    public ResponseEntity<List<FeedbackResponse>> getAllFeedbacks() { 
        List<FeedbackResponse> responses = feedbackRepo.findAll(Sort.by(Sort.Direction.DESC, "feedbackId")).stream()
            .map(f -> new FeedbackResponse(f, f.getUserId() != null ? userRepo.findById(f.getUserId()).map(User::getUsername).orElse("Unknown") : "Missing ID"))
            .toList();
        return ResponseEntity.ok(responses); 
    }

    @GetMapping("/info-requests")
    public ResponseEntity<List<InfoRequestResponse>> getAllInfoRequests() { 
        List<InfoRequestResponse> responses = infoRequestRepo.findAll(Sort.by(Sort.Direction.DESC, "infoRequestId")).stream()
            .map(r -> new InfoRequestResponse(r, r.getUserId() != null ? userRepo.findById(r.getUserId()).map(User::getUsername).orElse("Unknown") : "Missing ID"))
            .toList();
        return ResponseEntity.ok(responses); 
    }

    @PutMapping("/info-request/resolve/{id}")
    public ResponseEntity<?> resolveInfoRequest(@PathVariable Long id) {
        return infoRequestRepo.findById(id).map(req -> {
            req.setStatus(InfoRequest.Status.RESOLVED);
            infoRequestRepo.save(req);
            return ResponseEntity.ok(req);
        }).orElse(ResponseEntity.notFound().build());
    }
}