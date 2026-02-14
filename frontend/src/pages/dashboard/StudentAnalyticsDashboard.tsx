import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import { useAuthStore } from '@/store';
import { analyticsApi } from '@/lib/api';
import {
    Trophy,
    Calendar,
    Award,
    TrendingUp,
    Activity,
    Star,
    Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const StudentAnalyticsDashboard = () => {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            try {
                // Mock Data for sophisticated graphs
                await new Promise(resolve => setTimeout(resolve, 1000));

                const mockData = {
                    eventsRegistered: 24,
                    hackathonsJoined: 8,
                    wins: 3,
                    certificatesEarned: 12,
                    totalPoints: 2450,
                    rank: 42,

                    // Specific Graph Data
                    activityTrend: [
                        { month: 'Jan', points: 120, events: 2 },
                        { month: 'Feb', points: 300, events: 5 },
                        { month: 'Mar', points: 250, events: 3 },
                        { month: 'Apr', points: 450, events: 8 },
                        { month: 'May', points: 380, events: 6 },
                        { month: 'Jun', points: 500, events: 9 },
                    ],

                    clubParticipation: [
                        { name: 'AI Club', value: 45 },
                        { name: 'Robotics', value: 30 },
                        { name: 'Debate', value: 15 },
                        { name: 'Music', value: 10 },
                    ],

                    skills: [
                        { subject: 'Coding', A: 120, fullMark: 150 },
                        { subject: 'Design', A: 98, fullMark: 150 },
                        { subject: 'Speaking', A: 86, fullMark: 150 },
                        { subject: 'Teamwork', A: 99, fullMark: 150 },
                        { subject: 'Leadership', A: 85, fullMark: 150 },
                    ],

                    upcomingCommitments: [
                        { id: 1, title: 'Hackathon Finale', date: 'Tomorrow, 10:00 AM', type: 'High Priority' },
                        { id: 2, title: 'AI Workshop', date: 'Fri, 2:00 PM', type: 'Learning' },
                        { id: 3, title: 'Club Meeting', date: 'Sat, 5:00 PM', type: 'Routine' },
                    ]
                };
                setStats(mockData);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    if (loading) return (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--teal))]" />
                <p className="text-slate-500 animate-pulse">Analyzing your performance data...</p>
            </div>
        </div>
    );

    if (!stats) return <div>No analytics available</div>;

    const COLORS = ['hsl(var(--teal))', '#8884d8', '#ffc658', '#ff8042'];

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics Overview</h1>
                <p className="text-muted-foreground">Detailed insights into your academic and extracurricular performance.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Events Attended</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.eventsRegistered}</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hackathons</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.hackathonsJoined}</div>
                        <p className="text-xs text-muted-foreground">{stats.wins} Podiums 🏆</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Certificates</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.certificatesEarned}</div>
                        <p className="text-xs text-muted-foreground">Verified Credentials</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalPoints}</div>
                        <p className="text-xs text-muted-foreground">Campus Rank #{stats.rank}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Activity Trend - Area Chart */}
                <Card className="col-span-4 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
                    <CardHeader>
                        <CardTitle>Activity Heatmap Trend</CardTitle>
                        <CardDescription>Your participation intensity over the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.activityTrend}>
                                    <defs>
                                        <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--teal))" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="hsl(var(--teal))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                                    <Area type="monotone" dataKey="points" stroke="hsl(var(--teal))" strokeWidth={3} fillOpacity={1} fill="url(#colorPoints)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Club Participation - Pie Chart */}
                <Card className="col-span-3 shadow-md">
                    <CardHeader>
                        <CardTitle>Club Participation</CardTitle>
                        <CardDescription>Engagement break-down by club.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.clubParticipation}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {(stats.clubParticipation || []).map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-4 text-xs text-muted-foreground mt-4">
                            {(stats.clubParticipation || []).map((entry: any, index: number) => (
                                <div key={entry.name} className="flex items-center gap-1">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    {entry.name}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Commitments */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1 shadow-md bg-white dark:bg-slate-900 border-t-4 border-t-indigo-500">
                    <CardHeader>
                        <CardTitle>Upcoming Commitments</CardTitle>
                        <CardDescription>Your schedule for the next few days.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {(stats.upcomingCommitments || []).map((item: any) => (
                                <div key={item.id} className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border-l-4 border-indigo-200 dark:border-indigo-900">
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{item.title}</p>
                                        <p className="text-xs text-muted-foreground">{item.date}</p>
                                    </div>
                                    <Badge variant={item.type === 'High Priority' ? 'destructive' : 'secondary'}>
                                        {item.type}
                                    </Badge>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-xs text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50">
                                View Full Calendar
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Achievements Showcase */}
                <Card className="col-span-1 shadow-md border-t-4 border-t-amber-500">
                    <CardHeader>
                        <CardTitle>Recent Badges</CardTitle>
                        <CardDescription>Badges earned this semester.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 w-24">
                                <Trophy className="h-8 w-8 text-amber-500" />
                                <span className="text-[10px] font-bold text-center">Hackathon Winner</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 w-24">
                                <Star className="h-8 w-8 text-blue-500" />
                                <span className="text-[10px] font-bold text-center">Top Contributor</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 w-24">
                                <Activity className="h-8 w-8 text-green-500" />
                                <span className="text-[10px] font-bold text-center">Consistent</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StudentAnalyticsDashboard;
