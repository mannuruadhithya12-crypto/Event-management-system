import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { useAuthStore } from '@/store';
import { api } from '@/lib/api';

const FacultyAnalyticsDashboard = () => {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data fetch
        const data = {
            totalEvents: 15,
            totalStudents: 1240,
            avgRating: 4.8,
            participationTrend: [
                { month: 'Jan', students: 120 },
                { month: 'Feb', students: 200 },
                { month: 'Mar', students: 180 },
                { month: 'Apr', students: 250 },
                { month: 'May', students: 300 },
            ],
            eventSuccess: [
                { name: 'Hackathon 1', participants: 300, success: 90 },
                { name: 'Workshop 1', participants: 50, success: 75 },
                { name: 'Seminar', participants: 100, success: 85 },
            ]
        };
        setStats(data);
        setLoading(false);
    }, []);

    if (loading) return <div>Loading Analytics...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Faculty Analytics</h1>
            <p className="text-muted-foreground">Detailed insights into your events and student performance.</p>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalEvents}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Participants</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStudents}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Event Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgRating}/5.0</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Participation Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.participationTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="students" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Event Success Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.eventSuccess}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="participants" fill="#82ca9d" name="Participants" />
                                <Bar dataKey="success" fill="#8884d8" name="Success Score" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default FacultyAnalyticsDashboard;
