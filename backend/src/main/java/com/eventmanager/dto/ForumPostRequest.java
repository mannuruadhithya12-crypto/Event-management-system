package com.eventmanager.dto;

import lombok.Data;

@Data
public class ForumPostRequest {
    private String authorId;
    private String title;
    private String content;
    private String category;

    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
