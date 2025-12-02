package com.ems.dto;
import com.ems.modal.Feedback;
import lombok.Data;

@Data
public class FeedbackResponse {
    private Long feedbackId;
    private Long userId;
    private String username; // Added Field
    private String feedback;

    public FeedbackResponse(Feedback feedback, String username) {
        this.feedbackId = feedback.getFeedbackId();
        this.userId = feedback.getUserId();
        this.username = username;
        this.feedback = feedback.getFeedback();
    }
}