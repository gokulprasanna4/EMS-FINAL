package com.ems.modal;

import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "attendence_request")
public class Attendence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    private Long userId;

    private Long reportingId;

    @Enumerated(EnumType.STRING)
    private RequestType attendenceType;

    private LocalDate startDate;
    private LocalDate endDate;

    @Column(length = 500)
    private String userRequestComment;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;
    
    @Column(length = 500)
    private String managerComment;

    public enum RequestType {
        ATTENDENCE, LEAVE
    }

    public enum Status {
        PENDING, APPROVED, REJECTED
    }
}