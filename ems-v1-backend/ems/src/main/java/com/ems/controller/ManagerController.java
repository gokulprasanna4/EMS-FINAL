package com.ems.controller;

import com.ems.dto.AttendanceResponse;
import com.ems.dto.UserDto;
import com.ems.dto.UserResponse;
import com.ems.modal.*;
import com.ems.repo.AttendenceRepo;
import com.ems.service.AttendanceService;
import com.ems.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/ems/manager")
public class ManagerController {

    @Autowired private UserService userService;
    @Autowired private AttendenceRepo attendenceRepo;
    @Autowired private AttendanceService attendanceService;

    
    // --- EMPLOYEE CRUD ---
    @GetMapping("/employees")
    public ResponseEntity<List<UserResponse>> getEmployees() {
        return ResponseEntity.ok(userService.getUsersByRole(User.Role.EMPLOYEE));
    }

    @PostMapping("/employee/create")
    public ResponseEntity<?> createEmployee(@RequestBody UserDto dto) {
        try {
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

    // --- ATTENDANCE WORKFLOW (FIXED) ---
    
    
 // GET PENDING ATTENDANCE (Returns DTO with Username)
    @GetMapping("/attendance/pending")
    public ResponseEntity<List<AttendanceResponse>> getPendingAttendance() {
        return ResponseEntity.ok(attendanceService.getPendingRequests());
    }

    // PUT APPROVE/REJECT (Fixed)
    @PutMapping("/attendance/status/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, 
                                          @RequestParam String status, 
                                          @RequestParam(required = false) String comment) {
        try {
            // Find the request by ID and execute logic if found
            return attendenceRepo.findById(id)
                // SUCCESS BRANCH: Returns ResponseEntity<Attendence>
                .map(att -> {
                    att.setStatus(Attendence.Status.valueOf(status.toUpperCase()));
                    att.setManagerComment(comment != null ? comment : "");
                    
                    // Return the successful response
                    return ResponseEntity.ok(attendenceRepo.save(att));
                })
                // FAILURE BRANCH: If Optional is empty, return NOT_FOUND (Resolves type conflict)
                .orElseGet(() -> ResponseEntity.notFound().build());
                
        } catch (IllegalArgumentException e) {
            // Catches errors if the 'status' string doesn't match the Enum values
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status value provided.");
        } catch (Exception e) { 
            // Catches general errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}