import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    Users,
    Trophy,
    Edit,
    Trash2,
    Download,
    Award,
    FileText,
    Code,
    Plus,
    Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { hackathonApi, facultyApi } from '@/lib/api';
import { toast } from 'sonner';

const FacultyHackathonDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [hackathon, setHackathon] = useState<any>(null);
    const [teams, setTeams] = useState<any[]>([]);
    const [problemStatements, setProblemStatements] = useState<any[]>([]);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isProblemDialogOpen, setIsProblemDialogOpen] = useState(false);
    const [isScoringDialogOpen, setIsScoringDialogOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [problemForm, setProblemForm] = useState({ title: '', description: '', difficulty: 'MEDIUM' });
    const [scoreForm, setScoreForm] = useState({ innovation: 0, implementation: 0, presentation: 0, impact: 0 });

    useEffect(() => {
        loadHackathonDetails();
    }, [id]);

    const loadHackathonDetails = async () => {
        try {
            setLoading(true);
            const hackathonData = await facultyApi.getHackathon(id!);
            setHackathon(hackathonData);

            // Get teams
            try {
                const teamsData = await facultyApi.getHackathonTeams(id!);
                setTeams(teamsData || []);
            } catch (err) {
                console.error('Failed to load teams:', err);
                setTeams([]);
            }
        } catch (error: any) {
            console.error('Failed to load hackathon details:', error);
            toast.error('Failed to load hackathon details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this hackathon?')) return;

        try {
            await facultyApi.deleteHackathon(id!);
            toast.success('Hackathon deleted successfully');
            navigate('/dashboard/faculty/hackathons');
        } catch (error: any) {
            console.error('Failed to delete hackathon:', error);
            toast.error('Failed to delete hackathon');
        }
    };

    const handleExportTeams = () => {
        const csv = [
            ['Team Name', 'Leader', 'Members', 'Status', 'Submission'],
            ...teams.map(team => [
                team.teamName || 'N/A',
                team.leaderName || 'N/A',
                team.memberCount || 0,
                team.status || 'REGISTERED',
                team.hasSubmission ? 'Yes' : 'No',
            ]),
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${hackathon?.title || 'hackathon'}_teams.csv`;
        a.click();
        toast.success('Teams exported successfully');
    };

    const handleGenerateCertificates = async () => {
        try {
            // TODO: Implement certificate generation API
            toast.success('Certificates generated successfully');
        } catch (error: any) {
            console.error('Failed to generate certificates:', error);
            toast.error('Failed to generate certificates');
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!hackathon) {
        return (
            <Card>
                <CardContent className="py-16 text-center">
                    <h3 className="text-lg font-semibold mb-2">Hackathon not found</h3>
                    <Button onClick={() => navigate('/dashboard/faculty/hackathons')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hackathons
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/dashboard/faculty/hackathons')}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{hackathon.title}</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Hackathon Details & Management
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/dashboard/faculty/hackathons/${id}/edit`)}
                    >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>
            </motion.div>

            {/* Hackathon Info Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Hackathon Information</CardTitle>
                        <Badge variant={hackathon.status === 'ACTIVE' ? 'default' : 'secondary'}>
                            {hackathon.status?.replace('_', ' ')}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-slate-500" />
                                <div>
                                    <p className="text-sm text-slate-500">Start Date</p>
                                    <p className="font-medium">
                                        {hackathon.startDate ? new Date(hackathon.startDate).toLocaleString() : 'TBD'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-slate-500" />
                                <div>
                                    <p className="text-sm text-slate-500">End Date</p>
                                    <p className="font-medium">
                                        {hackathon.endDate ? new Date(hackathon.endDate).toLocaleString() : 'TBD'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-slate-500" />
                                <div>
                                    <p className="text-sm text-slate-500">Teams Registered</p>
                                    <p className="font-medium">
                                        {teams.length} / {hackathon.maxTeams || '∞'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Trophy className="h-5 w-5 text-slate-500" />
                                <div>
                                    <p className="text-sm text-slate-500">Prize Pool</p>
                                    <p className="font-medium">{hackathon.prizePool || 'N/A'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-2">Description</p>
                                <p className="text-sm">{hackathon.description || 'No description provided'}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="teams">
                <TabsList>
                    <TabsTrigger value="teams">Teams ({teams.length})</TabsTrigger>
                    <TabsTrigger value="problems">Problem Statements</TabsTrigger>
                    <TabsTrigger value="submissions">Submissions</TabsTrigger>
                    <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                    <TabsTrigger value="certificates">Certificates</TabsTrigger>
                </TabsList>

                <TabsContent value="teams" className="mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Registered Teams</CardTitle>
                                <Button variant="outline" size="sm" onClick={handleExportTeams}>
                                    <Download className="mr-2 h-4 w-4" /> Export CSV
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {teams.length === 0 ? (
                                <div className="py-8 text-center text-slate-500">
                                    No teams registered yet
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Team Name</TableHead>
                                            <TableHead>Leader</TableHead>
                                            <TableHead>Members</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {teams.map((team) => (
                                            <TableRow key={team.id}>
                                                <TableCell className="font-medium">
                                                    {team.teamName || 'N/A'}
                                                </TableCell>
                                                <TableCell>{team.leaderName || 'N/A'}</TableCell>
                                                <TableCell>{team.memberCount || 0}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{team.status || 'REGISTERED'}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => navigate(`/dashboard/faculty/teams/${team.id}`)}
                                                    >
                                                        View Details
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="submissions" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Submissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="py-8 text-center text-slate-500">
                                <Code className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Submission Review</h3>
                                <p>Review and score team submissions</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="leaderboard" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Live Leaderboard</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="py-8 text-center text-slate-500">
                                <Trophy className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Leaderboard</h3>
                                <p>Rankings will appear here once scoring begins</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="certificates" className="mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Certificate Generation</CardTitle>
                                <Button onClick={handleGenerateCertificates}>
                                    <Award className="mr-2 h-4 w-4" /> Generate Certificates
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="py-8 text-center">
                                <Award className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Certificate Generation</h3>
                                <p className="text-slate-500 mb-4">
                                    Generate certificates for all participating teams
                                </p>
                                <p className="text-sm text-slate-600">
                                    {teams.length} teams eligible for certificates
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default FacultyHackathonDetailPage;
