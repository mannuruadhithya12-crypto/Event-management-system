package com.eventmanager.dto;

import lombok.Data;

@Data
public class CreateTicketRequest {
    private String title;
    private String description;
    private String category;
    private String priority;
    private String relatedEntityId;
}
