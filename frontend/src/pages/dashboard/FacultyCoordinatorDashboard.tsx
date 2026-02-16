import React from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Users,
    MessageSquare,
    ClipboardList,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store';

const FacultyCoordinatorDashboard = () => {
    const { user } = useAuthStore();

    const stats = [
        { label: 'Event Registrations', value: 156, icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
        { label: 'Pending Attendance', value: 45, icon: ClipboardList, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
        { label: 'Active Discussions', value: 12, icon: MessageSquare, color: 'text-green-500', bgColor: 'bg-green-500/10' },
        { label: 'Upcoming Events', value: 3, icon: Calendar, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    ];

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold">
                    Coordinator Dashboard 📋
                </h1>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                    Manage registrations, attendance, and participant engagement.
                </p>
            </motion.div>

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
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Registrations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex justify-between items-center border-b pb-2">
                                    <div>
                                        <p className="font-medium text-sm">Student Name {i}</p>
                                        <p className="text-xs text-slate-500">Registered for Hackathon</p>
                                    </div>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Confirmed</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default FacultyCoordinatorDashboard;
