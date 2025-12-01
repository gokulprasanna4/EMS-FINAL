package com.ems.service;

import com.ems.dto.AttendanceResponse;
import com.ems.modal.Attendence;
import com.ems.modal.User;
import com.ems.repo.AttendenceRepo;
import com.ems.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired private AttendenceRepo attendenceRepo;
    @Autowired private UserRepo userRepo;

    public Attendence applyAttendance(Long userId, Attendence request) {
        // 1. Validation: Weekend Check
        validateWeekends(request.getStartDate(), request.getEndDate());

        // 2. Validation: Overlap Check
        if (attendenceRepo.existsOverlappingRequest(userId, request.getStartDate(), request.getEndDate())) {
            // This exception message now only occurs if the request is PENDING or APPROVED
            throw new RuntimeException("A conflict exists. You already have an approved or pending request for these dates.");
        }

        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        
        request.setUserId(userId);
        request.setReportingId(user.getReportingId());
        request.setStatus(Attendence.Status.PENDING);
        
        return attendenceRepo.save(request);
    }

    public List<AttendanceResponse> getPendingRequests() {
        return attendenceRepo.findAll().stream()
                .filter(a -> a.getStatus() == Attendence.Status.PENDING || a.getStatus() == null)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // --- HELPER: Validate Dates ---
    private void validateWeekends(LocalDate start, LocalDate end) {
        LocalDate current = start;
        while (!current.isAfter(end)) {
            DayOfWeek day = current.getDayOfWeek();
            if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
                throw new RuntimeException("Cannot apply attendance on Saturday or Sunday (" + current + ")");
            }
            current = current.plusDays(1);
        }
    }

    // --- HELPER: Convert to DTO (Enriches with Username) ---
    private AttendanceResponse convertToDto(Attendence a) {
        String username = userRepo.findById(a.getUserId())
                .map(User::getUsername)
                .orElse("Unknown User");
        return new AttendanceResponse(a, username);
    }
}