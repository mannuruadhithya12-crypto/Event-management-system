import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Event, Hackathon } from '@/types';

const EventCalendarPage = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const [hackathons, setHackathons] = useState<Hackathon[]>([]);
    const [filter, setFilter] = useState<'all' | 'event' | 'hackathon'>('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsData, hackathonsData] = await Promise.all([
                    api.get<Event[]>('/events'),
                    api.get<Hackathon[]>('/hackathons')
                ]);
                setEvents(eventsData);
                setHackathons(hackathonsData);
            } catch (error) {
                console.error("Failed to fetch calendar data:", error);
            }
        };
        fetchData();
    }, []);

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

                const dayEvents = filter !== 'hackathon' ? events.filter(e => isSameDay(new Date(e.startDate), cloneDay)) : [];
                const dayHackathons = filter !== 'event' ? hackathons.filter(h => isSameDay(new Date(h.startDate), cloneDay)) : [];

                days.push(
                    <div
                        key={day.toString()}
                        className={cn(
                            "relative min-h-[120px] border-r border-b border-slate-200 dark:border-slate-700 p-2 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/40",
                            !isSameMonth(day, monthStart) && "bg-slate-50/30 text-slate-300 dark:bg-slate-900/20 dark:text-slate-600",
                            isSameDay(day, new Date()) && "bg-blue-50/30 dark:bg-blue-900/10"
                        )}
                    >
                        <span className={cn(
                            "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                            isSameDay(day, new Date()) ? "bg-blue-600 text-white" : "text-slate-700 dark:text-slate-300"
                        )}>
                            {formattedDate}
                        </span>

                        <div className="mt-2 space-y-1">
                            {dayHackathons.map((h) => (
                                <TooltipProvider key={h.id}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex items-center gap-1.5 truncate rounded-md bg-orange-100 px-2 py-1 text-[10px] font-bold text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                                <Trophy className="h-3 w-3 shrink-0" />
                                                <span className="truncate">{h.title}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="max-w-[200px] p-3">
                                            <p className="font-bold">{h.title}</p>
                                            <p className="text-xs text-slate-500 mt-1">{h.collegeName}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}

                            {dayEvents.map((e) => (
                                <TooltipProvider key={e.id}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex items-center gap-1.5 truncate rounded-md bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                <CalendarIcon className="h-3 w-3 shrink-0" />
                                                <span className="truncate">{e.title}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="max-w-[200px] p-3">
                                            <p className="font-bold">{e.title}</p>
                                            <p className="text-xs text-slate-500 mt-1">{e.collegeName}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
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
                <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/50 dark:shadow-none">
                    {renderHeader()}
                    <CardContent className="p-0">
                        {renderDays()}
                        {renderCells()}
                    </CardContent>
                </Card>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1 border-none bg-gradient-to-br from-[hsl(var(--navy))] to-blue-900 text-white p-6 rounded-[32px]">
                    <h3 className="text-xl font-bold mb-2">Legend</h3>
                    <div className="space-y-4 mt-4">
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded-full bg-orange-400" />
                            <span className="text-sm font-medium">Hackathons</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded-full bg-blue-400" />
                            <span className="text-sm font-medium">College Events</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded-full bg-[hsl(var(--teal))]" />
                            <span className="text-sm font-medium">Webinars (Coming Soon)</span>
                        </div>
                    </div>
                </Card>

                <Card className="md:col-span-2 border-none rounded-[32px] bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20">
                    <CardHeader>
                        <CardTitle>Upcoming Highlights</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {[...hackathons, ...events].slice(0, 3).map((item, idx) => (
                                <div key={idx} className="min-w-[200px] flex-1 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                                        {format(new Date(item.startDate), 'MMM d, yyyy')}
                                    </p>
                                    <h4 className="font-bold mt-1 line-clamp-1">{item.title}</h4>
                                    <p className="text-xs text-slate-500 mt-2">{item.collegeName}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EventCalendarPage;
