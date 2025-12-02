package com.ems.service;

import com.ems.dto.AttendanceResponse;
import com.ems.modal.Attendence;
import com.ems.modal.User;
import com.ems.repo.AttendenceRepo;
import com.ems.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired private AttendenceRepo attendenceRepo;
    @Autowired private UserRepo userRepo;

    public Attendence applyAttendance(Long userId, Attendence request) {
        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new RuntimeException("Dates are required.");
        }
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new RuntimeException("Start date cannot be after end date.");
        }

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found."));

        // --- VALIDATION: Check Leave Category & Balance ---
        if (request.getAttendenceType() == Attendence.RequestType.LEAVE) {
            if (request.getLeaveCategory() == null) {
                throw new RuntimeException("Please select a Leave Category (Sick, Casual, etc).");
            }
            checkBalance(user, request.getLeaveCategory(), (int) days);
        } else {
            // If Attendance Adjustment, force category to null
            request.setLeaveCategory(null);
        }

        if (attendenceRepo.existsOverlappingRequest(userId, request.getStartDate(), request.getEndDate())) {
            throw new RuntimeException("Conflict: Request exists for these dates.");
        }

        request.setUserId(userId);
        request.setReportingId(user.getReportingId());
        request.setStatus(Attendence.Status.PENDING);
        
        return attendenceRepo.save(request);
    }

    // --- MANAGER APPROVAL ---
    @Transactional
    public Attendence updateRequestStatus(Long requestId, Attendence.Status newStatus, String comment) {
        Attendence request = attendenceRepo.findById(requestId).orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() == Attendence.Status.APPROVED) {
            throw new RuntimeException("Request is already approved.");
        }

        // Deduct Balance ONLY if Approving a LEAVE
        if (newStatus == Attendence.Status.APPROVED && request.getAttendenceType() == Attendence.RequestType.LEAVE) {
            User user = userRepo.findById(request.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
            long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
            deductBalance(user, request.getLeaveCategory(), (int) days);
            userRepo.save(user);
        }

        request.setStatus(newStatus);
        request.setManagerComment(comment);
        return attendenceRepo.save(request);
    }

    public List<AttendanceResponse> getPendingRequests() {
        return attendenceRepo.findByStatusOrderByRequestIdDesc(Attendence.Status.PENDING).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // --- HELPERS ---
    private void checkBalance(User user, Attendence.LeaveCategory category, int days) {
        if (category == Attendence.LeaveCategory.LWP) return; 
        int balance = (category == Attendence.LeaveCategory.SICK) ? user.getSickLeaveBalance() :
                      (category == Attendence.LeaveCategory.CASUAL) ? user.getCasualLeaveBalance() :
                      user.getEarnedLeaveBalance();
        if (balance < days) throw new RuntimeException("Insufficient " + category + " Balance. Available: " + balance);
    }

    private void deductBalance(User user, Attendence.LeaveCategory category, int days) {
        if (category == Attendence.LeaveCategory.LWP) return;
        if (category == Attendence.LeaveCategory.SICK) user.setSickLeaveBalance(user.getSickLeaveBalance() - days);
        else if (category == Attendence.LeaveCategory.CASUAL) user.setCasualLeaveBalance(user.getCasualLeaveBalance() - days);
        else if (category == Attendence.LeaveCategory.EARNED) user.setEarnedLeaveBalance(user.getEarnedLeaveBalance() - days);
    }

    private AttendanceResponse convertToDto(Attendence a) {
        String username = userRepo.findById(a.getUserId()).map(User::getUsername).orElse("Unknown");
        return new AttendanceResponse(a, username);
    }
}