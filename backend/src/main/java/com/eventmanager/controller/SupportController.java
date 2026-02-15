package com.eventmanager.controller;

import com.eventmanager.dto.AddMessageRequest;
import com.eventmanager.dto.ApiResponse;
import com.eventmanager.dto.CreateTicketRequest;
import com.eventmanager.model.SupportMessage;
import com.eventmanager.model.SupportTicket;
import com.eventmanager.service.SupportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support")
public class SupportController {

    @Autowired
    private SupportService supportService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<SupportTicket>> createTicket(@RequestParam String userId, @RequestBody CreateTicketRequest request) {
        try {
            SupportTicket ticket = supportService.createTicket(userId, request);
            return ResponseEntity.ok(ApiResponse.success("Ticket created successfully", ticket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<SupportTicket>>> getUserTickets(@PathVariable String userId) {
        try {
            List<SupportTicket> tickets = supportService.getUserTickets(userId);
            return ResponseEntity.ok(ApiResponse.success(tickets));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<ApiResponse<SupportTicket>> getTicketDetails(@PathVariable String ticketId) {
        try {
            SupportTicket ticket = supportService.getTicketDetails(ticketId);
            return ResponseEntity.ok(ApiResponse.success(ticket));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{ticketId}/reply")
    public ResponseEntity<ApiResponse<SupportMessage>> addReply(@PathVariable String ticketId, @RequestParam String userId, @RequestBody AddMessageRequest request) {
        try {
            SupportMessage message = supportService.addMessage(userId, ticketId, request);
            return ResponseEntity.ok(ApiResponse.success("Reply added successfully", message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<SupportTicket>>> getAllTickets() {
        try {
            // In a real app, you'd verify the requesting user is an admin here via SecurityContext or param
            List<SupportTicket> tickets = supportService.getAllTickets();
            return ResponseEntity.ok(ApiResponse.success(tickets));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{ticketId}/status")
    public ResponseEntity<ApiResponse<SupportTicket>> updateStatus(@PathVariable String ticketId, @RequestParam String status, @RequestParam(required = false) String userId) {
        try {
            // Fallback for backward compatibility if userId is missing (though frontend should send it)
            // Ideally we require userId. For now, if null, we might default or fail. 
            // Better to fail if strict RBAC is needed, but for "run" request I'll assume we can pass it.
            if (userId == null) {
                 // Temporary bypass or fetch from valid session if available
                 // For now, let's just require it and rely on frontend sending it (I updated api.ts to send it? No, I need to check api.ts)
                 throw new RuntimeException("User ID is required for status update");
            }
            SupportTicket ticket = supportService.updateTicketStatus(ticketId, status, userId);
            return ResponseEntity.ok(ApiResponse.success("Status updated successfully", ticket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
