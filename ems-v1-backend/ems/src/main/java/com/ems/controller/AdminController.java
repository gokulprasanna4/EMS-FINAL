package com.ems.controller;

import com.ems.dto.FeedbackResponse;
import com.ems.dto.InfoRequestResponse;
import com.ems.dto.UserDto;
import com.ems.dto.UserResponse;
import com.ems.modal.*;
import com.ems.repo.*;
import com.ems.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
        List<FeedbackResponse> responses = feedbackRepo.findAll().stream()
            .map(f -> {
                // Fetch username only if userId is not null
                String username = f.getUserId() != null 
                    ? userRepo.findById(f.getUserId()).map(User::getUsername).orElse("Unknown User")
                    : "Missing User ID";
                return new FeedbackResponse(f, username);
            })
            .toList();
        return ResponseEntity.ok(responses); 
    }

    @GetMapping("/info-requests")
    public ResponseEntity<List<InfoRequestResponse>> getAllInfoRequests() { 
        try {
            List<InfoRequestResponse> responses = infoRequestRepo.findAll().stream()
                .map(r -> {
                    // FIX: Explicitly check if userId is null before attempting lookup
                    String username = "Missing User ID";
                    if (r.getUserId() != null) {
                        username = userRepo.findById(r.getUserId())
                            .map(User::getUsername)
                            .orElse("Unknown User");
                    }
                    return new InfoRequestResponse(r, username);
                })
                .toList();
            return ResponseEntity.ok(responses); 
        } catch (Exception e) {
            // Log the error and return a 500 with a detailed message
            e.printStackTrace();
            return ResponseEntity.status(500).body(List.of(new InfoRequestResponse(
                new InfoRequest(0L, 0L, "ERROR", "Failed to load data due to: " + e.getMessage(), InfoRequest.Status.SUBMITTED), 
                "System Error"
            )));
        }
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