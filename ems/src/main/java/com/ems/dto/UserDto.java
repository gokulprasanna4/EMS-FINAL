package com.ems.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UserDto {
    private String username;
    private String password;
    private Long reportingId;
    
    private String mobileNumber;
    private Integer age;
    private LocalDate joiningDate;
    private Double experience;
    private String department;
    private String employmentType;

    // --- New Fields for Manager Updates ---
    private Integer sickLeaveBalance;
    private Integer casualLeaveBalance;
    private Integer earnedLeaveBalance;
}