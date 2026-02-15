import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Send,
    User,
    Shield,
    CheckCircle2,
    Clock,
    AlertCircle,
    Paperclip,
    MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { supportApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const TicketDetailPage = () => {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [replyMessage, setReplyMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchTicketDetails();
    }, [ticketId]);

    useEffect(() => {
        scrollToBottom();
    }, [ticket?.messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchTicketDetails = async () => {
        try {
            if (!ticketId) return;
            const data = await supportApi.getTicketDetails(ticketId);
            setTicket(data);
        } catch (error) {
            console.error("Failed to fetch ticket:", error);
            // Don't show toast on polling error to avoid spam
            if (loading) toast.error("Failed to load ticket details");
        } finally {
            setLoading(false);
        }
    };

    // Polling for real-time updates
    useEffect(() => {
        fetchTicketDetails();

        const intervalId = setInterval(() => {
            fetchTicketDetails();
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(intervalId);
    }, [ticketId]);

    const handleSendReply = async () => {
        if (!replyMessage.trim()) return;

        setSending(true);
        try {
            await supportApi.addReply(ticketId!, user!.id, {
                message: replyMessage,
                attachmentUrl: null // TODO: Implement attachment upload
            });
            setReplyMessage('');
            fetchTicketDetails(); // Refresh to show new message
            toast.success("Reply sent");
        } catch (error) {
            console.error("Failed to send reply:", error);
            toast.error("Failed to send reply");
        } finally {
            setSending(false);
        }
    };

    const handleStatusUpdate = async (status: string) => {
        try {
            await supportApi.updateStatus(ticketId!, status, user!.id);
            fetchTicketDetails();
            toast.success(`Ticket marked as ${status.toLowerCase()}`);
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error("Failed to update status");
        }
    };

    const getStatusTheme = (status: string) => {
        switch (status) {
            case 'OPEN': return { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-200' };
            case 'UNDER_REVIEW': return { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-200' };
            case 'RESOLVED': return { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-200' };
            case 'CLOSED': return { color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-200' };
            default: return { color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200' };
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading ticket details...</div>;
    }

    if (!ticket) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <h3 className="text-xl font-bold">Ticket not found</h3>
                <Button onClick={() => navigate('/dashboard/support')}>Back to Support</Button>
            </div>
        );
    }

    const theme = getStatusTheme(ticket.status);

    return (
        <div className="max-w-5xl mx-auto pb-12 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/support')} className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white line-clamp-1">
                            {ticket.title}
                        </h1>
                        <Badge variant="outline" className={cn("capitalize font-bold", theme.color, theme.bg, theme.border)}>
                            {ticket.status.replace('_', ' ')}
                        </Badge>
                    </div>
                    <p className="text-sm text-slate-500 font-medium flex items-center gap-2 mt-1">
                        <span className="capitalize">{ticket.category.toLowerCase()}</span>
                        <span>•</span>
                        <span>ID: #{ticket.id.substring(0, 8)}</span>
                        <span>•</span>
                        <span>{format(new Date(ticket.createdAt), 'PPP p')}</span>
                    </p>
                </div>
                <div className="ml-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {ticket.status !== 'RESOLVED' && (
                                <DropdownMenuItem onClick={() => handleStatusUpdate('RESOLVED')}>
                                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Mark as Resolved
                                </DropdownMenuItem>
                            )}
                            {ticket.status === 'RESOLVED' && (
                                <DropdownMenuItem onClick={() => handleStatusUpdate('OPEN')}>
                                    <Clock className="mr-2 h-4 w-4 text-blue-500" /> Reopen Ticket
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Chat Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden flex flex-col min-h-[600px] max-h-[80vh]">
                        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-slate-400" />
                                    Support Conversation
                                </CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 dark:bg-slate-950/30">
                            {/* Original Issue Description */}
                            <div className="flex gap-4">
                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                    <AvatarFallback className="bg-slate-200 text-slate-600 font-bold">You</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1 max-w-[85%]">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">You</span>
                                        <span className="text-xs text-slate-400">{format(new Date(ticket.createdAt), 'p')}</span>
                                    </div>
                                    <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none shadow-sm text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                        {ticket.description}
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-slate-50 dark:bg-slate-950 px-2 text-slate-400 font-bold">
                                        Responses
                                    </span>
                                </div>
                            </div>

                            {/* Messages List */}
                            {ticket.messages && ticket.messages.map((msg: any) => (
                                <div key={msg.id} className={cn("flex gap-4", msg.isAdminReply ? "flex-row-reverse" : "")}>
                                    <Avatar className={cn("h-10 w-10 border-2 border-white shadow-sm", msg.isAdminReply ? "bg-blue-600" : "")}>
                                        {msg.isAdminReply ? (
                                            <AvatarFallback className="bg-blue-600 text-white font-bold">S</AvatarFallback>
                                        ) : (
                                            <AvatarFallback className="bg-slate-200 text-slate-600 font-bold">You</AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div className={cn("space-y-1 max-w-[85%]", msg.isAdminReply ? "items-end flex flex-col" : "")}>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                {msg.isAdminReply ? 'Support Team' : 'You'}
                                            </span>
                                            <span className="text-xs text-slate-400">{format(new Date(msg.sentAt), 'p')}</span>
                                        </div>
                                        <div className={cn(
                                            "p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
                                            msg.isAdminReply
                                                ? "bg-blue-600 text-white rounded-tr-none"
                                                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-none"
                                        )}>
                                            {msg.message}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </CardContent>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                            {ticket.status === 'CLOSED' ? (
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <p className="text-slate-500 font-medium text-sm">This ticket is closed. You can't reply to it anymore.</p>
                                    <Button variant="link" onClick={() => handleStatusUpdate('OPEN')} className="text-blue-600 font-bold">Reopen Ticket</Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Textarea
                                        placeholder="Type your reply here..."
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        className="min-h-[100px] resize-none border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500 rounded-xl"
                                    />
                                    <div className="flex items-center justify-between">
                                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
                                            <Paperclip className="h-4 w-4 mr-2" />
                                            Attach File
                                        </Button>
                                        <Button
                                            onClick={handleSendReply}
                                            disabled={!replyMessage.trim() || sending}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-xl"
                                        >
                                            {sending ? 'Sending...' : 'Send Reply'}
                                            {!sending && <Send className="ml-2 h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
                        <CardHeader>
                            <CardTitle className="text-base font-bold">Ticket Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-sm text-slate-500">Status</span>
                                <Badge variant="outline" className={cn("capitalize font-bold", theme.color, theme.bg, theme.border)}>
                                    {ticket.status.replace('_', ' ')}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-sm text-slate-500">Priority</span>
                                <Badge variant="secondary" className={cn(
                                    "capitalize font-bold",
                                    ticket.priority === 'CRITICAL' ? 'bg-red-100 text-red-600' :
                                        ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-600' :
                                            'bg-slate-100 text-slate-600'
                                )}>
                                    {ticket.priority}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-sm text-slate-500">Category</span>
                                <span className="text-sm font-semibold">{ticket.category}</span>
                            </div>
                            <div className="pt-2">
                                <span className="text-sm text-slate-500 block mb-2">Ticket Owner</span>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.avatar} />
                                        <AvatarFallback>Me</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-bold">{user?.firstName} {user?.lastName}</p>
                                        <p className="text-xs text-slate-400">{user?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                        <CardContent className="p-6">
                            <h3 className="font-bold mb-2">Need faster help?</h3>
                            <p className="text-sm text-slate-300 mb-4">Urgent issues can be escalated if not resolved within 24 hours.</p>
                            <Button variant="secondary" className="w-full font-bold">Escalate Ticket</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TicketDetailPage;
