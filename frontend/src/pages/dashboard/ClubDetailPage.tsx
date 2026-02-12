import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Calendar,
    MapPin,
    Globe,
    Mail,
    ChevronLeft,
    UserPlus,
    Share2,
    Trophy,
    Settings,
    ShieldCheck,
    XCircle,
    CheckCircle2,
    MessageCircle,
    Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { clubApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import type { Club } from '@/types';
import RecruitmentModule from '@/components/RecruitmentModule';
import ActivityTimeline from '@/components/ActivityTimeline';
import { toast } from 'sonner';
import { format } from 'date-fns';

const ClubDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [club, setClub] = useState<Club | null>(null);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const isPresident = user?.id === club?.presidentId;

    const fetchClub = async () => {
        if (!id) return;
        try {
            const data = await clubApi.getById(id);
            setClub(data);

            if (user?.id === data.presidentId) {
                const reqs = await clubApi.getJoinRequests(id);
                setRequests(reqs);
            }
        } catch (error) {
            console.error("Failed to fetch club:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClub();
    }, [id, user?.id]);

    const handleRequestAction = async (requestId: string, status: string) => {
        try {
            await clubApi.updateJoinRequestStatus(requestId, status);
            toast.success(`Request ${status.toLowerCase()} successfully`);
            setRequests(requests.filter(r => r.id !== requestId));
        } catch (error) {
            toast.error('Failed to update request');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--teal))]" />
            <p className="mt-4 text-slate-500 font-medium">Loading club details...</p>
        </div>
    );
    if (!club) return <div>Club not found</div>;

    return (
        <div className="space-y-6 pb-12">
            <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent" onClick={() => navigate('/dashboard/clubs')}>
                <ChevronLeft className="h-4 w-4" />
                Back to Clubs
            </Button>

            {/* Banner */}
            <div className="relative h-72 w-full rounded-3xl bg-slate-100 overflow-hidden dark:bg-slate-800 shadow-xl">
                {club.bannerUrl ? (
                    <img src={club.bannerUrl} alt={club.name} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[hsl(var(--navy))] via-[hsl(var(--navy))]/90 to-[hsl(var(--teal))]">
                        <Users className="h-20 w-20 text-white opacity-20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute -bottom-1 left-8 flex items-end gap-6 pb-6">
                    <div className="h-32 w-32 rounded-3xl border-4 border-white bg-white shadow-2xl dark:border-slate-950 overflow-hidden transform transition-transform hover:scale-105">
                        {club.logoUrl ? (
                            <img src={club.logoUrl} alt="logo" className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-slate-200 dark:bg-slate-800">
                                <span className="text-3xl font-bold text-slate-500">{club.name.charAt(0)}</span>
                            </div>
                        )}
                    </div>
                    <div className="mb-2 text-white">
                        <h1 className="text-4xl font-extrabold tracking-tight">{club.name}</h1>
                        <div className="flex items-center gap-2 text-white/80 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm font-medium">{club.collegeName}</span>
                            <span className="mx-2 opacity-50">•</span>
                            <Badge variant="secondary" className="bg-white/20 text-white border-none backdrop-blur-md">
                                {club.category || 'General'}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-8 px-2">
                <div className="flex gap-2">
                    {club.tags?.split(',').map(tag => (
                        <Badge key={tag} variant="outline" className="rounded-lg px-3 py-1 border-slate-200 dark:border-slate-800">
                            #{tag.trim()}
                        </Badge>
                    ))}
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="lg" className="rounded-2xl gap-2 hover:bg-slate-50">
                        <Share2 className="h-4 w-4" />
                        Share
                    </Button>
                    {!isPresident && (
                        <Button size="lg" className="rounded-2xl gap-2 bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/90 shadow-lg text-white font-bold">
                            <UserPlus className="h-4 w-4" />
                            Apply to Join
                        </Button>
                    )}
                    {isPresident && (
                        <Button variant="outline" size="lg" className="rounded-2xl gap-2">
                            <Settings className="h-4 w-4" />
                            Manage Club
                        </Button>
                    )}
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-8 mt-4">
                <TabsList className="bg-transparent border-b rounded-none w-full justify-start gap-8 h-12 p-0">
                    <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[hsl(var(--teal))] data-[state=active]:bg-transparent shadow-none font-bold text-lg px-2">Overview</TabsTrigger>
                    <TabsTrigger value="recruitments" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[hsl(var(--teal))] data-[state=active]:bg-transparent shadow-none font-bold text-lg px-2">Recruitments</TabsTrigger>
                    <TabsTrigger value="events" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[hsl(var(--teal))] data-[state=active]:bg-transparent shadow-none font-bold text-lg px-2">Events</TabsTrigger>
                    <TabsTrigger value="members" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[hsl(var(--teal))] data-[state=active]:bg-transparent shadow-none font-bold text-lg px-2">Members</TabsTrigger>
                    {isPresident && (
                        <TabsTrigger value="management" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[hsl(var(--teal))] data-[state=active]:bg-transparent shadow-none font-bold text-lg px-2 flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5" />
                            Requests
                            {requests.length > 0 && (
                                <span className="bg-red-500 text-white text-[10px] h-4 w-4 flex items-center justify-center rounded-full">
                                    {requests.length}
                                </span>
                            )}
                        </TabsTrigger>
                    )}
                </TabsList>

                <TabsContent value="overview" className="space-y-8 outline-none">
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl">
                                <CardHeader>
                                    <CardTitle className="text-2xl">About the Club</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                                        {club.description}
                                    </p>
                                </CardContent>
                            </Card>

                            {club.achievements && (
                                <Card className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl overflow-hidden">
                                    <div className="bg-orange-50/50 dark:bg-orange-900/10 p-6 flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                                            <Trophy className="h-6 w-6 text-orange-500" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">Achievements & Hall of Fame</CardTitle>
                                            <CardDescription>Major milestones and awards won by the club</CardDescription>
                                        </div>
                                    </div>
                                    <CardContent className="p-8">
                                        <div className="prose dark:prose-invert max-w-none">
                                            {club.achievements.split('\n').map((line, i) => (
                                                <p key={i} className="flex items-start gap-2">
                                                    <span className="text-orange-500 mt-1">•</span>
                                                    {line}
                                                </p>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        <div className="space-y-8">
                            <Card className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl">
                                <CardHeader>
                                    <CardTitle>Key Info</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                            <Users className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Faculty Advisor</p>
                                            <p className="text-lg font-medium">{club.facultyAdvisorName || 'Dr. Arjun Mehta'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                                            <ShieldCheck className="h-5 w-5 text-purple-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">President</p>
                                            <p className="text-lg font-medium">{club.presidentName || 'Vikram Singh'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                                            <Calendar className="h-5 w-5 text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Established</p>
                                            <p className="text-lg font-medium">{new Date(club.createdAt).getFullYear()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Recent Activity</CardTitle>
                                        <Activity className="h-4 w-4 text-slate-400" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ActivityTimeline clubId={club.id} />
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm bg-gradient-to-br from-[hsl(var(--teal))] to-[hsl(var(--navy))] text-white rounded-3xl p-6">
                                <h4 className="text-xl font-bold mb-2">Want to lead?</h4>
                                <p className="text-white/80 text-sm mb-6">Check our active recruitment positions to contribute to the club's growth.</p>
                                <Button className="w-full bg-white text-[hsl(var(--navy))] hover:bg-white/90 rounded-xl font-bold">
                                    View Openings
                                </Button>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="recruitments" className="outline-none">
                    <RecruitmentModule clubId={club.id} isPresident={isPresident} />
                </TabsContent>

                <TabsContent value="events" className="outline-none">
                    <div className="py-20 text-center space-y-4">
                        <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                            <Calendar className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold">No upcoming events</h3>
                        <p className="text-slate-500 max-w-xs mx-auto">This club hasn't scheduled any upcoming events yet. Check back soon!</p>
                    </div>
                </TabsContent>

                <TabsContent value="management" className="outline-none">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold">Membership Requests</h3>
                                <p className="text-slate-500">Review and approve students who want to join your club.</p>
                            </div>
                        </div>

                        {requests.length === 0 ? (
                            <Card className="border-dashed border-2 py-20 flex flex-col items-center justify-center text-center">
                                <Users className="h-16 w-16 text-slate-200 mb-4" />
                                <h4 className="text-xl font-bold">No pending requests</h4>
                                <p className="text-slate-500">All caught up! New requests will appear here.</p>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {requests.map((request) => (
                                    <Card key={request.id} className="group border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all rounded-3xl overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-14 w-14 border-2 border-slate-100">
                                                        <AvatarImage src={`https://avatar.vercel.sh/${request.user?.id}`} />
                                                        <AvatarFallback className="bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))] font-bold text-lg">
                                                            {request.user?.firstName?.[0] || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className="font-bold text-xl">{request.user?.firstName} {request.user?.lastName}</h4>
                                                        <p className="text-sm text-slate-500">Applied on {format(new Date(request.createdAt), 'MMM d, h:mm a')}</p>
                                                    </div>
                                                </div>

                                                <div className="flex-1 max-w-md">
                                                    <div className="bg-slate-100/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                            <MessageCircle className="h-3 w-3" />
                                                            Statement of Interest
                                                        </div>
                                                        <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{request.message}"</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        variant="outline"
                                                        className="rounded-xl border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 gap-2 h-11 px-5"
                                                        onClick={() => handleRequestAction(request.id, 'REJECTED')}
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        className="rounded-xl bg-[hsl(var(--teal))] text-white hover:bg-[hsl(var(--teal))]/90 gap-2 h-11 px-5 shadow-lg shadow-teal-500/20"
                                                        onClick={() => handleRequestAction(request.id, 'APPROVED')}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Approve
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ClubDetailPage;
