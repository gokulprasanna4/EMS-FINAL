package com.ems.modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    
    @Column(unique = true, nullable = false)
    private String username;
    private String password;
    
    @Enumerated(EnumType.STRING)
    private Role role;
    
    @Column(nullable = true)
    private Long reportingId;
    
    private boolean isActive = true;

    private String mobileNumber;
    private Integer age;
    private LocalDate joiningDate;
    private Double experience;

    @Enumerated(EnumType.STRING)
    private Department department;

    @Enumerated(EnumType.STRING)
    private EmploymentType employmentType;

    private Integer sickLeaveBalance = 7;
    private Integer casualLeaveBalance = 7;
    private Integer earnedLeaveBalance = 15;

    public enum Role { ADMIN, MANAGER, EMPLOYEE }
    public enum Department { IT, DEVELOPMENT, MANAGEMENT, HR, LD, FINANCE, MARKETING }
    public enum EmploymentType { FULL_TIME, PART_TIME, CONTRACT, FREELANCE }
}