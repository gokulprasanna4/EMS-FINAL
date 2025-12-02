package com.ems.dto;

import com.ems.modal.Attendence;
import lombok.Data;
import java.time.LocalDate;

@Data
public class AttendanceResponse {
    private Long requestId;
    private Long userId;
    private String username;
    private String attendenceType;
    private String leaveCategory; 
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String userRequestComment;
    private String managerComment;

    public AttendanceResponse(Attendence a, String username) {
        this.requestId = a.getRequestId();
        this.userId = a.getUserId();
        this.username = username;
        this.attendenceType = a.getAttendenceType().name();
        this.leaveCategory = a.getLeaveCategory() != null ? a.getLeaveCategory().name() : null;
        this.startDate = a.getStartDate();
        this.endDate = a.getEndDate();
        this.status = a.getStatus().name();
        this.userRequestComment = a.getUserRequestComment();
        this.managerComment = a.getManagerComment();
    }
}