package com.ems.modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "info_requests")
public class InfoRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long infoRequestId;
    
    @Column(nullable = false)
    private Long userId;

    @Column(length = 100)
    private String requestType;
    
    @Column(columnDefinition = "TEXT")
    private String requestDescription;

    @Enumerated(EnumType.STRING)
    private Status status = Status.SUBMITTED;

    public enum Status {
        RESOLVED, SUBMITTED
    }
}