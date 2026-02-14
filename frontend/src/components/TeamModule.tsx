import React, { useState, useEffect } from 'react';
import {
    Users,
    UserPlus,
    Shield,
    Copy,
    Check,
    Plus,
    LogOut,
    Search,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

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
        setIsProcessing(true);
        try {
            await hackathonApi.createTeam(hackathonId, teamName, user.id);
            toast.success('Team created successfully!');
            fetchTeamData();
        } catch (error: any) {
            console.error("Team creation failed:", error);
            if (error.message?.includes('User not found') || error.message?.includes('404')) {
                toast.error('User record mismatch. Please re-authenticate.');
                localStorage.removeItem('auth-storage');
                navigate('/login');
            } else {
                toast.error(error.message || 'Failed to create team');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleJoinTeam = async () => {
        if (!joinCode.trim() || !user) return;
        setIsProcessing(true);
        try {
            await hackathonApi.joinTeam(hackathonId, user.id, joinCode);
            toast.success('Joined team successfully!');
            fetchTeamData();
        } catch (error: any) {
            console.error("Team join failed:", error);
            if (error.message?.includes('User not found') || error.message?.includes('404')) {
                toast.error('User record mismatch. Please re-authenticate.');
                localStorage.removeItem('auth-storage');
                navigate('/login');
            } else {
                toast.error(error.message || 'Invalid join code');
            }
        } finally {
            setIsProcessing(false);
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
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl h-full flex flex-col justify-between">
                        <CardHeader>
                            <div className="h-12 w-12 rounded-2xl bg-[hsl(var(--teal))]/10 flex items-center justify-center mb-4">
                                <Plus className="h-6 w-6 text-[hsl(var(--teal))]" />
                            </div>
                            <CardTitle>Create a Team</CardTitle>
                            <CardDescription>Start a new team and invite your friends.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                placeholder="Enter team name..."
                                className="rounded-xl h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-bold"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                            />
                            <Button
                                className="w-full h-12 rounded-xl bg-[hsl(var(--teal))] hover:scale-[1.02] transition-all text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-[hsl(var(--teal))]/20"
                                onClick={handleCreateTeam}
                                disabled={isProcessing}
                            >
                                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'CREATE SQUAD'}
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl h-full flex flex-col justify-between">
                        <CardHeader>
                            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                                <Search className="h-6 w-6 text-blue-500" />
                            </div>
                            <CardTitle>Join a Team</CardTitle>
                            <CardDescription>Enter a join code sent by your team leader.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                placeholder="ENTER 8-DIGIT CODE..."
                                className="rounded-xl h-12 uppercase bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono font-bold text-center tracking-[0.3em]"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                                maxLength={8}
                            />
                            <Button
                                variant="outline"
                                className="w-full h-12 rounded-xl border-2 border-blue-100 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-black uppercase tracking-widest text-xs"
                                onClick={handleJoinTeam}
                                disabled={isProcessing}
                            >
                                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'JOIN ARENA'}
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
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
                                            <Avatar className="h-12 w-12 border-4 border-white dark:border-slate-700 shadow-xl">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.user.name}`} />
                                                <AvatarFallback className="bg-slate-200 dark:bg-slate-700 font-bold">{m.user.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                                    {m.user.name}
                                                    {m.role === 'LEADER' && (
                                                        <Badge className="bg-orange-500 text-white border-none text-[10px] h-5 rounded-md px-1.5 font-black uppercase tracking-tighter shadow-lg shadow-orange-500/20">
                                                            <Shield className="h-3 w-3 mr-0.5" />
                                                            LEADER
                                                        </Badge>
                                                    )}
                                                </h4>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{m.user.department || 'TECH DIVISION'}</p>
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
