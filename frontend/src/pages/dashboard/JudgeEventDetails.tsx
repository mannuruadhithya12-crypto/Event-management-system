import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Users, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { judgeService } from '@/services/judgeService';

interface Submission {
    id: string;
    title: string;
    abstract: string;
    status: string; // SUBMITTED, EVALUATED?
    teamName?: string;
}

const JudgeEventDetails = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            if (!eventId) return;
            try {
                const data = await judgeService.getEventSubmissions(eventId);
                setSubmissions(data);
            } catch (error) {
                console.error("Failed to fetch submissions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubmissions();
    }, [eventId]);

    if (loading) return <div className="p-8">Loading submissions...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Event Submissions</h1>
                    <p className="text-muted-foreground mt-2">
                        Select a submission to evaluate.
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate('/dashboard/judge/events')}>
                    Back to Events
                </Button>
            </div>

            <div className="grid gap-4">
                {submissions.length === 0 ? (
                    <div className="p-8 text-center border border-dashed rounded-xl">
                        No submissions found for this event.
                    </div>
                ) : (
                    submissions.map((sub, index) => (
                        <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 bg-card border rounded-xl flex justify-between items-center hover:border-primary/50 transition-colors"
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-semibold text-lg">{sub.title}</h3>
                                    {sub.status === 'EVALUATED' && (
                                        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                                            Evaluated
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1 max-w-xl">
                                    {sub.abstract}
                                </p>
                                {sub.teamName && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                        <Users className="w-3 h-3" />
                                        Team: {sub.teamName}
                                    </div>
                                )}
                            </div>

                            <Button onClick={() => navigate(`/dashboard/judge/evaluate/${sub.id}`)}>
                                Evaluate
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default JudgeEventDetails;
