import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, Check, Trash2, Info,
    CheckCircle2, AlertTriangle, XCircle,
    ChevronRight, ArrowRight
} from 'lucide-react';
import { notificationApi } from '@/lib/api';
import { useAuthStore, useNotificationStore } from '@/store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = () => {
    const { user } = useAuthStore();
    const { notifications, unreadCount } = useNotificationStore();
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await notificationApi.getByUser(user.id);
            // We should update the store here, but for now we'll just handle local state if store isn't reactive to API yet
            // Ideally the store should have a 'fetch' action
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
            case 'WARNING': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
            case 'ERROR': return <XCircle className="h-5 w-5 text-red-500" />;
            default: return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    return (
        <div className="w-80 sm:w-96 flex flex-col h-[500px] bg-white dark:bg-slate-900 shadow-2xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[hsl(var(--orange))] text-[10px] font-bold text-white uppercase tracking-wider">
                            {unreadCount} New
                        </span>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-8 text-[hsl(var(--navy))] dark:text-[hsl(var(--teal))]"
                    onClick={() => {/* Mark all as read logic */ }}
                >
                    Mark all as read
                </Button>
            </div>

            <ScrollArea className="flex-1">
                {notifications.length > 0 ? (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {notifications.map((notif) => (
                            <motion.div
                                key={notif.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={cn(
                                    "p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative group",
                                    !notif.isRead && "bg-slate-50/80 dark:bg-slate-800/20"
                                )}
                            >
                                <div className="flex gap-3">
                                    <div className="mt-1 shrink-0">
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={cn("text-sm font-semibold text-slate-900 dark:text-white", !notif.isRead && "font-bold")}>
                                                {notif.title}
                                            </p>
                                            <span className="text-[10px] text-slate-400 shrink-0">
                                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                            {notif.message}
                                        </p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                                            <XCircle className="h-4 w-4 text-slate-400" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                        <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                            <Bell className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-medium">All caught up!</p>
                        <p className="text-xs text-slate-400 mt-1">Check back later for new alerts.</p>
                    </div>
                )}
            </ScrollArea>

            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <Button
                    variant="ghost"
                    className="w-full justify-center text-xs font-semibold text-slate-500 hover:text-[hsl(var(--navy))] dark:hover:text-[hsl(var(--teal))]"
                    onClick={() => {/* Full history logic */ }}
                >
                    View full notification history
                    <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
            </div>
        </div>
    );
};

export default NotificationCenter;
