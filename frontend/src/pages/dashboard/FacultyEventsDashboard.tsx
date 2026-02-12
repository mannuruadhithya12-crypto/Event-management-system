import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store';
import { api } from '@/lib/api';

interface Event {
    id: string;
    title: string;
    date: string;
    participants: number;
    status: string;
}

const FacultyEventsDashboard = () => {
    const { user } = useAuthStore();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // TODO: Fetch events created by this faculty
                const response = await api.get<Event[]>(`/faculty/events/${user?.id}`);
                if (!response) throw new Error("No data");
                setEvents(response);
            } catch (error) {
                console.error("Failed to fetch events", error);
                setEvents([
                    {
                        id: '1',
                        title: 'Intro to Java',
                        date: '2024-04-10',
                        participants: 45,
                        status: 'Upcoming'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchEvents();
    }, [user]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
                    <p className="text-muted-foreground">Manage events you have organized</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Event
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event: any) => (
                    <Card key={event.id}>
                        <CardHeader>
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription>{event.date}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-medium">{event.participants} Participants</span>
                                <span className={`px-2 py-1 rounded text-xs ${event.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
                                    {event.status}
                                </span>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm" className="w-full">
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                </Button>
                                <Button variant="destructive" size="sm" className="w-full">
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FacultyEventsDashboard;
