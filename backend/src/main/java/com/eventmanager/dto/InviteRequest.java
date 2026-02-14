package com.eventmanager.dto;

import lombok.Data;

@Data
public class InviteRequest {
    private String email;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
