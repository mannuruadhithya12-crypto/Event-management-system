import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Users,
    Calendar,
    Award,
    Activity,
    BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { facultyApi } from '@/lib/api';
import { toast } from 'sonner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const FacultyAnalyticsDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30');
    const [analytics, setAnalytics] = useState<any>({
        overview: {
            totalEvents: 0,
            totalHackathons: 0,
            totalParticipants: 0,
            avgAttendance: 0,
        },
        eventTrend: [],
        participationByDepartment: [],
        eventTypeDistribution: [],
        monthlyEngagement: [],
    });

    useEffect(() => {
        loadAnalytics();
    }, [timeRange]);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            const data: any = await facultyApi.getAnalytics();

            if (data) {
                setAnalytics({
                    overview: {
                        totalEvents: data.totalEvents || 0,
                        totalHackathons: data.totalHackathons || 0,
                        totalParticipants: data.totalParticipants || 0,
                        avgAttendance: data.avgAttendance || 0,
                    },
                    eventTrend: data.eventTrend || [],
                    participationByDepartment: data.participationByDepartment || [],
                    eventTypeDistribution: data.eventTypeDistribution || [],
                    monthlyEngagement: data.monthlyEngagement || [],
                });
            }
        } catch (error: any) {
            console.error('Failed to load analytics:', error);
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <div className="grid gap-4 md:grid-cols-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
                </div>
                <Skeleton className="h-96 w-full" />
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
                    <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Track performance and engagement metrics
                    </p>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-48">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last 90 days</SelectItem>
                        <SelectItem value="365">Last year</SelectItem>
                    </SelectContent>
                </Select>
            </motion.div>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Total Events</p>
                                <p className="text-3xl font-bold mt-1">{analytics.overview.totalEvents}</p>
                                <p className="text-xs text-green-500 mt-1">+12% from last month</p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Total Hackathons</p>
                                <p className="text-3xl font-bold mt-1">{analytics.overview.totalHackathons}</p>
                                <p className="text-xs text-green-500 mt-1">+8% from last month</p>
                            </div>
                            <Award className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Total Participants</p>
                                <p className="text-3xl font-bold mt-1">{analytics.overview.totalParticipants}</p>
                                <p className="text-xs text-green-500 mt-1">+15% from last month</p>
                            </div>
                            <Users className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Avg Attendance</p>
                                <p className="text-3xl font-bold mt-1">{analytics.overview.avgAttendance}%</p>
                                <p className="text-xs text-green-500 mt-1">+5% from last month</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-amber-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Event Trend Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Event & Hackathon Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.eventTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="events" stroke="#0088FE" strokeWidth={2} />
                            <Line type="monotone" dataKey="hackathons" stroke="#00C49F" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Charts Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Participation by Department */}
                <Card>
                    <CardHeader>
                        <CardTitle>Participation by Department</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics.participationByDepartment}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {analytics.participationByDepartment.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Event Type Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Event Type Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.eventTypeDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8">
                                    {analytics.eventTypeDistribution.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Engagement */}
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Engagement (Attendance vs Registrations)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.monthlyEngagement}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="attendance" fill="#0088FE" />
                            <Bar dataKey="registrations" fill="#00C49F" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default FacultyAnalyticsDashboard;
