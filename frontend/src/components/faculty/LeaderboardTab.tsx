import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

interface LeaderboardProps {
    hackathonId: string;
}

const LeaderboardTab = ({ hackathonId }: LeaderboardProps) => {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
        // Set up polling for real-time updates
        const interval = setInterval(loadLeaderboard, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, [hackathonId]);

    const loadLeaderboard = async () => {
        try {
            setLoading(true);
            // TODO: Implement leaderboard API
            // Mock data for demonstration
            setLeaderboard([
                {
                    id: '1',
                    rank: 1,
                    teamName: 'Team Alpha',
                    teamLogo: '',
                    totalScore: 95,
                    innovation: 24,
                    implementation: 23,
                    presentation: 24,
                    impact: 24,
                    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
                },
                {
                    id: '2',
                    rank: 2,
                    teamName: 'Code Warriors',
                    teamLogo: '',
                    totalScore: 88,
                    innovation: 22,
                    implementation: 22,
                    presentation: 22,
                    impact: 22,
                    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
                },
                {
                    id: '3',
                    rank: 3,
                    teamName: 'Tech Titans',
                    teamLogo: '',
                    totalScore: 82,
                    innovation: 20,
                    implementation: 21,
                    presentation: 20,
                    impact: 21,
                    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
                },
            ]);
        } catch (error: any) {
            console.error('Failed to load leaderboard:', error);
            toast.error('Failed to load leaderboard');
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Trophy className="h-6 w-6 text-yellow-500" />;
            case 2:
                return <Medal className="h-6 w-6 text-slate-400" />;
            case 3:
                return <Award className="h-6 w-6 text-amber-600" />;
            default:
                return <span className="text-lg font-bold text-slate-500">#{rank}</span>;
        }
    };

    const getRankBadge = (rank: number) => {
        if (rank === 1) return 'bg-yellow-500';
        if (rank === 2) return 'bg-slate-400';
        if (rank === 3) return 'bg-amber-600';
        return 'bg-slate-500';
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Live Leaderboard
                    </CardTitle>
                    <Badge variant="outline" className="animate-pulse">
                        Live Updates
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                {leaderboard.length === 0 ? (
                    <div className="py-8 text-center text-slate-500">
                        <Trophy className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Rankings Yet</h3>
                        <p>Rankings will appear once teams are scored</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Top 3 Podium */}
                        <div className="grid gap-4 md:grid-cols-3 mb-6">
                            {leaderboard.slice(0, 3).map((team) => (
                                <Card key={team.id} className={`${team.rank === 1 ? 'border-yellow-500 border-2' : ''}`}>
                                    <CardContent className="p-6 text-center">
                                        <div className="flex justify-center mb-3">
                                            {getRankIcon(team.rank)}
                                        </div>
                                        <Avatar className="h-16 w-16 mx-auto mb-3">
                                            <AvatarImage src={team.teamLogo} />
                                            <AvatarFallback>{team.teamName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <h3 className="font-semibold text-lg mb-1">{team.teamName}</h3>
                                        <div className="flex items-center justify-center gap-2 mt-2">
                                            <Trophy className="h-4 w-4 text-yellow-500" />
                                            <span className="text-2xl font-bold">{team.totalScore}</span>
                                            <span className="text-slate-500">/100</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Full Leaderboard Table */}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-20">Rank</TableHead>
                                    <TableHead>Team</TableHead>
                                    <TableHead className="text-center">Innovation</TableHead>
                                    <TableHead className="text-center">Implementation</TableHead>
                                    <TableHead className="text-center">Presentation</TableHead>
                                    <TableHead className="text-center">Impact</TableHead>
                                    <TableHead className="text-center">Total Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leaderboard.map((team) => (
                                    <TableRow key={team.id} className={team.rank <= 3 ? 'bg-slate-50 dark:bg-slate-900' : ''}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getRankIcon(team.rank)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={team.teamLogo} />
                                                    <AvatarFallback>{team.teamName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{team.teamName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">{team.innovation}/25</TableCell>
                                        <TableCell className="text-center">{team.implementation}/25</TableCell>
                                        <TableCell className="text-center">{team.presentation}/25</TableCell>
                                        <TableCell className="text-center">{team.impact}/25</TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={getRankBadge(team.rank)}>
                                                {team.totalScore}/100
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default LeaderboardTab;
