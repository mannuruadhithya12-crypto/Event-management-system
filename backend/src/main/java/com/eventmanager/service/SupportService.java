package com.eventmanager.service;

import com.eventmanager.dto.AddMessageRequest;
import com.eventmanager.dto.CreateTicketRequest;
import com.eventmanager.model.SupportTicket;
import com.eventmanager.model.SupportMessage;
import java.util.List;

public interface SupportService {
    SupportTicket createTicket(String userId, CreateTicketRequest request);
    List<SupportTicket> getUserTickets(String userId);
    SupportTicket getTicketDetails(String ticketId);
    SupportMessage addMessage(String userId, String ticketId, AddMessageRequest request);
    List<SupportTicket> getAllTickets();
    SupportTicket updateTicketStatus(String ticketId, String status, String userId);
}
