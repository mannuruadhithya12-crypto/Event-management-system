import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Star,
    ExternalLink,
    Download,
    Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

interface SubmissionScoringProps {
    hackathonId: string;
}

const SubmissionScoringTab = ({ hackathonId }: SubmissionScoringProps) => {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [isScoringOpen, setIsScoringOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [scores, setScores] = useState({
        innovation: 0,
        implementation: 0,
        presentation: 0,
        impact: 0,
        feedback: '',
    });

    const handleScore = (submission: any) => {
        setSelectedSubmission(submission);
        setScores({
            innovation: submission.scores?.innovation || 0,
            implementation: submission.scores?.implementation || 0,
            presentation: submission.scores?.presentation || 0,
            impact: submission.scores?.impact || 0,
            feedback: submission.feedback || '',
        });
        setIsScoringOpen(true);
    };

    const handleSubmitScore = async () => {
        try {
            // TODO: Implement scoring API
            toast.success('Scores submitted successfully');
            setIsScoringOpen(false);
        } catch (error) {
            toast.error('Failed to submit scores');
        }
    };

    const totalScore = scores.innovation + scores.implementation + scores.presentation + scores.impact;

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Team Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                    {submissions.length === 0 ? (
                        <div className="py-8 text-center text-slate-500">
                            <Eye className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
                            <p>Submissions will appear here once teams submit their projects</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Team Name</TableHead>
                                    <TableHead>Submitted At</TableHead>
                                    <TableHead>Project Link</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submissions.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell className="font-medium">{submission.teamName}</TableCell>
                                        <TableCell>
                                            {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {submission.projectUrl ? (
                                                <a
                                                    href={submission.projectUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-blue-500 hover:underline"
                                                >
                                                    View <ExternalLink className="h-3 w-3" />
                                                </a>
                                            ) : (
                                                'N/A'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 text-yellow-500" />
                                                <span className="font-semibold">{submission.totalScore || 0}/100</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={submission.scored ? 'default' : 'secondary'}>
                                                {submission.scored ? 'Scored' : 'Pending'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleScore(submission)}>
                                                    <Star className="mr-1 h-4 w-4" /> Score
                                                </Button>
                                                {submission.documentUrl && (
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <a href={submission.documentUrl} download>
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Scoring Modal - Centered with Flexbox */}
            <Dialog open={isScoringOpen} onOpenChange={setIsScoringOpen}>
                <DialogContent className="sm:max-w-2xl flex items-center justify-center">
                    <div className="w-full">
                        <DialogHeader>
                            <DialogTitle>Score Submission - {selectedSubmission?.teamName}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 mt-6">
                            {/* Score Inputs */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="innovation">Innovation (0-25)</Label>
                                    <Input
                                        id="innovation"
                                        type="number"
                                        min="0"
                                        max="25"
                                        value={scores.innovation}
                                        onChange={(e) => setScores({ ...scores, innovation: parseInt(e.target.value) || 0 })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="implementation">Implementation (0-25)</Label>
                                    <Input
                                        id="implementation"
                                        type="number"
                                        min="0"
                                        max="25"
                                        value={scores.implementation}
                                        onChange={(e) => setScores({ ...scores, implementation: parseInt(e.target.value) || 0 })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="presentation">Presentation (0-25)</Label>
                                    <Input
                                        id="presentation"
                                        type="number"
                                        min="0"
                                        max="25"
                                        value={scores.presentation}
                                        onChange={(e) => setScores({ ...scores, presentation: parseInt(e.target.value) || 0 })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="impact">Impact (0-25)</Label>
                                    <Input
                                        id="impact"
                                        type="number"
                                        min="0"
                                        max="25"
                                        value={scores.impact}
                                        onChange={(e) => setScores({ ...scores, impact: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            {/* Total Score Display */}
                            <Card className="bg-slate-50 dark:bg-slate-900">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-semibold">Total Score</span>
                                        <div className="flex items-center gap-2">
                                            <Star className="h-6 w-6 text-yellow-500" />
                                            <span className="text-3xl font-bold">{totalScore}/100</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Feedback */}
                            <div className="space-y-2">
                                <Label htmlFor="feedback">Feedback (Optional)</Label>
                                <Textarea
                                    id="feedback"
                                    value={scores.feedback}
                                    onChange={(e) => setScores({ ...scores, feedback: e.target.value })}
                                    placeholder="Provide constructive feedback for the team..."
                                    rows={4}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setIsScoringOpen(false)} className="flex-1">
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmitScore} className="flex-1">
                                    Submit Scores
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default SubmissionScoringTab;
