import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Video,
    Calendar,
    User,
    Search,
    Play,
    Filter,
    ArrowRight,
    Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { webinarApi } from '@/lib/api';

const WebinarsPage = () => {
    const navigate = useNavigate();
    const [webinars, setWebinars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchWebinars = async () => {
            try {
                const data = await webinarApi.getAll();
                setWebinars(data);
            } catch (error) {
                console.error("Failed to fetch webinars:", error);
                // Mock data if API fails
                setWebinars([
                    {
                        id: '1',
                        title: 'Mastering Full-Stack Development in 2024',
                        description: 'Join us for an intensive session on the latest trends in full-stack dev.',
                        speaker: 'Dr. Sarah Mitchell',
                        startTime: new Date(Date.now() + 86400000).toISOString(),
                        category: 'Technology',
                        bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
                        status: 'upcoming'
                    },
                    {
                        id: '2',
                        title: 'Entrepreneurship 101: From Idea to Launch',
                        description: 'Learn the essentials of starting your own business while in college.',
                        speaker: 'James Wilson',
                        startTime: new Date(Date.now() - 86400000).toISOString(),
                        category: 'Business',
                        bannerUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
                        status: 'recorded'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchWebinars();
    }, []);

    const filteredWebinars = webinars.filter(webinar =>
        webinar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        webinar.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        webinar.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold">University Webinars</h1>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                        Learn from industry experts and faculty leaders.
                    </p>
                </div>
                <Button className="gap-2 bg-[hsl(var(--navy))] text-white dark:bg-[hsl(var(--teal))]">
                    <Video className="h-4 w-4" />
                    Host a Webinar
                </Button>
            </motion.div>

            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search by topic, speaker, or category..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-80 rounded-xl bg-slate-100 animate-pulse dark:bg-slate-800" />
                    ))
                ) : filteredWebinars.length > 0 ? (
                    filteredWebinars.map((webinar, index) => (
                        <motion.div
                            key={webinar.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full flex flex-col overflow-hidden hover:border-slate-300 transition-all dark:hover:border-slate-600 group">
                                <div className="h-40 w-full relative overflow-hidden">
                                    <img
                                        src={webinar.bannerUrl || 'https://images.unsplash.com/photo-1475721027785-f74dea327912?auto=format&fit=crop&q=80&w=800'}
                                        alt={webinar.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" className="rounded-full bg-white text-black hover:bg-white/90">
                                            <Play className="h-5 w-5 fill-current" />
                                        </Button>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <Badge className={new Date(webinar.startTime) > new Date() ? "bg-blue-500" : "bg-slate-500"}>
                                            {new Date(webinar.startTime) > new Date() ? "Upcoming" : "Past Session"}
                                        </Badge>
                                    </div>
                                </div>
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline" className="text-[hsl(var(--navy))] border-[hsl(var(--navy))]/20 dark:text-[hsl(var(--teal))]">
                                            {webinar.category || 'General'}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl line-clamp-1">{webinar.title}</CardTitle>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                                        <User className="h-4 w-4" />
                                        <span>{webinar.speaker}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                        {webinar.description}
                                    </p>
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Calendar className="h-3 w-3" />
                                            <span>{new Date(webinar.startTime).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Clock className="h-3 w-3" />
                                            <span>{new Date(webinar.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t border-slate-100 p-4 dark:border-slate-800">
                                    <Button variant="ghost" className="w-full justify-between group" onClick={() => navigate(`/dashboard/webinars/${webinar.id}`)}>
                                        Details & Join
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-slate-500">
                        <Video className="mx-auto h-12 w-12 opacity-20" />
                        <p className="mt-4 text-lg font-medium">No webinars found</p>
                        <p>Try searching for a different topic.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebinarsPage;
