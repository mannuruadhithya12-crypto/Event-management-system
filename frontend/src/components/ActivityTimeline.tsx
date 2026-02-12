import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Activity as ActivityIcon,
    PlusCircle,
    UserPlus,
    Trophy,
    Bell,
    ExternalLink,
    ChevronRight,
    Users,
    Code,
    Award
} from 'lucide-react';
import { activityApi } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
    id: string;
    type: string;
    description: string;
    createdAt: string;
    targetId?: string;
    targetName?: string;
}

interface ActivityTimelineProps {
    userId?: string;
    clubId?: string;
    limit?: number;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ userId, clubId, limit = 5 }) => {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                let data = [];
                if (userId) {
                    data = await activityApi.getByUser(userId);
                } else if (clubId) {
                    data = await activityApi.getByUser(clubId); // Using clubId as key for now
                } else {
                    data = await activityApi.getAll();
                }
                setActivities(data.slice(0, limit));
            } catch (error) {
                console.error('Failed to fetch activities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [userId, clubId, limit]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'CLUB_RECRUITMENT': return <PlusCircle className="h-4 w-4 text-[hsl(var(--teal))]" />;
            case 'CLUB_MEMBERSHIP': return <UserPlus className="h-4 w-4 text-blue-500" />;
            case 'CLUB_ACHIEVEMENT': return <Trophy className="h-4 w-4 text-orange-500" />;
            case 'TEAM_CREATED': return <Users className="h-4 w-4 text-purple-500" />;
            case 'SUBMISSION_MADE': return <Code className="h-4 w-4 text-emerald-500" />;
            case 'HACKATHON_WON': return <Award className="h-4 w-4 text-yellow-500" />;
            default: return <Bell className="h-4 w-4 text-slate-400" />;
        }
    };

    if (loading) return (
        <div className="space-y-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 items-start animate-pulse">
                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0" />
                    <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
                    </div>
                </div>
            ))}
        </div>
    );

    if (activities.length === 0) return (
        <div className="text-center py-6 text-slate-500">
            <ActivityIcon className="h-8 w-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No recent activity recorded</p>
        </div>
    );

    return (
        <div className="relative space-y-6 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800 px-2">
            {activities.map((activity, idx) => (
                <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative flex gap-4 items-start"
                >
                    <div className="relative z-10 h-8 w-8 rounded-full bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-sm">
                        {getIcon(activity.type)}
                    </div>
                    <div className="flex-1 pt-0.5">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                            {activity.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                            </span>
                            {activity.targetId && (
                                <>
                                    <span className="text-slate-200 dark:text-slate-800">•</span>
                                    <button className="text-[10px] font-black text-[hsl(var(--teal))] hover:underline uppercase tracking-widest">
                                        Details
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default ActivityTimeline;
