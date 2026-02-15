package com.eventmanager.dto;

import lombok.Data;

@Data
public class AddMessageRequest {
    private String message;
    private String attachmentUrl;
}
