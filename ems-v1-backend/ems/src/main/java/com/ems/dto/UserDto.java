package com.ems.dto;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UserDto {
    private String username;
    private String password; // Optional for updates
    private Long reportingId;
    
    // New Fields
    private String mobileNumber;
    private Integer age;
    private LocalDate joiningDate;
    private Double experience;
    private String department;
    private String employmentType;
}