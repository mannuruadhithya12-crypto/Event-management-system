import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Video,
    Calendar,
    Users,
    Plus,
    Edit,
    Trash2,
    ExternalLink,
    Clock,
    CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const FacultyWebinarsPage = () => {
    const navigate = useNavigate();
    const [webinars, setWebinars] = useState<any[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        scheduledDate: '',
        duration: '',
        meetingLink: '',
        maxParticipants: '',
    });

    const handleCreate = async () => {
        if (!formData.title || !formData.scheduledDate) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            // TODO: Implement create API
            toast.success('Webinar scheduled successfully');
            setIsCreateOpen(false);
            setFormData({
                title: '',
                description: '',
                scheduledDate: '',
                duration: '',
                meetingLink: '',
                maxParticipants: '',
            });
        } catch (error) {
            toast.error('Failed to schedule webinar');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this webinar?')) return;

        try {
            // TODO: Implement delete API
            toast.success('Webinar deleted successfully');
        } catch (error) {
            toast.error('Failed to delete webinar');
        }
    };

    const stats = {
        upcoming: webinars.filter(w => w.status === 'UPCOMING').length,
        completed: webinars.filter(w => w.status === 'COMPLETED').length,
        totalAttendees: webinars.reduce((sum, w) => sum + (w.attendees || 0), 0),
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold">Webinars & Workshops</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Schedule and manage online sessions
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Schedule Webinar
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Schedule New Webinar</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter webinar title"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe the webinar"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="scheduledDate">Scheduled Date & Time *</Label>
                                <Input
                                    id="scheduledDate"
                                    type="datetime-local"
                                    value={formData.scheduledDate}
                                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration (minutes)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    placeholder="60"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="meetingLink">Meeting Link</Label>
                                <Input
                                    id="meetingLink"
                                    value={formData.meetingLink}
                                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                                    placeholder="https://meet.google.com/..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maxParticipants">Max Participants</Label>
                                <Input
                                    id="maxParticipants"
                                    type="number"
                                    value={formData.maxParticipants}
                                    onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                                    placeholder="Leave empty for unlimited"
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="flex-1">
                                    Cancel
                                </Button>
                                <Button onClick={handleCreate} className="flex-1">
                                    Schedule
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </motion.div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Upcoming</p>
                                <p className="text-3xl font-bold mt-1">{stats.upcoming}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Completed</p>
                                <p className="text-3xl font-bold mt-1">{stats.completed}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Total Attendees</p>
                                <p className="text-3xl font-bold mt-1">{stats.totalAttendees}</p>
                            </div>
                            <Users className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Webinars List */}
            {webinars.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <Video className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No webinars scheduled</h3>
                        <p className="text-slate-500 mb-4">Schedule your first webinar to get started</p>
                        <Button onClick={() => setIsCreateOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Schedule Webinar
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {webinars.map((webinar) => (
                        <Card key={webinar.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="line-clamp-2">{webinar.title}</CardTitle>
                                        <Badge variant={webinar.status === 'UPCOMING' ? 'default' : 'secondary'} className="mt-2">
                                            {webinar.status}
                                        </Badge>
                                    </div>
                                    <Video className="h-8 w-8 text-blue-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                                    {webinar.description || 'No description'}
                                </p>
                                <div className="space-y-2 text-sm text-slate-500 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{webinar.scheduledDate ? new Date(webinar.scheduledDate).toLocaleString() : 'TBD'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>{webinar.duration || 60} minutes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>{webinar.attendees || 0} attendees</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {webinar.meetingLink && (
                                        <Button variant="outline" size="sm" className="flex-1" asChild>
                                            <a href={webinar.meetingLink} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="mr-1 h-4 w-4" /> Join
                                            </a>
                                        </Button>
                                    )}
                                    <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(webinar.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FacultyWebinarsPage;
