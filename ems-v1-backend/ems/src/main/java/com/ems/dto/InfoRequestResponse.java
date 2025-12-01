package com.ems.dto;
import com.ems.modal.InfoRequest;
import lombok.Data;

@Data
public class InfoRequestResponse {
    private Long infoRequestId;
    private Long userId;
    private String username; // Added Field
    private String requestType;
    private String requestDescription;
    private String status;

    public InfoRequestResponse(InfoRequest request, String username) {
        this.infoRequestId = request.getInfoRequestId();
        this.userId = request.getUserId();
        this.username = username;
        this.requestType = request.getRequestType();
        this.requestDescription = request.getRequestDescription();
        this.status = request.getStatus() != null ? request.getStatus().name() : "SUBMITTED";
    }
}