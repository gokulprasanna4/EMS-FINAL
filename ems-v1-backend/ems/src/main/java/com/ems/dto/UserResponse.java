package com.ems.dto;
import com.ems.modal.User;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
public class UserResponse {
    private Long userId;
    private String username;
    private String role;
    private Long reportingId;
    
    // New Fields
    private String mobileNumber;
    private Integer age;
    private LocalDate joiningDate;
    private Double experience;
    private String department;
    private String employmentType;

    public UserResponse(User user) {
        this.userId = user.getUserId();
        this.username = user.getUsername();
        this.role = user.getRole().name();
        this.reportingId = user.getReportingId();
        this.mobileNumber = user.getMobileNumber();
        this.age = user.getAge();
        this.joiningDate = user.getJoiningDate();
        this.experience = user.getExperience();
        this.department = user.getDepartment() != null ? user.getDepartment().name() : null;
        this.employmentType = user.getEmploymentType() != null ? user.getEmploymentType().name() : null;
    }
}