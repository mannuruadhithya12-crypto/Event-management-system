import React from 'react';
import {
    Users,
    Calendar,
    Trophy,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Award,
    Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AnalyticsDashboard = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Ecosystem Analytics</h1>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Total Events', value: '124', icon: Calendar, trend: '+12%', color: 'blue' },
                    { label: 'Active Students', value: '3,842', icon: Users, trend: '+18%', color: 'teal' },
                    { label: 'Club Activities', value: '56', icon: Activity, trend: '+5%', color: 'orange' },
                    { label: 'Badges Awarded', value: '892', icon: Award, trend: '+24%', color: 'purple' },
                ].map((stat) => (
                    <Card key={stat.label} className="stat-card">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                                    <stat.icon className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                                </div>
                                <span className="flex items-center text-xs font-medium text-green-600">
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm text-slate-500">{stat.label}</p>
                                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <Card className="glass-card overflow-hidden">
                    <CardHeader>
                        <CardTitle>Event Engagement Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center text-slate-400">
                        {/* Recharts integration would go here */}
                        <div className="text-center">
                            <Activity className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>Engagement Chart Placeholder</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card overflow-hidden">
                    <CardHeader>
                        <CardTitle>Top Performing Clubs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[
                                { name: 'Tech Innovations Club', events: 12, score: 98 },
                                { name: 'E-Sports Arena', events: 8, score: 92 },
                                { name: 'Literary Society', events: 6, score: 85 },
                                { name: 'Entrepreneurship Cell', events: 7, score: 82 },
                            ].map((club) => (
                                <div key={club.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <Trophy className="h-5 w-5 text-[hsl(var(--navy))] dark:text-[hsl(var(--teal))]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{club.name}</p>
                                            <p className="text-xs text-slate-500">{club.events} events this month</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-[hsl(var(--teal))]">{club.score}%</p>
                                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                                            <div className="h-full bg-[hsl(var(--teal))]" style={{ width: `${club.score}%` }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
