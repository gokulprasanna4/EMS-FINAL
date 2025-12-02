package com.ems.controller;

import com.ems.modal.*;
import com.ems.repo.*;
import com.ems.service.AttendanceService;
import com.ems.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/ems/user")
public class UserController {

    @Autowired private UserRepo userRepo;
    @Autowired private AttendenceRepo attendenceRepo;
    @Autowired private FeedbackRepo feedbackRepo;
    @Autowired private InfoRequestRepo infoRequestRepo;
    @Autowired private AttendanceService attendanceService;
    @Autowired private UserService userService;

    // --- USER HISTORY (Latest First) ---
    @GetMapping("/applied/attendence")
    public ResponseEntity<?> getAtt(@RequestParam Long userId) {
        // Uses the new sorted method
        return ResponseEntity.ok(attendenceRepo.findByUserIdOrderByRequestIdDesc(userId));
    }

    // --- OTHER ENDPOINTS (Keep them as they were, just ensuring they exist) ---
    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        return ResponseEntity.of(userRepo.findById(id));
    }
    
    @PutMapping("/update/profile")
    public ResponseEntity<?> updateMyProfile(@RequestParam Long userId, @RequestBody com.ems.dto.UserDto dto) {
        try { return ResponseEntity.ok(userService.updateUser(userId, dto)); } 
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @PostMapping("/apply/attendence")
    public ResponseEntity<?> apply(@RequestParam Long userId, @RequestBody Attendence a) {
        try { return ResponseEntity.ok(attendanceService.applyAttendance(userId, a)); } 
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @PostMapping("/submit/feedback")
    public ResponseEntity<?> feedback(@RequestParam Long userId, @RequestBody Feedback f) {
        f.setUserId(userId);
        return ResponseEntity.ok(feedbackRepo.save(f));
    }

    @PostMapping("/submit/info-request")
    public ResponseEntity<?> info(@RequestParam Long userId, @RequestBody InfoRequest i) {
        i.setUserId(userId);
        if(i.getStatus() == null) i.setStatus(InfoRequest.Status.SUBMITTED);
        return ResponseEntity.ok(infoRequestRepo.save(i));
    }

    @GetMapping("/applied/check")
    public ResponseEntity<Boolean> checkApplied(@RequestParam Long userId, 
                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(attendenceRepo.existsOverlappingRequest(userId, startDate, endDate));
    }
}