import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    Calendar,
    Clock,
    Plus,
    Send,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { clubApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface RecruitmentNotice {
    id: string;
    title: string;
    description: string;
    role: string;
    requirements: string;
    deadline: string;
    status: string;
    createdAt: string;
}

interface RecruitmentModuleProps {
    clubId: string;
    isPresident: boolean;
}

const RecruitmentModule: React.FC<RecruitmentModuleProps> = ({ clubId, isPresident }) => {
    const { user } = useAuthStore();
    const [notices, setNotices] = useState<RecruitmentNotice[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState<RecruitmentNotice | null>(null);

    // Form states for new notice
    const [newNotice, setNewNotice] = useState({
        title: '',
        role: '',
        description: '',
        requirements: '',
        deadline: ''
    });

    // Form state for application/join request
    const [applyMessage, setApplyMessage] = useState('');

    const fetchNotices = async () => {
        try {
            setLoading(true);
            const data = await clubApi.getRecruitments(clubId);
            setNotices(data);
        } catch (error) {
            console.error('Failed to fetch recruitments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, [clubId]);

    const handleCreateNotice = async () => {
        if (!newNotice.title || !newNotice.role || !newNotice.deadline) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            await clubApi.createRecruitment(clubId, newNotice);
            toast.success('Recruitment notice posted successfully!');
            setIsDialogOpen(false);
            fetchNotices();
            setNewNotice({ title: '', role: '', description: '', requirements: '', deadline: '' });
        } catch (error) {
            toast.error('Failed to post notice');
        }
    };

    const handleApply = async () => {
        if (!user) return;
        if (!applyMessage) {
            toast.error('Please include a short message about why you want to join');
            return;
        }

        try {
            await clubApi.submitJoinRequest(clubId, user.id, applyMessage);
            toast.success('Application submitted successfully!');
            setIsApplyDialogOpen(false);
            setApplyMessage('');
        } catch (error) {
            toast.error('Failed to submit application');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-[hsl(var(--teal))]" />
                        Active Recruitments
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Join our team and help us build the future.</p>
                </div>
                {isPresident && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 rounded-xl bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/90">
                                <Plus className="h-4 w-4" />
                                Post Notice
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px] rounded-3xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">New Recruitment Notice</DialogTitle>
                                <DialogDescription>
                                    Post a new opening for your club. Be specific about the role and requirements.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Notice Title</label>
                                    <Input
                                        placeholder="e.g. Graphic Designers Wanted"
                                        value={newNotice.title}
                                        onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                                        className="rounded-xl border-slate-200"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Role Type</label>
                                    <Input
                                        placeholder="e.g. Design Lead, Tech Volunteer"
                                        value={newNotice.role}
                                        onChange={(e) => setNewNotice({ ...newNotice, role: e.target.value })}
                                        className="rounded-xl border-slate-200"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Deadline</label>
                                    <Input
                                        type="datetime-local"
                                        value={newNotice.deadline}
                                        onChange={(e) => setNewNotice({ ...newNotice, deadline: e.target.value })}
                                        className="rounded-xl border-slate-200"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <Textarea
                                        placeholder="Describe the role and what the club is looking for..."
                                        value={newNotice.description}
                                        onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                                        className="rounded-xl border-slate-200 min-h-[100px]"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Requirements</label>
                                    <Textarea
                                        placeholder="Skills, experience, or tools preferred..."
                                        value={newNotice.requirements}
                                        onChange={(e) => setNewNotice({ ...newNotice, requirements: e.target.value })}
                                        className="rounded-xl border-slate-200 min-h-[80px]"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl">Cancel</Button>
                                <Button onClick={handleCreateNotice} className="bg-[hsl(var(--navy))] text-white hover:bg-[hsl(var(--navy))]/90 rounded-xl">Post Notice</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {loading ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2].map(i => (
                        <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse dark:bg-slate-800" />
                    ))}
                </div>
            ) : notices.length === 0 ? (
                <Card className="border-dashed border-2 py-12 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <Users className="h-6 w-6 text-slate-400" />
                    </div>
                    <h4 className="font-bold text-lg">No active recruitments</h4>
                    <p className="text-slate-500 max-w-xs mt-1">This club isn't currently looking for new members, but check back later!</p>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    <AnimatePresence>
                        {notices.map((notice, idx) => (
                            <motion.div
                                key={notice.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="group overflow-hidden border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="secondary" className="bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))] border-none font-bold">
                                                {notice.role}
                                            </Badge>
                                            <div className="flex items-center gap-1 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                                                <AlertCircle className="h-3 w-3" />
                                                Ends {format(new Date(notice.deadline), 'MMM d, h:mm a')}
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl group-hover:text-[hsl(var(--teal))] transition-colors">{notice.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                                            {notice.description}
                                        </p>
                                        <div className="space-y-2">
                                            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Requirements</h5>
                                            <p className="text-sm font-medium">{notice.requirements}</p>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-0 border-t border-slate-50 dark:border-slate-800 mt-2 bg-slate-50/50 dark:bg-slate-900/50">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-between group/btn hover:bg-white dark:hover:bg-slate-800 text-[hsl(var(--teal))] font-bold"
                                            onClick={() => {
                                                setSelectedNotice(notice);
                                                setIsApplyDialogOpen(true);
                                            }}
                                        >
                                            Apply for this position
                                            <ArrowRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Application Dialog */}
            <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <Send className="h-5 w-5 text-[hsl(var(--teal))]" />
                            Join the Team
                        </DialogTitle>
                        <DialogDescription>
                            Applying for: <span className="font-bold text-slate-900 dark:text-white">{selectedNotice?.role}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="rounded-2xl bg-blue-50 dark:bg-blue-900/20 p-4 flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0" />
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                Your profile and achievements will be shared with the club coordinators automatically.
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-bold">Why should we pick you?</label>
                            <Textarea
                                placeholder="Describe your interest and relevant skills..."
                                value={applyMessage}
                                onChange={(e) => setApplyMessage(e.target.value)}
                                className="rounded-xl border-slate-200 min-h-[150px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsApplyDialogOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button
                            onClick={handleApply}
                            className="bg-[hsl(var(--navy))] text-white hover:bg-[hsl(var(--navy))]/90 rounded-xl px-8"
                        >
                            Submit Application
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RecruitmentModule;
