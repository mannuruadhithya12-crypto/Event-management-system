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
        <div className="space-y-10">
            <Card className="border-none shadow-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl rounded-[3rem] p-12 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[hsl(var(--teal))]/10 rounded-full -mr-40 -mt-40 blur-[100px] transition-all group-hover:bg-[hsl(var(--teal))]/20" />

                <CardHeader className="px-0 pt-0 pb-12 relative z-10">
                    <CardTitle className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                        <Upload className="h-10 w-10 text-[hsl(var(--teal))]" />
                        {submission ? 'UPDATE PROJECT CORE' : 'INITIALIZE SUBMISSION'}
                    </CardTitle>
                    <CardDescription className="text-lg font-medium text-slate-500 mt-2">
                        {submission ? 'Synchronize your latest deployment and documentation.' : 'Transmit your project artifacts to the evaluation grid.'}
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-0 space-y-10 relative z-10">
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="space-y-4 md:col-span-2">
                            <label className="text-xs font-black text-[hsl(var(--teal))] uppercase tracking-[0.3em] ml-1">Project Identifier</label>
                            <Input
                                placeholder="THE PROJECT NAME"
                                className="rounded-[1.5rem] h-16 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 font-extrabold text-lg px-8 focus:border-[hsl(var(--teal))] transition-all"
                                value={form.projectTitle}
                                onChange={e => setForm({ ...form, projectTitle: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4 md:col-span-2">
                            <label className="text-xs font-black text-[hsl(var(--teal))] uppercase tracking-[0.3em] ml-1">Functional Briefing</label>
                            <Textarea
                                placeholder="Elaborate on the technical architecture and core value proposition..."
                                className="rounded-[2rem] min-h-[200px] bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 font-bold text-lg p-8 focus:border-[hsl(var(--teal))] transition-all resize-none"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                <Github className="h-4 w-4" /> REPOSITORY ARCHIVE
                            </label>
                            <Input
                                placeholder="HTTPS://GITHUB.COM/..."
                                className="rounded-2xl h-14 bg-white/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 font-bold px-6"
                                value={form.githubUrl}
                                onChange={e => setForm({ ...form, githubUrl: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                <ExternalLink className="h-4 w-4" /> LIVE DEPLOYMENT
                            </label>
                            <Input
                                placeholder="HTTPS://APP-DEMO.COM"
                                className="rounded-2xl h-14 bg-white/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 font-bold px-6"
                                value={form.demoUrl}
                                onChange={e => setForm({ ...form, demoUrl: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-8">
                        <Button
                            className="w-full h-20 rounded-[1.5rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-xl gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl"
                            onClick={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <Send className="h-6 w-6" />
                            )}
                            {submission ? 'PUSH UPDATED BUILD' : 'COMMIT SUBMISSION'}
                        </Button>
                        <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-8">
                            BY COMMITTING, YOU VERIFY ALL WORK IS ORIGINAL AND COMPLIES WITH SECURITY PROTOCOLS.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SubmissionModule;
