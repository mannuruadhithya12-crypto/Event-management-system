import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Trophy, Users, Award } from 'lucide-react';
import { useAuthStore } from '@/store';

interface Hackathon {
    id: string;
    title: string;
    status: string;
    date: string;
    team: string;
    result?: string;
}

const StudentHackathonDashboard = () => {
    const { user } = useAuthStore();
    const [hackathons, setHackathons] = useState<Hackathon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHackathons = async () => {
            try {
                // TODO: Replace with specific endpoint for student's hackathons
                const response = await api.get<Hackathon[]>(`/hackathons/student/${user?.id}`);
                // Fallback mock data if API fails or is not implemented yet
                if (!response) throw new Error("No data");
                setHackathons(response);
            } catch (error) {
                console.error("Failed to fetch hackathons", error);
                // Mock data
                setHackathons([
                    {
                        id: '1',
                        title: 'AI Innovation Challenge',
                        status: 'Registered',
                        date: '2024-03-15',
                        team: 'Neural Navigators',
                        result: 'Pending'
                    },
                    {
                        id: '2',
                        title: 'Green Tech Hackathon',
                        status: 'Completed',
                        date: '2024-01-20',
                        team: 'EcoWarriors',
                        result: 'Winner (1st Place)'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchHackathons();
    }, [user]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Hackathons</h1>
                    <p className="text-muted-foreground">Manage your hackathon participations and results</p>
                </div>
                <Button>Find New Hackathons</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {hackathons.map((hack: any) => (
                    <Card key={hack.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {hack.title}
                            </CardTitle>
                            {hack.result && hack.result.includes('Winner') ? <Trophy className="h-4 w-4 text-yellow-500" /> : <Calendar className="h-4 w-4 text-muted-foreground" />}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{hack.status}</div>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                <Users className="h-3 w-3 mr-1" /> {hack.team}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Date: {hack.date}
                            </p>
                            {hack.result && (
                                <div className="mt-4 flex items-center text-sm font-medium text-green-600">
                                    <Award className="h-4 w-4 mr-2" />
                                    {hack.result}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default StudentHackathonDashboard;
