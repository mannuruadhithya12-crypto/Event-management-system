import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    Users,
    FileText,
    AlertTriangle,
    TrendingUp,
    Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store';

const DeanDashboard = () => {
    const { user } = useAuthStore();

    const stats = [
        { label: 'Total Departments', value: 8, icon: Building, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
        { label: 'Active Events', value: 24, icon: Activity, color: 'text-green-500', bgColor: 'bg-green-500/10' },
        { label: 'Pending Audits', value: 5, icon: AlertTriangle, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
        { label: 'System Health', value: '98%', icon: Shield, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    ];

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold">
                    Dean's Overview 🎓
                </h1>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                    Campus-wide governance and performance monitoring.
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
                        <CardTitle>Department Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-slate-500">
                            Analytics Widget Placeholder
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Governance Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-4 border-b pb-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    <div>
                                        <p className="font-medium text-sm">Budget Exceeded - CS Dept</p>
                                        <p className="text-xs text-slate-500">2 hours ago</p>
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

import { Building } from 'lucide-react'; // Import missing icon

export default DeanDashboard;
