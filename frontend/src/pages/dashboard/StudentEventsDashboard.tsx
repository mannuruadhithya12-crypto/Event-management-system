import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useAuthStore } from '@/store';
import { api } from '@/lib/api';

interface Event {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    mode: string;
    status: string;
}

const StudentEventsDashboard = () => {
    const { user } = useAuthStore();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get<Event[]>(`/events/student/${user?.id}`);
                if (!response) throw new Error("No data");
                setEvents(response);
            } catch (error) {
                console.error("Failed to fetch events", error);
                // Fallback mock data
                setEvents([
                    {
                        id: '1',
                        title: 'AI Workshop',
                        description: 'Introduction to Artificial Intelligence',
                        startDate: '2024-05-15T10:00:00',
                        endDate: '2024-05-15T12:00:00',
                        location: 'Auditorium A',
                        mode: 'OFFLINE',
                        status: 'REGISTERED'
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
            <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
            <p className="text-muted-foreground">Events you are registered for.</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                    <Card key={event.id}>
                        <CardHeader>
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(event.startDate).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {event.mode === 'ONLINE' ? 'Online' : event.location}
                                </div>
                            </div>
                            <Button className="w-full mt-4" variant="outline">
                                View Details
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default StudentEventsDashboard;
