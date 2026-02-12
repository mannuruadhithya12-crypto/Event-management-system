import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Paperclip, Smile, MoreVertical, Search, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const CommunityChat = () => {
    const { user } = useAuthStore();
    const [newMessage, setNewMessage] = useState('');
    const { messages, room, connected, sendMessage } = useChat('GROUP', 'COMMUNITY_NEXUS', 'Community Nexus');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (newMessage.trim() && user) {
            sendMessage(newMessage, user);
            setNewMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--navy))] to-[hsl(var(--teal))] text-white shadow-lg">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <div className={cn(
                            "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-950 shadow-sm",
                            connected ? "bg-green-500" : "bg-red-500"
                        )} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Community Nexus</h2>
                        <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                            <span className={cn("h-2 w-2 rounded-full", connected ? "bg-green-500" : "bg-red-500")} />
                            {connected ? "Live Connection" : "Reconnecting..."}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-xl text-slate-500 hover:text-[hsl(var(--teal))]">
                        <Search className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-xl text-slate-500 hover:text-[hsl(var(--teal))]">
                        <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-xl text-slate-500 hover:text-[hsl(var(--teal))]">
                        <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-xl text-slate-500 hover:text-[hsl(var(--teal))]">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"
            >
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                            <MessageSquare className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">The board is empty</h3>
                        <p className="max-w-[240px] text-sm text-slate-500 mt-1">Be the first to say hello to the community!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.sender?.id === user?.id;
                        return (
                            <div key={msg.id || idx} className={cn(
                                "flex items-end gap-3",
                                isMe ? "flex-row-reverse" : "flex-row"
                            )}>
                                <Avatar className="h-8 w-8 shadow-sm">
                                    <AvatarImage src={msg.sender?.avatar} />
                                    <AvatarFallback>{msg.sender?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className={cn(
                                    "group relative max-w-[70%] space-y-1",
                                    isMe ? "items-end" : "items-start"
                                )}>
                                    {!isMe && (
                                        <span className="text-[10px] font-bold text-slate-500 uppercase ml-2">
                                            {msg.sender?.name}
                                        </span>
                                    )}
                                    <div className={cn(
                                        "rounded-2xl px-4 py-2.5 shadow-sm text-sm transition-all",
                                        isMe
                                            ? "bg-gradient-to-br from-[hsl(var(--navy))] to-[hsl(var(--navy))]/90 text-white rounded-br-none"
                                            : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-bl-none hover:shadow-md"
                                    )}>
                                        {msg.content}
                                    </div>
                                    <span className="text-[10px] text-slate-400 px-1">
                                        {format(new Date(msg.createdAt), 'HH:mm')}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 max-w-5xl mx-auto">
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-500 hover:bg-white dark:hover:bg-slate-800 shadow-sm">
                            <Paperclip className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-500 hover:bg-white dark:hover:bg-slate-800 shadow-sm">
                            <Smile className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="relative flex-1 group">
                        <Input
                            placeholder="Type your message here..."
                            className="bg-white dark:bg-slate-800 border-none shadow-inner h-12 rounded-2xl pr-12 focus-visible:ring-2 focus-visible:ring-[hsl(var(--teal))]/50"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <Button
                            className={cn(
                                "absolute right-1.5 top-1.5 h-9 w-9 rounded-xl transition-all",
                                newMessage.trim()
                                    ? "bg-[hsl(var(--teal))] text-white scale-100 rotate-0"
                                    : "bg-slate-200 dark:bg-slate-700 text-slate-400 scale-90 rotate-12 opacity-50"
                            )}
                            disabled={!newMessage.trim()}
                            onClick={handleSend}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="mt-2 text-[10px] text-center text-slate-400 font-medium">
                    Press Enter to send message
                </div>
            </div>
        </div>
    );
};

export default CommunityChat;
