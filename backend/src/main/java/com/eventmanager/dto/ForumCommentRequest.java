package com.eventmanager.dto;

import lombok.Data;

@Data
public class ForumCommentRequest {
    private String authorId;
    private String content;
}
