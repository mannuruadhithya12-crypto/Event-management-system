import React, { useState, useEffect } from 'react';
import {
    Users,
    UserPlus,
    Shield,
    Copy,
    Check,
    Plus,
    LogOut,
    Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { hackathonApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

interface TeamModuleProps {
    hackathonId: string;
}

const TeamModule: React.FC<TeamModuleProps> = ({ hackathonId }) => {
    const { user } = useAuthStore();
    const [team, setTeam] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [joinCode, setJoinCode] = useState('');
    const [teamName, setTeamName] = useState('');
    const [copied, setCopied] = useState(false);

    const fetchTeamData = async () => {
        if (!user) return;
        try {
            const myTeam = await hackathonApi.getMyTeam(hackathonId, user.id);
            if (myTeam) {
                setTeam(myTeam);
                const teamMembers = await hackathonApi.getTeamMembers(myTeam.id);
                setMembers(teamMembers);
            } else {
                setTeam(null);
                setMembers([]);
            }
        } catch (error) {
            console.error('Failed to fetch team:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamData();
    }, [hackathonId, user?.id]);

    const handleCreateTeam = async () => {
        if (!teamName.trim() || !user) return;
        try {
            await hackathonApi.createTeam(hackathonId, teamName, user.id);
            toast.success('Team created successfully!');
            fetchTeamData();
        } catch (error: any) {
            toast.error(error.message || 'Failed to create team');
        }
    };

    const handleJoinTeam = async () => {
        if (!joinCode.trim() || !user) return;
        try {
            await hackathonApi.joinTeam(hackathonId, user.id, joinCode);
            toast.success('Joined team successfully!');
            fetchTeamData();
        } catch (error: any) {
            toast.error(error.message || 'Invalid join code');
        }
    };

    const copyJoinCode = () => {
        if (team?.joinCode) {
            navigator.clipboard.writeText(team.joinCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success('Join code copied!');
        }
    };

    if (loading) return <div className="animate-pulse space-y-4">
        <div className="h-32 bg-slate-100 rounded-3xl" />
        <div className="h-64 bg-slate-100 rounded-3xl" />
    </div>;

    if (!team) {
        return (
            <div className="grid gap-8 md:grid-cols-2">
                <Card className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl">
                    <CardHeader>
                        <div className="h-12 w-12 rounded-2xl bg-[hsl(var(--teal))]/10 flex items-center justify-center mb-4">
                            <Plus className="h-6 w-6 text-[hsl(var(--teal))]" />
                        </div>
                        <CardTitle>Create a Team</CardTitle>
                        <CardDescription>Start a new team and invite your friends.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Ente team name..."
                            className="rounded-xl h-12"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                        />
                        <Button className="w-full h-12 rounded-xl bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/90 text-white font-bold" onClick={handleCreateTeam}>
                            Create Team
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl">
                    <CardHeader>
                        <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                            <Search className="h-6 w-6 text-blue-500" />
                        </div>
                        <CardTitle>Join a Team</CardTitle>
                        <CardDescription>Enter a join code sent by your team leader.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Enter 8-digit join code..."
                            className="rounded-xl h-12 uppercase"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            maxLength={8}
                        />
                        <Button variant="outline" className="w-full h-12 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 font-bold" onClick={handleJoinTeam}>
                            Join Team
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const isLeader = user?.id === team.leader?.id;

    return (
        <div className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl">{team.name}</CardTitle>
                                <CardDescription>Team Members ({members.length})</CardDescription>
                            </div>
                            <Badge variant="outline" className="rounded-lg px-2 h-7 gap-1 border-slate-200">
                                <Users className="h-3 w-3" />
                                Team ID: {team.id.substring(0, 8)}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {members.map((m) => (
                                    <div key={m.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                                <AvatarImage src={`https://avatar.vercel.sh/${m.user.id}`} />
                                                <AvatarFallback className="bg-slate-200 font-bold">{m.user.firstName[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-bold flex items-center gap-2">
                                                    {m.user.firstName} {m.user.lastName}
                                                    {m.role === 'LEADER' && (
                                                        <Badge className="bg-orange-100 text-orange-600 border-none text-[10px] h-5 rounded-md px-1.5 font-bold">
                                                            <Shield className="h-3 w-3 mr-0.5" />
                                                            Leader
                                                        </Badge>
                                                    )}
                                                </h4>
                                                <p className="text-sm text-slate-500">{m.user.department}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    {isLeader && (
                        <Card className="border-none shadow-sm bg-gradient-to-br from-[hsl(var(--navy))] to-[hsl(var(--navy))]/90 text-white rounded-3xl overflow-hidden">
                            <div className="p-6">
                                <h4 className="text-lg font-bold mb-1">Invite Members</h4>
                                <p className="text-white/60 text-sm mb-6">Share this code with your teammates to join this hackathon.</p>
                                <div className="relative">
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 font-mono text-2xl font-bold tracking-[0.2em] text-center border border-white/20 select-all">
                                        {team.joinCode}
                                    </div>
                                    <Button
                                        size="icon"
                                        className="absolute -right-2 -top-2 rounded-full bg-white text-[hsl(var(--navy))] hover:bg-white/90 shadow-xl"
                                        onClick={copyJoinCode}
                                    >
                                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    <Card className="border-none shadow-sm bg-white/50 rounded-3xl">
                        <CardHeader>
                            <CardTitle className="text-lg">Project Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Status</label>
                                <Badge className="bg-blue-100 text-blue-600 border-none rounded-lg px-2 py-1 font-bold">
                                    {team.submissionStatus || 'Not Submitted'}
                                </Badge>
                            </div>
                            <Button variant="outline" className="w-full rounded-xl border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 gap-2 font-bold h-11">
                                <LogOut className="h-4 w-4" />
                                Leave Team
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TeamModule;
