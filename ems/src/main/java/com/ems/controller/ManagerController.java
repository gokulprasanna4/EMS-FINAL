package com.ems.controller;

import com.ems.dto.AttendanceResponse;
import com.ems.dto.UserDto;
import com.ems.dto.UserResponse;
import com.ems.modal.*;
import com.ems.repo.*;
import com.ems.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // IMPORT
import org.springframework.security.core.context.SecurityContextHolder; // IMPORT
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/ems/manager")
public class ManagerController {

    @Autowired private UserService userService;
    @Autowired private AttendenceRepo attendenceRepo;
    @Autowired private AttendanceService attendanceService;
    @Autowired private UserRepo userRepo; // IMPORT

    @GetMapping("/employees")
    public ResponseEntity<List<UserResponse>> getEmployees() {
        return ResponseEntity.ok(userService.getUsersByRole(User.Role.EMPLOYEE));
    }

    @PostMapping("/employee/create")
    public ResponseEntity<?> createEmployee(@RequestBody UserDto dto) {
        try {
            // FIX: If reportingId is null, set it to current Manager's ID
            if (dto.getReportingId() == null) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                userRepo.findByUsername(auth.getName())
                        .ifPresent(manager -> dto.setReportingId(manager.getUserId()));
            }
            return new ResponseEntity<>(userService.createUser(dto, User.Role.EMPLOYEE), HttpStatus.CREATED);
        } catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @PutMapping("/employee/update/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody UserDto dto) {
        try {
            return ResponseEntity.ok(userService.updateUser(id, dto));
        } catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @DeleteMapping("/employee/delete/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("Deleted");
    }

    @GetMapping("/attendance/pending")
    public ResponseEntity<List<AttendanceResponse>> getPendingAttendance() {
        return ResponseEntity.ok(attendanceService.getPendingRequests());
    }

    @PutMapping("/attendance/status/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status, @RequestParam(required = false) String comment) {
        try {
            return attendenceRepo.findById(id).map(att -> {
                att.setStatus(Attendence.Status.valueOf(status.toUpperCase()));
                att.setManagerComment(comment != null ? comment : "");
                return ResponseEntity.ok(attendenceRepo.save(att));
            }).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) { return ResponseEntity.status(500).body(e.getMessage()); }
    }
}