import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

interface TeamMember {
    name: string;
    role: string;
}

interface Team {
    id: string;
    name: string;
    hackathon: string;
    role: string;
    members: TeamMember[];
}

const StudentTeamsDashboard = () => {
    const { user } = useAuthStore();
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            // TODO: Create endpoint for getting all teams a student is part of
            // Mock for now or implement /teams/student/:userId
            try {
                const response = await api.get<Team[]>(`/hackathons/teams/student/${user?.id}`);
                if (!response) throw new Error("No data");
                setTeams(response);
            } catch (error) {
                console.error("Failed to fetch teams", error);
                // Fallback to mock data
                setTeams([
                    {
                        id: '1',
                        name: 'Neural Navigators',
                        hackathon: 'AI Innovation Challenge',
                        role: 'Leader',
                        members: [
                            { name: 'Alex Johnson', role: 'Leader' },
                            { name: 'Sam Smith', role: 'Member' }
                        ]
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchTeams();
    }, [user]);

    const handleCreateTeam = () => {
        toast.info("Create Team Modal trigger - To be implemented");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Teams</h1>
                    <p className="text-muted-foreground">Manage your hackathon teams and members</p>
                </div>
                <Button onClick={handleCreateTeam}>
                    <UserPlus className="mr-2 h-4 w-4" /> Create Team
                </Button>
            </div>

            <div className="grid gap-6">
                {teams.map((team: any) => (
                    <Card key={team.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between">
                                <span>{team.name}</span>
                                <span className="text-sm font-normal text-muted-foreground">{team.hackathon}</span>
                            </CardTitle>
                            <CardDescription>Role: {team.role}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold">Members</h4>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {team.members.map((member: any, i: number) => (
                                        <div key={i} className="flex items-center space-x-4 rounded-md border p-4">
                                            <Users className="h-5 w-5 text-muted-foreground" />
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">{member.name}</p>
                                                <p className="text-xs text-muted-foreground">{member.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button variant="destructive" size="sm">
                                        <LogOut className="mr-2 h-4 w-4" /> Leave Team
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default StudentTeamsDashboard;
