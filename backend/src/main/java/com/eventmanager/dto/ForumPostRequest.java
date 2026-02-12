package com.eventmanager.dto;

import lombok.Data;

@Data
public class ForumPostRequest {
    private String authorId;
    private String title;
    private String content;
    private String category;
}
