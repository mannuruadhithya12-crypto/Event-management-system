import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { webinarApi } from '@/lib/api';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Webinar } from '@/types';

const CreateWebinarPage = () => {
    const { id } = useParams(); // If ID exists, we are editing
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(!!id);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        speakerName: '',
        speakerBio: '',
        hostCollege: user?.collegeName || '',
        mode: 'Online',
        meetingLink: '',
        startDate: '',
        startTime: '',
        duration: 60,
        maxParticipants: 100,
        bannerImage: ''
    });

    useEffect(() => {
        if (id) {
            fetchWebinarDetails();
        }
    }, [id]);

    const fetchWebinarDetails = async () => {
        try {
            if (!id) return;
            const data = await webinarApi.getById(id, user?.id);
            const dateObj = new Date(data.startDate);

            // Format date as YYYY-MM-DD for input
            const dateStr = dateObj.toISOString().split('T')[0];
            // Format time as HH:MM for input
            const timeStr = dateObj.toTimeString().slice(0, 5);

            setFormData({
                title: data.title,
                description: data.description,
                speakerName: data.speakerName,
                speakerBio: data.speakerBio,
                hostCollege: data.hostCollege,
                mode: data.mode,
                meetingLink: data.meetingLink || '',
                startDate: dateStr,
                startTime: timeStr,
                duration: data.duration,
                maxParticipants: data.maxParticipants,
                bannerImage: data.bannerImage || ''
            });
        } catch (error) {
            toast.error('Failed to load webinar details');
            navigate('/dashboard/college-admin/webinars');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            // Combine date and time
            const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
            const endDateTime = new Date(startDateTime.getTime() + formData.duration * 60000);

            const payload = {
                ...formData,
                startDate: startDateTime.toISOString(),
                endDate: endDateTime.toISOString(),
                collegeId: user.collegeId || 'college-id', // fallback if missing
                createdBy: user.id
            };

            if (id) {
                await webinarApi.update(id, payload);
                toast.success('Webinar updated successfully!');
            } else {
                await webinarApi.create(user.id, payload);
                toast.success('Webinar created successfully!');
            }
            navigate('/dashboard/college-admin/webinars');
        } catch (error) {
            console.error("Error saving webinar:", error);
            toast.error('Failed to save webinar. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20 px-4 sm:px-6 space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/dashboard/college-admin/webinars')}>
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {id ? 'Edit Webinar' : 'Create New Webinar'}
                    </h1>
                    <p className="text-slate-500">
                        {id ? 'Update the details below' : 'Fill in the details to schedule a new webinar'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                    <CardHeader className="bg-slate-50 dark:bg-slate-800/50 p-8 border-b border-slate-100 dark:border-slate-800">
                        <CardTitle>Webinar Information</CardTitle>
                        <CardDescription>Basic details about the session</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="title">Webinar Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Future of AI in Healthcare"
                                    required
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="What will be covered in this session?"
                                    className="rounded-xl h-32"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="speakerName">Speaker Name</Label>
                                <Input
                                    id="speakerName"
                                    name="speakerName"
                                    value={formData.speakerName}
                                    onChange={handleChange}
                                    placeholder="e.g. Dr. Jane Smith"
                                    required
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hostCollege">Host College</Label>
                                <Input
                                    id="hostCollege"
                                    name="hostCollege"
                                    value={formData.hostCollege}
                                    onChange={handleChange}
                                    placeholder="Your College Name"
                                    required
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="speakerBio">Speaker Bio</Label>
                                <Textarea
                                    id="speakerBio"
                                    name="speakerBio"
                                    value={formData.speakerBio}
                                    onChange={handleChange}
                                    placeholder="Brief introduction of the speaker"
                                    className="rounded-xl h-20"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mode">Mode</Label>
                                <Select
                                    value={formData.mode}
                                    onValueChange={(val) => handleSelectChange('mode', val)}
                                >
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Select Mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Online">Online</SelectItem>
                                        <SelectItem value="Offline">Offline</SelectItem>
                                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="meetingLink">Meeting Link / Venue</Label>
                                <Input
                                    id="meetingLink"
                                    name="meetingLink"
                                    value={formData.meetingLink}
                                    onChange={handleChange}
                                    placeholder={formData.mode === 'Online' ? "Zoom/Meet Link" : "Hall/Room Number"}
                                    required
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="startDate">Date</Label>
                                <div className="relative">
                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                        className="pl-10 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="startTime">Time</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        type="time"
                                        id="startTime"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        required
                                        className="pl-10 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration (minutes)</Label>
                                <Input
                                    type="number"
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    min="15"
                                    required
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maxParticipants">Max Participants</Label>
                                <Input
                                    type="number"
                                    id="maxParticipants"
                                    name="maxParticipants"
                                    value={formData.maxParticipants}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="bannerImage">Banner Image URL</Label>
                                <Input
                                    id="bannerImage"
                                    name="bannerImage"
                                    value={formData.bannerImage}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="rounded-xl"
                                />
                            </div>

                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4 mt-6">
                    <Button type="button" variant="outline" onClick={() => navigate('/dashboard/college-admin/webinars')} className="rounded-xl px-8">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="rounded-xl px-8 bg-blue-600 hover:bg-blue-700">
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {id ? 'Update Webinar' : 'Create Webinar'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateWebinarPage;
