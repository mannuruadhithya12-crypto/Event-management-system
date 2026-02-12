import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Video,
    Calendar,
    User,
    ChevronLeft,
    Clock,
    Globe,
    ShieldCheck,
    Share2,
    Play,
    MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { webinarApi } from '@/lib/api';

const WebinarDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [webinar, setWebinar] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchWebinar = async () => {
            try {
                const data = await webinarApi.getById(id);
                setWebinar(data);
            } catch (error) {
                console.error("Failed to fetch webinar:", error);
                // Mock behavior
                setWebinar({
                    id,
                    title: 'Mastering Full-Stack Development in 2024',
                    description: 'Learn the core technologies driving the web today. We will cover React, Node.js, and modern DevOps practices.',
                    speaker: 'Dr. Sarah Mitchell',
                    startTime: new Date(Date.now() + 86400000).toISOString(),
                    endTime: new Date(Date.now() + 90000000).toISOString(),
                    category: 'Technology',
                    meetingUrl: 'https://zoom.us/j/example',
                    bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchWebinar();
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading webinar details...</div>;
    if (!webinar) return <div className="p-8 text-center">Webinar not found.</div>;

    const isUpcoming = new Date(webinar.startTime) > new Date();

    return (
        <div className="space-y-6">
            <Button variant="ghost" className="gap-2 pl-0" onClick={() => navigate('/dashboard/webinars')}>
                <ChevronLeft className="h-4 w-4" />
                Back to Webinars
            </Button>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visual Card */}
                    <Card className="overflow-hidden border-none shadow-xl">
                        <div className="relative h-80 w-full overflow-hidden">
                            <img src={webinar.bannerUrl} alt={webinar.title} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8">
                                <Badge className="mb-4 bg-white/20 backdrop-blur-md text-white border-white/30">
                                    {webinar.category}
                                </Badge>
                                <h1 className="text-3xl font-bold text-white leading-tight">
                                    {webinar.title}
                                </h1>
                            </div>
                        </div>
                        <CardContent className="p-8">
                            <h3 className="text-lg font-semibold mb-4">About this session</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                                {webinar.description}
                            </p>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Speaker</p>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-[hsl(var(--navy))] dark:text-[hsl(var(--teal))]" />
                                        <span className="font-semibold">{webinar.speaker}</span>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Duration</p>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-[hsl(var(--orange))]" />
                                        <span className="font-semibold">90 minutes</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Live Q&A and Chat
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-48 flex items-center justify-center text-slate-400 border-2 border-dashed rounded-lg">
                                <p>The chat will be available once the session starts.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Session Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium">Date</p>
                                    <p className="text-sm text-slate-500">{new Date(webinar.startTime).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium">Time</p>
                                    <p className="text-sm text-slate-500">{new Date(webinar.startTime).toLocaleTimeString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe className="h-5 w-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium">Platform</p>
                                    <p className="text-sm text-slate-500">Zoom Marketplace</p>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <Button className="w-full gap-2 bg-[hsl(var(--navy))] text-white dark:bg-[hsl(var(--teal))]" disabled={!isUpcoming}>
                                    {isUpcoming ? (
                                        <>
                                            <Play className="h-4 w-4" />
                                            Join Now
                                        </>
                                    ) : (
                                        <>
                                            <Play className="h-4 w-4" />
                                            View Recording
                                        </>
                                    )}
                                </Button>
                                <Button variant="outline" className="w-full gap-2">
                                    <Share2 className="h-4 w-4" />
                                    Share with Peers
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[hsl(var(--orange))]/5 border-[hsl(var(--orange))]/20">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <ShieldCheck className="h-6 w-6 text-[hsl(var(--orange))]" />
                                <h4 className="font-bold text-[hsl(var(--orange))]">Certificate of Completion</h4>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Attend at least 80% of the session to receive an official digital certificate verifiable on your profile.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default WebinarDetailPage;
