package com.eventmanager.service;

import com.eventmanager.model.ChatMessage;
import com.eventmanager.model.ChatRoom;
import java.util.List;

public interface ChatService {
    ChatRoom getOrCreateRoom(String type, String targetId, String name);

    ChatMessage saveMessage(String roomId, String senderId, String content, String type);

    List<ChatMessage> getMessages(String roomId);

    List<ChatRoom> getRoomsByType(String type);
}
