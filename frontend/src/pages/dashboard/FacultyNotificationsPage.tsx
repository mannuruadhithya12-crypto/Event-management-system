import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Bell,
    CheckCircle,
    AlertCircle,
    Info,
    X,
    Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const FacultyNotificationsPage = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            // TODO: Implement notifications API
            // Mock data for demonstration
            setNotifications([
                {
                    id: '1',
                    type: 'approval',
                    title: 'New Event Registration',
                    message: 'John Doe registered for AI Workshop 2024',
                    timestamp: new Date(Date.now() - 1000 * 60 * 5),
                    read: false,
                },
                {
                    id: '2',
                    type: 'submission',
                    title: 'Hackathon Submission',
                    message: 'Team Alpha submitted their project for Web Dev Hackathon',
                    timestamp: new Date(Date.now() - 1000 * 60 * 30),
                    read: false,
                },
                {
                    id: '3',
                    type: 'info',
                    title: 'Event Starting Soon',
                    message: 'Data Science Seminar starts in 2 hours',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60),
                    read: true,
                },
                {
                    id: '4',
                    type: 'approval',
                    title: 'Certificate Request',
                    message: '15 students requested certificates for completed workshop',
                    timestamp: new Date(Date.now() - 1000 * 60 * 120),
                    read: true,
                },
            ]);
        } catch (error: any) {
            console.error('Failed to load notifications:', error);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            // TODO: Implement mark as read API
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
            toast.success('Marked as read');
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            // TODO: Implement mark all as read API
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            // TODO: Implement delete API
            setNotifications(prev => prev.filter(n => n.id !== id));
            toast.success('Notification deleted');
        } catch (error) {
            toast.error('Failed to delete notification');
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'approval':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'submission':
                return <AlertCircle className="h-5 w-5 text-blue-500" />;
            case 'info':
                return <Info className="h-5 w-5 text-slate-500" />;
            default:
                return <Bell className="h-5 w-5 text-slate-500" />;
        }
    };

    const getTimeAgo = (timestamp: Date) => {
        const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !n.read;
        return n.type === filter;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold">Notifications</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Notifications</SelectItem>
                            <SelectItem value="unread">Unread Only</SelectItem>
                            <SelectItem value="approval">Approvals</SelectItem>
                            <SelectItem value="submission">Submissions</SelectItem>
                            <SelectItem value="info">Information</SelectItem>
                        </SelectContent>
                    </Select>
                    {unreadCount > 0 && (
                        <Button variant="outline" onClick={handleMarkAllAsRead}>
                            Mark All as Read
                        </Button>
                    )}
                </div>
            </motion.div>

            {/* Notifications List */}
            {filteredNotifications.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <Bell className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                        <p className="text-slate-500">You're all caught up!</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <Card className={`hover:shadow-md transition-shadow ${!notification.read ? 'border-l-4 border-l-blue-500' : ''}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1">{getIcon(notification.type)}</div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold">{notification.title}</h3>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-2">
                                                        {getTimeAgo(notification.timestamp)}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {!notification.read && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleMarkAsRead(notification.id)}
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(notification.id)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FacultyNotificationsPage;
