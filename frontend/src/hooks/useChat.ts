import { useState, useEffect, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { chatApi } from '@/lib/api';

export const useChat = (type: string, targetId: string, roomName: string) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [room, setRoom] = useState<any>(null);
    const [connected, setConnected] = useState(false);
    const stompClient = useRef<Client | null>(null);

    const connect = useCallback((roomId: string) => {
        const client = new Client({
            webSocketFactory: () => new SockJS('/ws'),
            onConnect: () => {
                setConnected(true);
                client.subscribe(`/topic/messages/${roomId}`, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    setMessages((prev) => [...prev, receivedMessage]);
                });
            },
            onDisconnect: () => setConnected(false),
            debug: (str) => console.log(str),
        });

        client.activate();
        stompClient.current = client;
    }, []);

    useEffect(() => {
        const initChat = async () => {
            try {
                const roomData = await chatApi.getRoom(type, targetId, roomName);
                setRoom(roomData);
                const history = await chatApi.getMessages(roomData.id);
                setMessages(history);
                connect(roomData.id);
            } catch (error) {
                console.error('Failed to init chat:', error);
            }
        };

        initChat();

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, [type, targetId, roomName, connect]);

    const sendMessage = (content: string, sender: any, msgType: string = 'TEXT') => {
        if (stompClient.current && connected && room) {
            const chatMessage = {
                sender: { id: sender.id },
                content,
                type: msgType,
                createdAt: new Date().toISOString()
            };
            stompClient.current.publish({
                destination: `/app/chat/${room.id}`,
                body: JSON.stringify(chatMessage)
            });
        }
    };

    return { messages, room, connected, sendMessage };
};
