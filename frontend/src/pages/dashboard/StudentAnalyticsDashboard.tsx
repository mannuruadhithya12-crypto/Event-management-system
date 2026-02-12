import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { useAuthStore } from '@/store';
import { api, analyticsApi } from '@/lib/api';

const StudentAnalyticsDashboard = () => {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            try {
                // Fetch from /api/analytics/student/:userId
                // The analyticsApi.getStudentStats returns:
                // { totalPoints, certificatesEarned, hackathonsParticipated, clubsJoined, badges, recentActivities, participationTrends, collegeRank }

                // We might need to map some of these or fall back to defaults if backend doesn't provide everything yet
                const data = await analyticsApi.getStudentStats(user.id);

                // Map backend response to component state structure
                const mappedStats = {
                    eventsRegistered: data.eventsRegistered || 0, // Backend might need to add this
                    hackathonsJoined: data.hackathonsParticipated || 0,
                    wins: data.wins || 0, // Backend might need to add this
                    certificatesEarned: data.certificatesEarned || 0,
                    attendanceRate: data.attendanceRate || 0, // Backend might need to add this
                    activityTrend: data.participationTrends?.map((pt: any) => ({
                        month: pt.month.substring(0, 3),
                        points: pt.events * 10 // Mock points calculation from events
                    })) || [],
                    performance: [
                        { name: 'Coding', value: 85 }, // Placeholder until backend has skills scoring
                        { name: 'Design', value: 70 },
                        { name: 'Presentation', value: 90 },
                        { name: 'Teamwork', value: 95 },
                    ]
                };
                setStats(mappedStats);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
                // Fallback mock
                setStats({
                    eventsRegistered: 0,
                    hackathonsJoined: 0,
                    wins: 0,
                    certificatesEarned: 0,
                    activityTrend: [],
                    performance: []
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    if (loading) return <div>Loading Analytics...</div>;
    if (!stats) return <div>No analytics available</div>;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">My Analytics</h1>
            <p className="text-muted-foreground">Track your improved performance and participation.</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Events Registered</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.eventsRegistered}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Hackathons Joined</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.hackathonsJoined}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Wins</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-500">{stats.wins} 🏆</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Certificates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-500">{stats.certificatesEarned}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Activity Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.activityTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="points" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Skill Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.performance} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#82ca9d" name="Score" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StudentAnalyticsDashboard;
