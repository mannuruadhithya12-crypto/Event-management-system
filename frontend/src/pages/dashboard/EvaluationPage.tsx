import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { judgeService } from '@/services/judgeService';

interface RubricItem {
    name: string;
    maxScore: number;
}

const EvaluationPage = () => {
    const { submissionId } = useParams();
    const navigate = useNavigate();

    // Mock Rubric removed in favor of dynamic fetch

    const [scores, setScores] = useState<Record<string, number>>({});
    const [feedback, setFeedback] = useState('');
    const [rubric, setRubric] = useState<RubricItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        const init = async () => {
            if (!submissionId) return;
            try {
                // 1. Fetch Submission Score (if exists) AND Submission details (to get eventId)
                // Existing service: getSubmissionScore returns JudgeScore.
                // JudgeScore has Submission, which has Event.
                const scoreData = await judgeService.getSubmissionScore(submissionId);
                let eventId = '';

                if (scoreData) {
                    setFeedback(scoreData.feedback || '');
                    if (scoreData.criteriaScores) {
                        setScores(JSON.parse(scoreData.criteriaScores));
                    }
                    if (!scoreData.isDraft) { // status !== 'DRAFT'
                        setIsLocked(true);
                    }
                    // Extract eventId from scoreData -> submission -> event
                    if (scoreData.submission?.event?.id) {
                        eventId = scoreData.submission.event.id;
                    }
                }

                // If no score yet, we need to fetch submission details to get Event ID.
                if (!eventId) {
                    // Fetch submission directly using api instance
                    const submission = await import('@/lib/api').then(m => m.api.get<any>(`/submissions/${submissionId}`));
                    if (submission) {
                        eventId = submission.event?.id;
                    }
                }

                if (eventId) {
                    const rubricData = await judgeService.getRubric(eventId);
                    if (rubricData && rubricData.length > 0) {
                        setRubric(rubricData.map((r: any) => ({
                            name: r.criterionName,
                            maxScore: r.maxScore
                        })));
                    } else {
                        // Fallback defaults if no rubric defined
                        setRubric([
                            { name: 'Innovation', maxScore: 20 },
                            { name: 'Technical Complexity', maxScore: 20 },
                            { name: 'Presentation', maxScore: 20 },
                        ]);
                    }
                }
            } catch (error) {
                console.error("Error initializing evaluation page", error);
            } finally {
                setInitialLoad(false);
            }
        };
        init();
    }, [submissionId]);

    const handleScoreChange = (criteria: string, value: string, maxScore: number) => {
        if (isLocked) return;
        const numVal = Math.min(Math.max(0, Number(value)), maxScore);
        setScores(prev => ({
            ...prev,
            [criteria]: numVal
        }));
    };

    const calculateTotal = () => {
        return Object.values(scores).reduce((a, b) => a + b, 0);
    };

    const handleSubmit = async (isDraft: boolean) => {
        if (!submissionId) return;
        setLoading(true);
        try {
            const total = calculateTotal();
            await judgeService.submitEvaluation(submissionId, {
                criteriaScores: JSON.stringify(scores),
                totalScore: total,
                feedback,
                isDraft
            });

            if (isDraft) {
                toast.success("Draft saved successfully");
            } else {
                toast.success("Evaluation submitted successfully!");
                setIsLocked(true);
                setTimeout(() => navigate(-1), 1500); // Go back
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to submit evaluation");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoad) return <div className="p-8">Loading evaluation...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Evaluate Submission</h1>
                    <p className="text-muted-foreground">Review the project and assign scores.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground">Total Score</p>
                    <p className="text-4xl font-bold text-primary">{calculateTotal()} <span className="text-lg text-muted-foreground">/ 100</span></p>
                </div>
            </div>

            {/* Submission Assets Links (Mock) */}
            <div className="p-6 bg-card border rounded-xl space-y-4">
                <h3 className="font-semibold">Project Links</h3>
                <div className="flex gap-4">
                    <Button variant="outline" className="gap-2" onClick={() => window.open('#', '_blank')}>
                        <ExternalLink className="w-4 h-4" /> GitHub Repository
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={() => window.open('#', '_blank')}>
                        <ExternalLink className="w-4 h-4" /> Live Demo
                    </Button>
                </div>
            </div>

            {/* Rubric Form */}
            <div className="space-y-6">
                {rubric.map((item) => (
                    <motion.div
                        key={item.name}
                        className="p-6 bg-card border rounded-xl"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-lg font-medium">{item.name}</label>
                            <span className="text-sm text-muted-foreground">Max: {item.maxScore}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="0"
                                max={item.maxScore}
                                value={scores[item.name] || 0}
                                onChange={(e) => handleScoreChange(item.name, e.target.value, item.maxScore)}
                                disabled={isLocked}
                                className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="w-16">
                                <input
                                    type="number"
                                    min="0"
                                    max={item.maxScore}
                                    value={scores[item.name] || 0}
                                    onChange={(e) => handleScoreChange(item.name, e.target.value, item.maxScore)}
                                    disabled={isLocked}
                                    className="w-full p-2 bg-background border rounded-md text-center font-bold"
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Feedback */}
            <div className="space-y-2">
                <label className="text-lg font-medium">Feedback / Comments</label>
                <textarea
                    className="w-full h-32 p-4 bg-card border rounded-xl resize-none focus:ring-2 ring-primary/50 outline-none"
                    placeholder="Provide constructive feedback for the team..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    disabled={isLocked}
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t">
                {!isLocked ? (
                    <>
                        <Button variant="outline" disabled={loading} onClick={() => handleSubmit(true)}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Draft
                        </Button>
                        <Button disabled={loading} onClick={() => handleSubmit(false)}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Submit Final Evaluation
                        </Button>
                    </>
                ) : (
                    <div className="flex items-center gap-2 text-green-500 font-medium bg-green-500/10 px-4 py-2 rounded-lg">
                        <CheckCircle className="w-5 h-5" />
                        Evaluation Submitted
                    </div>
                )}
            </div>
        </div>
    );
};

export default EvaluationPage;
