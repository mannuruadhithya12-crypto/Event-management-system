import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users,
    Trophy,
    Calendar,
    ArrowRight,
    TrendingUp,
    FileText,
    CheckCircle,
    XCircle,
    Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store';
import { mockColleges, mockEvents } from '@/data/mockData';
import { judgeService } from '@/services/judgeService';
import { toast } from 'sonner';

const HodDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [pendingSummary, setPendingSummary] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await judgeService.getPendingSummary();
                setPendingSummary(data);
            } catch (error) {
                console.error("Failed to fetch HOD stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const totalPending = pendingSummary.reduce((sum, item) => sum + (item.pendingCount || 0), 0);
    const lockedEvents = pendingSummary.filter(item => item.isLocked).length;

    const stats = [
        { label: 'Pending Evaluations', value: totalPending, icon: FileText, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
        { label: 'Locked/Finalized', value: lockedEvents, icon: Lock, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
        { label: 'Active Events', value: pendingSummary.length, icon: Calendar, color: 'text-green-500', bgColor: 'bg-green-500/10' },
        { label: 'Total Students', value: 450, icon: Users, color: 'text-purple-500', bgColor: 'bg-purple-500/10' }, // Still mock
    ];

    const handleLock = async (eventId: string, title: string) => {
        if (confirm(`Are you sure you want to lock scores for ${title}? This will trigger leaderboard generation and finalize the results.`)) {
            try {
                await judgeService.lockEventScores(eventId);
                toast.success(`Scores locked for ${title}. Leaderboard generated.`);
                // Refresh
                const data = await judgeService.getPendingSummary();
                setPendingSummary(data);
            } catch (e) {
                toast.error("Failed to lock scores.");
            }
        }
    };

    if (loading) return <div className="p-8">Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold">
                        Welcome, Director {user?.lastName}! 🏛️
                    </h1>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                        Overview of department activities, approvals, and performance.
                    </p>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">{stat.label}</p>
                                        <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                                    </div>
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column: Approvals & Tasks */}
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5 text-[hsl(var(--navy))]" />
                                Event Scoring & Lock Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {pendingSummary.map((event) => (
                                    <div
                                        key={event.eventId}
                                        className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 dark:border-slate-700"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold">{event.eventTitle}</h4>
                                                <div className="flex gap-2">
                                                    <Badge variant={event.isLocked ? "default" : "secondary"}>
                                                        {event.isLocked ? "LOCKED" : "OPEN"}
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        {event.pendingCount} Pending
                                                    </Badge>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                {event.isLocked ? "Scores finalized. Leaderboard active." : "Waiting for HOD review and lock."}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/dashboard/hod/scores/${event.eventId}`)}
                                            >
                                                <FileText className="mr-2 h-4 w-4" />
                                                Review
                                            </Button>
                                            <Button
                                                disabled={event.isLocked}
                                                size="sm"
                                                onClick={() => handleLock(event.eventId, event.eventTitle)}
                                            >
                                                <Lock className="mr-2 h-4 w-4" />
                                                {event.isLocked ? "Finalized" : "Lock"}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {pendingSummary.length === 0 && (
                                    <div className="py-8 text-center text-slate-500 text-sm italic">
                                        No active events found for scoring review.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Analytics & Audit */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                                Department Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Event Participation</span>
                                    <span className="font-semibold">82%</span>
                                </div>
                                <Progress value={82} className="h-2" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Average Score</span>
                                    <span className="font-semibold">7.8/10</span>
                                </div>
                                <Progress value={78} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Audit Logs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 text-sm">
                                {[
                                    { user: "Faculty Smith", action: "Approved Content", time: "10m ago" },
                                    { user: "Super Admin", action: "System Update", time: "1h ago" },
                                    { user: "Judge Robert", action: "Submitted Scores", time: "2h ago" }
                                ].map((log, i) => (
                                    <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0">
                                        <div>
                                            <p className="font-medium">{log.user}</p>
                                            <p className="text-slate-500 text-xs">{log.action}</p>
                                        </div>
                                        <span className="text-slate-400 text-xs">{log.time}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default HodDashboard;
