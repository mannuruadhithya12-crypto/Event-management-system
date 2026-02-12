import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Github, Globe, Video, FileText, Send } from 'lucide-react';
import { toast } from 'sonner';
import { submissionApi } from '@/lib/api';

interface SubmissionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    teamId: string;
    hackathonId: string;
    existingSubmission?: any;
}

const SubmissionDialog = ({ isOpen, onClose, teamId, hackathonId, existingSubmission }: SubmissionDialogProps) => {
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        projectTitle: existingSubmission?.projectTitle || '',
        description: existingSubmission?.description || '',
        githubUrl: existingSubmission?.githubUrl || '',
        demoUrl: existingSubmission?.demoUrl || '',
        videoUrl: existingSubmission?.videoUrl || '',
        pptUrl: existingSubmission?.pptUrl || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const submissionData = {
                ...formData,
                team: { id: teamId },
                hackathon: { id: hackathonId },
                status: 'PENDING'
            };

            if (existingSubmission?.id) {
                await submissionApi.update(existingSubmission.id, submissionData);
                toast.success("Submission updated successfully!");
            } else {
                await submissionApi.submit(submissionData);
                toast.success("Project submitted successfully!");
            }
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to submit project.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Submit Your Project</DialogTitle>
                    <DialogDescription>
                        Fill in your project details below. You can update your submission until the deadline.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="projectTitle">Project Name</Label>
                        <Input
                            id="projectTitle"
                            placeholder="Give your project a catchy name"
                            value={formData.projectTitle}
                            onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Short Description</Label>
                        <Textarea
                            id="description"
                            placeholder="What does your project do? (Max 200 chars)"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="github" className="flex items-center gap-2">
                                <Github className="h-4 w-4" />
                                GitHub Repository
                            </Label>
                            <Input
                                id="github"
                                placeholder="https://github.com/..."
                                value={formData.githubUrl}
                                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="demo" className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Live Demo URL
                            </Label>
                            <Input
                                id="demo"
                                placeholder="https://..."
                                value={formData.demoUrl}
                                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="video" className="flex items-center gap-2">
                                <Video className="h-4 w-4" />
                                Video Pitch URL
                            </Label>
                            <Input
                                id="video"
                                placeholder="YouTube/Loom link"
                                value={formData.videoUrl}
                                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ppt" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Presentation/PPT
                            </Label>
                            <Input
                                id="ppt"
                                placeholder="Google Slides/Drive link"
                                value={formData.pptUrl}
                                onChange={(e) => setFormData({ ...formData, pptUrl: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="gap-2 bg-[hsl(var(--navy))] text-white dark:bg-[hsl(var(--teal))]" disabled={submitting}>
                            {submitting ? "Submitting..." : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Submit Project
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SubmissionDialog;
