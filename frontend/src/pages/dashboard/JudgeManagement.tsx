import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    UserPlus,
    Gavel,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Calendar,
    CheckCircle2,
    XCircle,
    UserCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { judgeService } from '@/services/judgeService';
import { api } from '@/lib/api';

const JudgeManagement = () => {
    const [judges, setJudges] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEventId, setSelectedEventId] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const judgesData = await judgeService.getAvailableJudges();
                setJudges(judgesData);

                // Fetch all events to assign judges to
                const eventsResponse: any = await api.get('/events');
                setEvents(eventsResponse.content || eventsResponse);
            } catch (error) {
                console.error("Failed to load judge management data", error);
                toast.error("Failed to load judges or events");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleAssign = async (judgeId: string) => {
        if (!selectedEventId) {
            toast.error("Please select an event first");
            return;
        }
        setIsAssigning(true);
        try {
            await judgeService.assignJudgeToEvent(selectedEventId, judgeId);
            toast.success("Judge assigned successfully!");
        } catch (error) {
            toast.error("Assignment failed");
        } finally {
            setIsAssigning(false);
        }
    };

    const filteredJudges = judges.filter(judge =>
        judge.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        judge.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        judge.department?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="p-8">Loading judge management...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Judge Management</h1>
                    <p className="text-slate-500">Invite, manage, and assign judges to upcoming events.</p>
                </div>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite New Judge
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-4">
                {/* Filters & Selection */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                            Assignment Target
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Event</label>
                            <select
                                className="w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-700"
                                value={selectedEventId}
                                onChange={(e) => setSelectedEventId(e.target.value)}
                            >
                                <option value="">Choose an event...</option>
                                {events.map(event => (
                                    <option key={event.id} value={event.id}>{event.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="pt-4 border-t dark:border-slate-800">
                            <p className="text-xs text-slate-500 italic">
                                Select an event from the list, then click 'Assign' on a judge to add them to the evaluation panel.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Judge List */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Search judges by name, email, or department..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" />
                            Filters
                        </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <AnimatePresence>
                            {filteredJudges.map((judge, index) => (
                                <motion.div
                                    key={judge.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                        {judge.avatar ? (
                                                            <img src={judge.avatar} alt="" className="h-full w-full rounded-full object-cover" />
                                                        ) : (
                                                            <UserCircle className="h-8 w-8 text-slate-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">{judge.name}</h3>
                                                        <p className="text-xs text-slate-500">{judge.department || 'External'}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="bg-primary/5 text-primary">
                                                    JUDGE
                                                </Badge>
                                            </div>

                                            <div className="mt-4 space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <Mail className="h-4 w-4" />
                                                    {judge.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <Calendar className="h-4 w-4" />
                                                    Joined {new Date(judge.joinedAt).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="mt-6 flex gap-2">
                                                <Button
                                                    className="flex-1"
                                                    variant={selectedEventId ? "default" : "outline"}
                                                    disabled={!selectedEventId || isAssigning}
                                                    onClick={() => handleAssign(judge.id)}
                                                >
                                                    {isAssigning ? "Assigning..." : "Assign to Event"}
                                                </Button>
                                                <Button variant="outline" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {filteredJudges.length === 0 && (
                            <div className="col-span-2 py-12 text-center text-slate-500 italic">
                                No judges found matching your criteria.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JudgeManagement;
