import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { judgeService } from '@/services/judgeService';

interface Event {
    id: string;
    title: string;
    description: string;
    startDate: string;
    location: string;
    status: string;
    bannerImage?: string;
}

const AssignedEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await judgeService.getAssignedEvents();
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch assigned events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) {
        return <div className="p-8 text-center">Loading assigned events...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Assigned Events</h1>
                    <p className="text-muted-foreground mt-2">
                        Events you have been selected to judge.
                    </p>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="text-center p-12 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">No events assigned yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300"
                        >
                            {/* Event Image */}
                            <div className="aspect-video bg-muted relative overflow-hidden">
                                {event.bannerImage ? (
                                    <img
                                        src={event.bannerImage}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                        <Calendar className="w-12 h-12 text-primary/20" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <Badge variant="secondary" className="backdrop-blur-md bg-background/80">
                                        {event.status}
                                    </Badge>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {event.description}
                                    </p>
                                </div>

                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(event.startDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full group/btn"
                                    onClick={() => navigate(`/dashboard/judge/events/${event.id}`)}
                                >
                                    Evaluate Submissions
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AssignedEvents;
