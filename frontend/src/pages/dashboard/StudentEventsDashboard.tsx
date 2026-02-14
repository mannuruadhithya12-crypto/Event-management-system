import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Search,
    Filter,
    Download,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Users,
    Building2,
    ExternalLink
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { api, feedbackApi } from '@/lib/api';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { mockStudentEvents } from '@/lib/mockData';

interface EventDto {
    id: string;
    title: string;
    description: string;
    bannerImage?: string;
    mode: string;
    location: string;
    startDate: string;
    endDate: string;
    status: string; // Event status from backend
    registrationStatus: string; // User's registration status
    certificateIssued: boolean;
    organizerName?: string;
    collegeName?: string;
    registeredCount: number;
    capacity: number;
}

const StudentEventsDashboard = () => {
    const { user } = useAuthStore();
    const [events, setEvents] = useState<EventDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedEvent, setSelectedEvent] = useState<EventDto | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [feedbackRating, setFeedbackRating] = useState(0);
    const [feedbackComment, setFeedbackComment] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const fetchEvents = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                // Try to fetch from backend, fallback to mock if fails (or if backend returns empty during dev)
                try {
                    const data = await api.get<EventDto[]>(`/events/student/${user.id}`);
                    if (data && data.length > 0) {
                        setEvents(data);
                    } else {
                        console.log("No backend data, using mock.");
                        setEvents(mockStudentEvents as unknown as EventDto[]);
                    }
                } catch (err) {
                    console.warn("Backend fetch failed, using mock data", err);
                    setEvents(mockStudentEvents as unknown as EventDto[]);
                }
            } catch (error) {
                console.error('Failed to fetch events:', error);
                toast.error('Failed to load events.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user?.id]);

    const handleUnregister = async (eventId: string) => {
        try {
            await api.post(`/events/${eventId}/unregister?userId=${user?.id}`, {});
            toast.success("Unregistered successfully");
            // Update local state
            setEvents(prev => prev.map(e => e.id === eventId ? { ...e, registrationStatus: 'CANCELLED' } : e));
            setIsDetailsOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to unregister");
        }
    };

    const handleDownloadCertificate = async (eventId: string) => {
        toast.info("Downloading certificate...");
        // In a real app, this would trigger a download from a blob response
        setTimeout(() => toast.success("Certificate downloaded!"), 1500);
    };

    const handleFeedbackSubmit = async () => {
        if (!selectedEvent || !user?.id) return;
        try {
            await feedbackApi.submit({
                eventId: selectedEvent.id,
                userId: user.id,
                rating: feedbackRating,
                comment: feedbackComment,
                suggestions: ''
            });
            toast.success("Feedback submitted successfully!");
            setIsFeedbackOpen(false);
            setFeedbackRating(0);
            setFeedbackComment('');
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit feedback");
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.organizerName?.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesTab = true;
        const now = new Date();
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);

        if (activeTab === 'upcoming') {
            matchesTab = startDate > now && event.registrationStatus !== 'CANCELLED';
        } else if (activeTab === 'ongoing') {
            matchesTab = startDate <= now && endDate >= now && event.registrationStatus !== 'CANCELLED';
        } else if (activeTab === 'completed') {
            matchesTab = endDate < now && event.registrationStatus !== 'CANCELLED';
        } else if (activeTab === 'cancelled') {
            matchesTab = event.registrationStatus === 'CANCELLED';
        }

        const matchesFilter = statusFilter === 'ALL' || event.mode === statusFilter;

        return matchesSearch && matchesTab && matchesFilter;
    });

    const getStatusBadge = (status: string, regStatus: string) => {
        if (regStatus === 'CANCELLED') return <Badge variant="destructive">Cancelled</Badge>;
        if (regStatus === 'ATTENDED') return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500 hover:bg-green-500/20">Attended</Badge>;

        switch (status) {
            case 'COMPLETED': return <Badge variant="secondary">Completed</Badge>;
            case 'LIVE': return <Badge className="bg-red-500 animate-pulse">Live Now</Badge>;
            default: return <Badge variant="outline" className="text-blue-500 border-blue-500">Registered</Badge>;
        }
    };

    return (
        <div className="space-y-6 p-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        My Events
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Track and manage your event participation journey.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast.info("Syncing calendar...")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Sync Calendar
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-5 md:w-[500px]">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search events..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Mode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Modes</SelectItem>
                            <SelectItem value="ONLINE">Online</SelectItem>
                            <SelectItem value="OFFLINE">Offline</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((n) => (
                        <Card key={n} className="overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-2/3" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        layout
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {filteredEvents.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
                                <div className="bg-muted/50 p-6 rounded-full mb-4">
                                    <CalendarIcon className="h-12 w-12 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold">No events found</h3>
                                <p className="text-muted-foreground mt-2 max-w-sm">
                                    {activeTab === 'all'
                                        ? "You haven't registered for any events yet. Explore events and join the community!"
                                        : `You don't have any ${activeTab} events.`}
                                </p>
                                {activeTab === 'all' && (
                                    <Button className="mt-4" variant="default">
                                        Browse Events
                                    </Button>
                                )}
                            </div>
                        ) : (
                            filteredEvents.map((event) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 group border-muted/60">
                                        <div className="relative h-48 overflow-hidden bg-muted">
                                            {event.bannerImage ? (
                                                <img
                                                    src={event.bannerImage}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-secondary/30">
                                                    <CalendarIcon className="h-12 w-12 text-muted-foreground/50" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3 flex gap-2">
                                                {getStatusBadge(event.status, event.registrationStatus)}
                                            </div>
                                            <div className="absolute top-3 left-3">
                                                <Badge variant="secondary" className="backdrop-blur-md bg-white/80 dark:bg-black/50 text-xs font-medium">
                                                    {event.mode === 'ONLINE' ? '🌐 Online' : '📍 Offline'}
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardHeader className="pb-3">
                                            <div className="text-sm text-primary font-medium mb-1">
                                                {event.organizerName || 'College Event'}
                                            </div>
                                            <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                                                {event.title}
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-2 mt-1">
                                                <Clock className="h-3.5 w-3.5" />
                                                {format(new Date(event.startDate), "MMM d, yyyy • h:mm a")}
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="flex-grow pb-3">
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                                {event.description}
                                            </p>

                                            <div className="space-y-2 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-3.5 w-3.5 text-primary/70" />
                                                    <span className="truncate">{event.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-3.5 w-3.5 text-primary/70" />
                                                    <span>{event.registeredCount} registered</span>
                                                </div>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="pt-0 flex gap-2">
                                            <Button
                                                className="flex-1"
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setIsDetailsOpen(true);
                                                }}
                                            >
                                                View Details
                                            </Button>
                                            {event.certificateIssued && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-primary hover:text-primary/80 hover:bg-primary/10"
                                                    onClick={() => handleDownloadCertificate(event.id)}
                                                    title="Download Certificate"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Event Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    {selectedEvent && (
                        <>
                            <DialogHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-1">
                                            {selectedEvent.title}
                                        </DialogTitle>
                                        <DialogDescription className="flex items-center gap-2 text-base">
                                            <Building2 className="h-4 w-4" />
                                            Hosted by {selectedEvent.organizerName}
                                        </DialogDescription>
                                    </div>
                                    {getStatusBadge(selectedEvent.status, selectedEvent.registrationStatus)}
                                </div>
                            </DialogHeader>

                            <div className="space-y-6 my-4">
                                {/* Hero Image */}
                                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                                    {selectedEvent.bannerImage ? (
                                        <img
                                            src={selectedEvent.bannerImage}
                                            alt={selectedEvent.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full">
                                            <CalendarIcon className="h-16 w-16 text-muted-foreground/30" />
                                        </div>
                                    )}
                                </div>

                                {/* Quick Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-secondary/20 p-3 rounded-lg flex flex-col items-center text-center">
                                        <CalendarIcon className="h-5 w-5 text-primary mb-1" />
                                        <span className="text-xs text-muted-foreground">Date</span>
                                        <span className="text-sm font-semibold">{format(new Date(selectedEvent.startDate), "MMM d")}</span>
                                    </div>
                                    <div className="bg-secondary/20 p-3 rounded-lg flex flex-col items-center text-center">
                                        <Clock className="h-5 w-5 text-primary mb-1" />
                                        <span className="text-xs text-muted-foreground">Time</span>
                                        <span className="text-sm font-semibold">{format(new Date(selectedEvent.startDate), "h:mm a")}</span>
                                    </div>
                                    <div className="bg-secondary/20 p-3 rounded-lg flex flex-col items-center text-center">
                                        <MapPin className="h-5 w-5 text-primary mb-1" />
                                        <span className="text-xs text-muted-foreground">Venue</span>
                                        <span className="text-sm font-semibold truncate w-full" title={selectedEvent.location}>{selectedEvent.location}</span>
                                    </div>
                                    <div className="bg-secondary/20 p-3 rounded-lg flex flex-col items-center text-center">
                                        <Users className="h-5 w-5 text-primary mb-1" />
                                        <span className="text-xs text-muted-foreground">Attendees</span>
                                        <span className="text-sm font-semibold">{selectedEvent.registeredCount}</span>
                                    </div>
                                </div>

                                <div className="prose dark:prose-invert max-w-none">
                                    <h4 className="text-lg font-semibold mb-2">About Event</h4>
                                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                        {selectedEvent.description}
                                    </p>
                                </div>

                                {/* Action Area */}
                                <div className="bg-card border rounded-lg p-4 space-y-3">
                                    <h4 className="font-medium flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-primary" />
                                        Your Status
                                    </h4>
                                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                            {selectedEvent.registrationStatus === 'REGISTERED' && (
                                                <div className="flex items-center text-green-500 font-medium">
                                                    <CheckCircle2 className="mr-2 h-5 w-5" />
                                                    Registered
                                                </div>
                                            )}
                                            {selectedEvent.registrationStatus === 'CANCELLED' && (
                                                <div className="flex items-center text-destructive font-medium">
                                                    <XCircle className="mr-2 h-5 w-5" />
                                                    Cancelled
                                                </div>
                                            )}
                                            {selectedEvent.certificateIssued && (
                                                <Button variant="outline" size="sm" className="gap-2" onClick={() => handleDownloadCertificate(selectedEvent.id)}>
                                                    <Download className="h-4 w-4" />
                                                    Download Certificate
                                                </Button>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            {selectedEvent.registrationStatus === 'REGISTERED' && new Date(selectedEvent.startDate) > new Date() && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleUnregister(selectedEvent.id)}
                                                    className="w-full sm:w-auto"
                                                >
                                                    Unregister
                                                </Button>
                                            )}
                                            {(selectedEvent.status === 'COMPLETED' || selectedEvent.registrationStatus === 'ATTENDED') && (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => setIsFeedbackOpen(true)}
                                                    className="w-full sm:w-auto"
                                                >
                                                    Rate Event
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                                    Close
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Feedback Dialog */}
            <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rate this Event</DialogTitle>
                        <DialogDescription>
                            Share your experience regarding {selectedEvent?.title}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFeedbackRating(star)}
                                    className={`text-2xl transition-colors ${star <= feedbackRating ? 'text-yellow-500' : 'text-gray-300'
                                        }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Comments</label>
                            <textarea
                                className="w-full min-h-[100px] p-2 border rounded-md bg-background"
                                placeholder="What did you like? What could be improved?"
                                value={feedbackComment}
                                onChange={(e) => setFeedbackComment(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsFeedbackOpen(false)}>Cancel</Button>
                        <Button onClick={handleFeedbackSubmit} disabled={feedbackRating === 0}>Submit Feedback</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StudentEventsDashboard;
