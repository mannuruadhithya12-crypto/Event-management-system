import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Award } from 'lucide-react';
import { useAuthStore } from '@/store';
import { api } from '@/lib/api';

const FacultyHackathonsDashboard = () => {
    const { user } = useAuthStore();
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHackathons = async () => {
            try {
                // TODO: Fetch hackathons organized by faculty
                const response = await api.get(`/faculty/hackathons/${user?.id}`);
                if (!response) throw new Error("No data");
                setHackathons(response);
            } catch (error) {
                console.error("Failed to fetch hackathons", error);
                setHackathons([
                    {
                        id: '1',
                        title: 'CodeBlaze 2024',
                        teams: 12,
                        submissions: 10,
                        status: 'Ongoing'
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
                    <p className="text-muted-foreground">Manage hackathons, teams, and results</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Hackathon
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {hackathons.map((hack: any) => (
                    <Card key={hack.id}>
                        <CardHeader>
                            <CardTitle>{hack.title}</CardTitle>
                            <CardDescription>Status: {hack.status}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="text-center p-2 bg-slate-50 rounded">
                                    <div className="text-xl font-bold">{hack.teams}</div>
                                    <div className="text-xs text-muted-foreground">Teams</div>
                                </div>
                                <div className="text-center p-2 bg-slate-50 rounded">
                                    <div className="text-xl font-bold">{hack.submissions}</div>
                                    <div className="text-xs text-muted-foreground">Submissions</div>
                                </div>
                            </div>
                            <Button className="w-full">
                                View Details & Results
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FacultyHackathonsDashboard;
