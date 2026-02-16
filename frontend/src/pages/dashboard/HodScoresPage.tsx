import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    Lock,
    CheckCircle,
    AlertCircle,
    Search,
    Filter,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { judgeService } from '@/services/judgeService';

const HodScoresPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [scores, setScores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEventLocked, setIsEventLocked] = useState(false);
    const [eventTitle, setEventTitle] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!eventId) return;
            try {
                const data = await judgeService.getPendingEvaluations(eventId);
                setScores(data);

                const lockStatus = await judgeService.getLockStatus(eventId);
                setIsEventLocked(lockStatus);

                if (data.length > 0) {
                    setEventTitle(data[0].submission?.event?.title || 'Event Details');
                }
            } catch (error) {
                console.error("Failed to fetch pending scores", error);
                toast.error("Failed to load evaluation data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [eventId]);

    const handleLock = async () => {
        if (!eventId) return;
        if (confirm(`Are you sure you want to lock ALL scores for this event? This action will generate the leaderboard and cannot be undone easily.`)) {
            try {
                await judgeService.lockEventScores(eventId);
                toast.success("Scores locked and finalized successfully!");
                setIsEventLocked(true);
            } catch (error) {
                toast.error("Failed to lock scores");
            }
        }
    };

    if (loading) return <div className="p-8">Loading scores...</div>;

    return (
        <div className="space-y-6 pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{eventTitle}</h1>
                        <p className="text-slate-500">Review judge evaluations and finalize results.</p>
                    </div>
                </div>
                <Button
                    variant={isEventLocked ? "secondary" : "default"}
                    disabled={isEventLocked || scores.length === 0}
                    onClick={handleLock}
                >
                    <Lock className="mr-2 h-4 w-4" />
                    {isEventLocked ? "Scores Locked" : "Lock & Finalize Results"}
                </Button>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader className="border-b">
                        <CardTitle className="flex items-center justify-between">
                            <span>Evaluated Submissions</span>
                            <Badge variant="outline">{scores.length} Evaluated</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Project / Team</th>
                                        <th className="px-6 py-4 font-medium">Judge</th>
                                        <th className="px-6 py-4 font-medium">Criteria Breakdown (JSON)</th>
                                        <th className="px-6 py-4 font-medium">Total Score</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {scores.map((score) => (
                                        <tr key={score.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold">{score.submission?.projectTitle || 'Untitled Project'}</div>
                                                <div className="text-xs text-slate-400">ID: {score.submission?.id}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {score.judge?.name || 'Unknown Judge'}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-mono max-w-xs truncate">
                                                {score.criteriaScores}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-lg font-bold text-primary">{score.totalScore}</span>
                                                <span className="text-xs text-slate-400"> / 100</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/judge/evaluate/${score.submission?.id}`)}>
                                                    View Form <ArrowRight className="ml-1 h-3 w-3" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {scores.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                                                No submitted evaluations found for this event.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {isEventLocked && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-500/10 border border-green-500 text-green-700 dark:text-green-400 p-6 rounded-xl flex items-center gap-4"
                    >
                        <CheckCircle className="h-8 w-8" />
                        <div>
                            <h3 className="font-bold text-lg">Results Finalized!</h3>
                            <p className="text-sm opacity-90">The leaderboard has been generated and certificates can now be issued to winners. Scores are locked for compliance.</p>
                            <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white border-0" onClick={() => navigate('/leaderboard')}>
                                View Leaderboard
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default HodScoresPage;
