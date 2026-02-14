import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store';
import { studentTeamApi, chatApi } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Users,
    MessageSquare,
    FileText,
    Upload,
    Github,
    Link as LinkIcon,
    Send,
    LogOut,
    ShieldCheck,
    Clock,
    CheckCircle2,
    XCircle,
    MoreVertical,
    Folder,
    Award
} from 'lucide-react';

const TeamDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [team, setTeam] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Chat States
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Submission States
    const [projectUrl, setProjectUrl] = useState('');
    const [demoUrl, setDemoUrl] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Invite States
    const [inviteEmail, setInviteEmail] = useState('');

    useEffect(() => {
        fetchTeamDetails();
    }, [id]);

    useEffect(() => {
        if (activeTab === 'chat' && id) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000); // Poll for chat
            return () => clearInterval(interval);
        }
    }, [activeTab, id]);

    const fetchTeamDetails = async () => {
        if (!id) return;
        try {
            const data = await studentTeamApi.getTeam(id);
            setTeam(data);
            if (data.githubUrl) setProjectUrl(data.githubUrl);
            if (data.demoUrl) setDemoUrl(data.demoUrl);
            if (data.fileUrl) setFileUrl(data.fileUrl);
            if (data.projectDescription) setDescription(data.projectDescription);
        } catch (error) {
            console.error("Failed to fetch team:", error);
            toast.error("Failed to load team details");
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        if (!id) return;
        try {
            const data = await chatApi.getMessages(`TEAM_${id}`);
            setMessages(data);
            scrollToBottom();
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleInvite = async () => {
        if (!inviteEmail) return;
        try {
            await studentTeamApi.inviteMember(id!, inviteEmail);
            toast.success(`Invite sent to ${inviteEmail}`);
            setInviteEmail('');
            fetchTeamDetails(); // Refresh list to see if status updates (if logic supports)
        } catch (error) {
            toast.error("Failed to send invite. Check if user exists.");
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !id) return;
        try {
            await studentTeamApi.chat(id, user.id, newMessage);
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    const handleSubmitProject = async () => {
        if (!id) return;
        setSubmitting(true);
        try {
            await studentTeamApi.submitProject(id, {
                projectUrl,
                demoUrl,
                fileUrl,
                description
            });
            toast.success("Project submitted successfully!");
            fetchTeamDetails();
        } catch (error) {
            toast.error("Failed to submit project");
        } finally {
            setSubmitting(false);
        }
    };

    const handleLeaveTeam = async () => {
        if (!id || !user) return;
        if (window.confirm("Are you sure you want to leave this team?")) {
            try {
                await studentTeamApi.leaveTeam(id, user.id);
                toast.success("Left team successfully");
                navigate('/dashboard/student/teams');
            } catch (error: any) {
                toast.error(error.message || "Failed to leave team");
            }
        }
    };

    if (loading) {
        return (
            <div className="p-8 space-y-6">
                <Skeleton className="h-12 w-1/3 rounded-xl" />
                <div className="flex gap-4">
                    <Skeleton className="h-64 w-2/3 rounded-3xl" />
                    <Skeleton className="h-64 w-1/3 rounded-3xl" />
                </div>
            </div>
        );
    }

    if (!team) return <div className="p-8">Team not found</div>;

    const isLeader = team.leaderId === user?.id;

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                            {team.name}
                        </h1>
                        <Badge className={`uppercase tracking-widest px-3 py-1 rounded-full text-[10px] font-bold ${team.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                            }`}>
                            {team.status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500 font-medium">
                        {team.hackathonName && (
                            <span className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-[hsl(var(--teal))]" />
                                {team.hackathonName}
                            </span>
                        )}
                        <span className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {team.members?.length || 0} / {team.maxMembers || 4} Members
                        </span>
                    </div>
                </div>

                <div className="flex gap-3">
                    {isLeader ? (
                        <Button variant="outline" className="rounded-xl border-slate-200 dark:border-slate-800">
                            Manage Settings
                        </Button>
                    ) : (
                        <Button
                            variant="destructive"
                            className="rounded-xl"
                            onClick={handleLeaveTeam}
                        >
                            <LogOut className="mr-2 h-4 w-4" /> Leave Team
                        </Button>
                    )}
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 w-full sm:w-auto h-auto flex gap-2">
                    <TabsTrigger value="overview" className="rounded-2xl px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md font-bold text-xs uppercase tracking-wide">Overview</TabsTrigger>
                    <TabsTrigger value="chat" className="rounded-2xl px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md font-bold text-xs uppercase tracking-wide">Team Chat</TabsTrigger>
                    <TabsTrigger value="members" className="rounded-2xl px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md font-bold text-xs uppercase tracking-wide">Members</TabsTrigger>
                    <TabsTrigger value="submission" className="rounded-2xl px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md font-bold text-xs uppercase tracking-wide">Submission</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="md:col-span-2 rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
                            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <CardTitle>Project Status</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${team.submissionStatus === 'SUBMITTED' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                                            }`}>
                                            {team.submissionStatus === 'SUBMITTED' ? <CheckCircle2 className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                                        </div>
                                        <div>
                                            <p className="font-black text-lg">{team.submissionStatus === 'SUBMITTED' ? 'Submitted' : 'Pending Submission'}</p>
                                            <p className="text-slate-500 text-sm font-medium">
                                                {team.submissionStatus === 'SUBMITTED' ? 'Great job! Your project is under review.' : 'Complete your submission before the deadline.'}
                                            </p>
                                        </div>
                                    </div>
                                    {isLeader && team.submissionStatus !== 'SUBMITTED' && (
                                        <Button onClick={() => setActiveTab('submission')}>Submit Now</Button>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-bold text-lg">About Project</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {team.projectDescription || "No description provided yet. Go to Submission tab to add details."}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
                            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <CardTitle>Quick Links</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-4">
                                {team.githubUrl ? (
                                    <a href={team.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-colors cursor-pointer">
                                        <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center">
                                            <Github className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">GitHub Repository</p>
                                            <p className="text-xs text-slate-500 truncate max-w-[150px]">{team.githubUrl}</p>
                                        </div>
                                    </a>
                                ) : (
                                    <div className="text-center p-4 text-slate-400 text-sm font-medium">No GitHub Link</div>
                                )}

                                {team.demoUrl && (
                                    <a href={team.demoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-colors cursor-pointer">
                                        <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                                            <LinkIcon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Live Demo</p>
                                            <p className="text-xs text-slate-500 truncate max-w-[150px]">{team.demoUrl}</p>
                                        </div>
                                    </a>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Submission Tab */}
                <TabsContent value="submission">
                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
                        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <CardTitle>Project Submission</CardTitle>
                            <CardDescription>Only the team leader can submit details.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 max-w-2xl mx-auto space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1">Project Description</label>
                                    <Textarea
                                        placeholder="Describe your project, tech stack, and solution..."
                                        className="rounded-2xl min-h-[150px]"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        disabled={!isLeader}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1">GitHub Repository URL</label>
                                    <Input
                                        placeholder="https://github.com/..."
                                        className="rounded-xl"
                                        value={projectUrl}
                                        onChange={(e) => setProjectUrl(e.target.value)}
                                        disabled={!isLeader}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1">Demo / Video URL</label>
                                    <Input
                                        placeholder="https://youtu.be/..."
                                        className="rounded-xl"
                                        value={demoUrl}
                                        onChange={(e) => setDemoUrl(e.target.value)}
                                        disabled={!isLeader}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1">Project File URL (Drive/Dropbox)</label>
                                    <Input
                                        placeholder="https://drive.google.com/..."
                                        className="rounded-xl"
                                        value={fileUrl}
                                        onChange={(e) => setFileUrl(e.target.value)}
                                        disabled={!isLeader}
                                    />
                                </div>

                                {isLeader ? (
                                    <Button
                                        size="lg"
                                        className="w-full rounded-xl bg-[hsl(var(--teal))]"
                                        onClick={handleSubmitProject}
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Submitting...' : 'Save & Submit Project'}
                                    </Button>
                                ) : (
                                    <p className="text-center text-red-500 font-medium bg-red-50 p-4 rounded-xl">
                                        Only the team leader can modify submission details.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Members Tab */}
                <TabsContent value="members">
                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black">Team Roster</h3>
                                {isLeader && (
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Invite by email..."
                                            className="w-64 rounded-xl"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                        />
                                        <Button onClick={handleInvite} className="rounded-xl">Invite</Button>
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-4">
                                {team.members?.map((member: any) => (
                                    <div key={member.userId} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                                <AvatarImage src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.userId}`} />
                                                <AvatarFallback>{member.name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{member.name} {member.userId === user?.id && '(You)'}</p>
                                                <div className="flex gap-2 text-xs font-medium text-slate-500">
                                                    <span>{member.email}</span>
                                                    <span>•</span>
                                                    <span className={member.role === 'LEADER' ? 'text-[hsl(var(--teal))]' : ''}>{member.role}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant={member.status === 'ACCEPTED' ? 'default' : 'outline'} className="rounded-full">
                                            {member.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Chat Tab */}
                <TabsContent value="chat">
                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden h-[600px] flex flex-col">
                        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 py-4">
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-[hsl(var(--teal))]" />
                                Team Chat
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                                    <MessageSquare className="h-16 w-16 mb-4" />
                                    <p className="font-medium">No messages yet. Start the conversation!</p>
                                </div>
                            ) : (
                                messages.map((msg, i) => {
                                    const isMe = msg.sender?.id === user?.id; // Check sender object wrapper
                                    const senderName = msg.sender?.name || 'Unknown';
                                    const avatar = msg.sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender?.id || i}`;

                                    return (
                                        <div key={i} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                            <Avatar className="h-8 w-8 mt-1">
                                                <AvatarImage src={avatar} />
                                                <AvatarFallback>{senderName[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                                <span className="text-[10px] text-slate-400 px-1 mb-1">{senderName}</span>
                                                <div className={`p-3 rounded-2xl text-sm font-medium ${isMe
                                                        ? 'bg-[hsl(var(--teal))] text-white rounded-tr-none'
                                                        : 'bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-tl-none'
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                                <span className="text-[10px] text-slate-300 mt-1">
                                                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={chatEndRef} />
                        </CardContent>
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <Input
                                    placeholder="Type a message..."
                                    className="rounded-full bg-slate-50 dark:bg-slate-800 border-none shadow-inner"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <Button type="submit" size="icon" className="rounded-full bg-[hsl(var(--teal))] h-10 w-10 shrink-0">
                                    <Send className="h-4 w-4 text-white" />
                                </Button>
                            </form>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TeamDetailsPage;
