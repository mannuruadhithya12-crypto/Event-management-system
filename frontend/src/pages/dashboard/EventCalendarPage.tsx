import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    eachDayOfInterval
} from 'date-fns';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Trophy,
    Video,
    Filter,
    Clock,
    MapPin,
    User,
    X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Event, Hackathon, Webinar } from '@/types';

const EventCalendarPage = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const [hackathons, setHackathons] = useState<Hackathon[]>([]);
    const [webinars, setWebinars] = useState<Webinar[]>([]);
    const [filter, setFilter] = useState<'all' | 'event' | 'hackathon' | 'webinar'>('all');

    // Modal State
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDateEvents, setSelectedDateEvents] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Mock data fallback if API fails
                // In a real scenario, we'd use the API
                const eventsData = [
                    { id: '1', title: 'Tech Talk', startDate: new Date(Date.now() + 86400000).toISOString(), collegeName: 'Tech College', type: 'event' }
                ] as any;
                const hackathonsData = [
                    { id: 'h1', title: 'CodeFest', startDate: new Date(Date.now() + 86400000 * 3).toISOString(), collegeName: 'State Uni', type: 'hackathon' }
                ] as any;

                // Try real API
                try {
                    const [e, h, w] = await Promise.all([
                        api.get<Event[]>('/events'),
                        api.get<Hackathon[]>('/hackathons'),
                        api.get<Webinar[]>('/webinars')
                    ]);
                    if (e) setEvents(e);
                    if (h) setHackathons(h);
                    if (w) setWebinars(w || []);
                } catch (e) {
                    console.warn("Using mock data for calendar as API failed or empty", e);
                    setEvents(eventsData);
                    setHackathons(hackathonsData);
                }

            } catch (error) {
                console.error("Failed to fetch calendar data:", error);
            }
        };
        fetchData();
    }, []);

    const handleDateClick = (day: Date) => {
        const dayEvents = [
            ...events.filter(e => isSameDay(new Date(e.startDate), day)).map(e => ({ ...e, type: 'event' })),
            ...hackathons.filter(h => isSameDay(new Date(h.startDate), day)).map(h => ({ ...h, type: 'hackathon' })),
            ...webinars.filter(w => isSameDay(new Date(w.startDate), day)).map(w => ({ ...w, type: 'webinar' }))
        ];

        if (dayEvents.length > 0) {
            setSelectedDate(day);
            setSelectedDateEvents(dayEvents);
            setIsModalOpen(true);
        }
    };

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between px-4 py-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--navy))]/10">
                        <CalendarIcon className="h-6 w-6 text-[hsl(var(--navy))]" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {format(currentMonth, 'MMMM yyyy')}
                        </h2>
                        <p className="text-sm text-slate-500">Plan your academic and event schedule</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                        <Button
                            variant={filter === 'all' ? 'default' : 'ghost'}
                            size="sm"
                            className="rounded-lg h-8"
                            onClick={() => setFilter('all')}
                        >
                            All
                        </Button>
                        <Button
                            variant={filter === 'event' ? 'default' : 'ghost'}
                            size="sm"
                            className="rounded-lg h-8"
                            onClick={() => setFilter('event')}
                        >
                            Events
                        </Button>
                        <Button
                            variant={filter === 'hackathon' ? 'default' : 'ghost'}
                            size="sm"
                            className="rounded-lg h-8"
                            onClick={() => setFilter('hackathon')}
                        >
                            Hackathons
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                {days.map((day) => (
                    <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = 'd';
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = '';

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                const cloneDay = day;

                const dayEvents = filter !== 'hackathon' && filter !== 'webinar' ? events.filter(e => isSameDay(new Date(e.startDate), cloneDay)) : [];
                const dayHackathons = filter !== 'event' && filter !== 'webinar' ? hackathons.filter(h => isSameDay(new Date(h.startDate), cloneDay)) : [];
                const dayWebinars = filter !== 'event' && filter !== 'hackathon' ? webinars.filter(w => isSameDay(new Date(w.startDate), cloneDay)) : [];

                const hasContent = dayEvents.length > 0 || dayHackathons.length > 0 || dayWebinars.length > 0;

                days.push(
                    <div
                        key={day.toString()}
                        className={cn(
                            "relative min-h-[120px] border-r border-b border-slate-200 dark:border-slate-700 p-2 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer",
                            !isSameMonth(day, monthStart) && "bg-slate-50/30 text-slate-300 dark:bg-slate-900/20 dark:text-slate-600",
                            isSameDay(day, new Date()) && "bg-blue-50/30 dark:bg-blue-900/10"
                        )}
                        onClick={() => handleDateClick(cloneDay)}
                    >
                        <span className={cn(
                            "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                            isSameDay(day, new Date()) ? "bg-blue-600 text-white" : "text-slate-700 dark:text-slate-300"
                        )}>
                            {formattedDate}
                        </span>

                        <div className="mt-2 space-y-1">
                            {dayHackathons.map((h) => (
                                <div key={h.id} className="truncate rounded-md bg-orange-100 px-2 py-1 text-[10px] font-bold text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                                    🏆 {h.title}
                                </div>
                            ))}

                            {dayEvents.map((e) => (
                                <div key={e.id} className="truncate rounded-md bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                    📅 {e.title}
                                </div>
                            ))}

                            {dayWebinars.map((w) => (
                                <div key={w.id} className="truncate rounded-md bg-teal-100 px-2 py-1 text-[10px] font-bold text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                                    🎥 {w.title}
                                </div>
                            ))}
                        </div>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="bg-white dark:bg-slate-900 border-l border-t border-slate-200 dark:border-slate-700">{rows}</div>;
    };

    return (
        <div className="space-y-6 pb-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50">
                    {renderHeader()}
                    <CardContent className="p-0">
                        {renderDays()}
                        {renderCells()}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Event Details Dialog */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            Events for {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedDateEvents.length} activities scheduled for this day.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {selectedDateEvents.map((item: any, idx) => (
                            <div key={idx} className="flex gap-4 p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                                <div className={cn(
                                    "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
                                    item.type === 'hackathon' ? "bg-orange-100 text-orange-600" :
                                        item.type === 'webinar' ? "bg-teal-100 text-teal-600" :
                                            "bg-blue-100 text-blue-600"
                                )}>
                                    {item.type === 'hackathon' ? <Trophy className="h-6 w-6" /> :
                                        item.type === 'webinar' ? <Video className="h-6 w-6" /> :
                                            <CalendarIcon className="h-6 w-6" />}
                                </div>
                                <div>
                                    <h4 className="font-bold">{item.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                        <Clock className="h-3 w-3" />
                                        {format(new Date(item.startDate), 'h:mm a')}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                        <MapPin className="h-3 w-3" />
                                        {item.collegeName || item.speaker || 'Online'}
                                    </div>
                                    <Badge variant="secondary" className="mt-2 text-[10px] uppercase tracking-wider">
                                        {item.type}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setIsModalOpen(false)} className="w-full">Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EventCalendarPage;
