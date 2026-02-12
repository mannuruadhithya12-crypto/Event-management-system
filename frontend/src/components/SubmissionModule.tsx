import React, { useState, useEffect } from 'react';
import {
    Github,
    ExternalLink,
    Video,
    FileText,
    Upload,
    Send,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { submissionApi, hackathonApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

interface SubmissionModuleProps {
    hackathonId: string;
}

const SubmissionModule: React.FC<SubmissionModuleProps> = ({ hackathonId }) => {
    const { user } = useAuthStore();
    const [team, setTeam] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submission, setSubmission] = useState<any>(null);

    const [form, setForm] = useState({
        projectTitle: '',
        description: '',
        githubUrl: '',
        demoUrl: '',
        videoUrl: '',
        presentationUrl: ''
    });

    const fetchData = async () => {
        if (!user) return;
        try {
            const myTeam = await hackathonApi.getMyTeam(hackathonId, user.id);
            setTeam(myTeam);
            if (myTeam) {
                const subs = await submissionApi.getByHackathon(hackathonId);
                const teamSub = subs.find(s => s.team?.id === myTeam.id);
                setSubmission(teamSub);
                if (teamSub) {
                    setForm({
                        projectTitle: teamSub.projectTitle || '',
                        description: teamSub.description || '',
                        githubUrl: teamSub.githubUrl || '',
                        demoUrl: teamSub.demoUrl || '',
                        videoUrl: teamSub.videoUrl || '',
                        presentationUrl: teamSub.pptUrl || ''
                    });
                }
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [hackathonId, user?.id]);

    const handleSubmit = async () => {
        if (!team || !user) return;
        if (!form.projectTitle.trim() || !form.description.trim()) {
            toast.error('Project title and description are required');
            return;
        }

        setSubmitting(true);
        try {
            const data = {
                hackathon: { id: hackathonId },
                team: { id: team.id },
                user: { id: user.id },
                projectTitle: form.projectTitle,
                description: form.description,
                githubUrl: form.githubUrl,
                demoUrl: form.demoUrl,
                videoUrl: form.videoUrl,
                pptUrl: form.presentationUrl
            };

            await submissionApi.submit(data);
            toast.success('Project submitted successfully!');
            fetchData();
        } catch (error: any) {
            toast.error(error.message || 'Failed to submit project');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="animate-pulse space-y-4">
        <div className="h-48 bg-slate-100 rounded-3xl" />
        <div className="h-64 bg-slate-100 rounded-3xl" />
    </div>;

    if (!team) {
        return (
            <Alert className="rounded-2xl bg-orange-50 border-orange-100 text-orange-800">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <AlertTitle className="font-bold">Team Required</AlertTitle>
                <AlertDescription>
                    You must create or join a team before you can submit a project for this hackathon.
                </AlertDescription>
            </Alert>
        );
    }

    if (submission && submission.status === 'EVALUATED') {
        return (
            <Card className="border-none shadow-sm bg-green-50 rounded-3xl border border-green-100">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                        <CardTitle className="text-green-800">Submission Evaluated</CardTitle>
                    </div>
                    <CardDescription className="text-green-700/70">
                        Your project has been evaluated by the judges.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-white/50 rounded-2xl p-6 border border-green-100">
                        <h4 className="font-bold text-lg mb-2">{submission.projectTitle}</h4>
                        <div className="space-y-4">
                            <div>
                                <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Score</span>
                                <div className="text-3xl font-black text-green-800">{submission.score || 0}/100</div>
                            </div>
                            {submission.feedback && (
                                <div>
                                    <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Feedback</span>
                                    <p className="text-sm text-green-800/80 mt-1 italic">"{submission.feedback}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-8">
            <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-3xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {submission ? 'Update Submission' : 'Submit Your Project'}
                    </CardTitle>
                    <CardDescription>
                        {submission ? 'You can update your submission until the deadline.' : 'Provide details about your hackathon project.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4 md:col-span-2">
                            <label className="text-sm font-bold ml-1">Project Title*</label>
                            <Input
                                placeholder="Your project name"
                                className="rounded-xl h-12"
                                value={form.projectTitle}
                                onChange={e => setForm({ ...form, projectTitle: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4 md:col-span-2">
                            <label className="text-sm font-bold ml-1">Description*</label>
                            <Textarea
                                placeholder="What does your project do? What technologies did you use?"
                                className="rounded-2xl min-h-[120px] resize-none"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-sm font-bold ml-1 flex items-center gap-2">
                                <Github className="h-4 w-4" /> Github Repository URL
                            </label>
                            <Input
                                placeholder="https://github.com/..."
                                className="rounded-xl h-11"
                                value={form.githubUrl}
                                onChange={e => setForm({ ...form, githubUrl: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-sm font-bold ml-1 flex items-center gap-2">
                                <ExternalLink className="h-4 w-4" /> Live Demo URL
                            </label>
                            <Input
                                placeholder="https://..."
                                className="rounded-xl h-11"
                                value={form.demoUrl}
                                onChange={e => setForm({ ...form, demoUrl: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-sm font-bold ml-1 flex items-center gap-2">
                                <Video className="h-4 w-4" /> Video Demo URL
                            </label>
                            <Input
                                placeholder="YouTube/Loom link"
                                className="rounded-xl h-11"
                                value={form.videoUrl}
                                onChange={e => setForm({ ...form, videoUrl: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-sm font-bold ml-1 flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Presentation URL
                            </label>
                            <Input
                                placeholder="Drive/Canva link"
                                className="rounded-xl h-11"
                                value={form.presentationUrl}
                                onChange={e => setForm({ ...form, presentationUrl: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            className="w-full h-14 rounded-2xl bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy))]/90 text-white font-bold text-lg gap-2"
                            onClick={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Send className="h-5 w-5" />
                            )}
                            {submission ? 'Update Submission' : 'Submit Project'}
                        </Button>
                        <p className="text-center text-xs text-slate-400 mt-4">
                            By submitting, you agree to the hackathon's <span className="underline cursor-pointer">Rules & Guidelines</span>.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SubmissionModule;
