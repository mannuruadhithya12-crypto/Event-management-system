import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Calendar,
    MapPin,
    Trophy,
    MessageSquare,
    Files,
    ChevronLeft,
    Clock,
    MoreVertical,
    ThumbsUp,
    MessageCircle,
    Download,
    FileText,
    Video,
    Award,
    Plus,
    X,
    UserPlus,
    LogOut,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { useAuthStore } from '@/store';

// --- MOCK DATA ---
const MOCK_CLUB_DETAILS = {
    id: '1',
    name: 'AI & Robotics Club',
    description: 'The AI & Robotics Club is the premier student organization dedicated to exploring Artificial Intelligence, Machine Learning, and Robotics. We host weekly workshops, hackathons, and guest lectures from industry experts to bridge the gap between theory and practice.',
    collegeName: 'Engineering & Technology',
    category: 'Technology',
    bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89f55137256b',
    logoUrl: 'https://images.unsplash.com/photo-1546776310-a51d3dd0e8d5?w=400&h=400&fit=crop',
    createdAt: '2023-08-15',
    facultyAdvisorName: 'Prof. Anderson',
    presidentName: 'Sarah Jenkins',
    presidentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    membersCount: 128,
    eventsCount: 12,
    hackathonsCount: 3,
    isJoined: true,
    userRole: 'Core Member'
};

const MOCK_EVENTS = [
    {
        id: 'e1',
        title: 'Intro to Neural Networks',
        date: new Date(Date.now() + 86400000 * 2).toISOString(),
        location: 'Hall A, Engineering Block',
        description: 'A beginner-friendly workshop on the fundamentals of Neural Networks.',
        registered: true,
        capacity: 50,
        enrolled: 42,
        status: 'UPCOMING'
    },
    {
        id: 'e2',
        title: 'Robotics Build-a-thon',
        date: new Date(Date.now() + 86400000 * 10).toISOString(),
        location: 'Robotics Lab',
        description: '24-hour hardware hackathon to build autonomous bots.',
        registered: false,
        capacity: 30,
        enrolled: 15,
        status: 'UPCOMING'
    },
    {
        id: 'e3',
        title: 'AI Ethics Seminar',
        date: new Date(Date.now() - 86400000 * 5).toISOString(),
        location: 'Auditorium',
        description: 'Discussion on the ethical implications of AGI.',
        registered: true,
        capacity: 100,
        enrolled: 89,
        status: 'PAST'
    }
];

const MOCK_HACKATHONS = [
    {
        id: 'h1',
        title: 'NeuralHack 2024',
        date: new Date(Date.now() + 86400000 * 20).toISOString(),
        prizePool: '$5,000',
        teamSize: '2-4',
        status: 'OPEN',
        registered: false
    },
    {
        id: 'h2',
        title: 'RoboWars V',
        date: new Date(Date.now() + 86400000 * 45).toISOString(),
        prizePool: '$10,000',
        teamSize: '3-5',
        status: 'OPEN',
        registered: true,
        teamName: 'Circuit Breakers',
        teamMembers: [
            { id: 'u1', name: 'You', role: 'Leader', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You' },
            { id: 'u2', name: 'Alex M.', role: 'Frontend', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
            { id: 'u3', name: 'Sam K.', role: 'Backend', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam' }
        ]
    }
];

const MOCK_DISCUSSIONS = [
    {
        id: 'd1',
        author: 'Mike Ross',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        title: 'Resources for Computer Vision?',
        content: 'Hey everyone, I am looking for good resources to start with OpenCV. Any recommendations?',
        likes: 12,
        comments: [
            { id: 'c1', author: 'Sarah Jenkins', content: 'Check out the official docs, they are great!' }
        ],
        timestamp: '2 hours ago'
    },
    {
        id: 'd2',
        author: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        title: 'Team for NeuralHack',
        content: 'Looking for a backend dev for our NeuralHack team. DM if interested.',
        likes: 5,
        comments: [],
        timestamp: '5 hours ago'
    }
];

const MOCK_RESOURCES = [
    { id: 'r1', title: 'Workshop Slides: Neural Nets', type: 'PDF', size: '2.4 MB', date: '2 days ago' },
    { id: 'r2', title: 'Dataset: Housing Prices', type: 'CSV', size: '15 MB', date: '1 week ago' },
    { id: 'r3', title: 'Recording: Guest Lecture', type: 'Video', size: '450 MB', date: '2 weeks ago' },
];

const ANALYTICS_DATA = {
    attendance: [
        { month: 'Jan', value: 80 }, { month: 'Feb', value: 100 },
        { month: 'Mar', value: 60 }, { month: 'Apr', value: 90 },
        { month: 'May', value: 85 }
    ],
    participation: [
        { name: 'Workshops', value: 45 },
        { name: 'Hackathons', value: 30 },
        { name: 'Seminars', value: 25 },
    ]
};

const MOCK_STUDENTS = [
    { id: 's1', name: 'Emily Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
    { id: 's2', name: 'David Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
    { id: 's3', name: 'Marcus Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' }
];

// --- SUB-COMPONENTS ---

const OverviewTab = ({ club }: { club: any }) => (
    <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>About Us</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {club.description}
                    </p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30">
                    <CardContent className="p-6 flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-indigo-200">
                            <AvatarImage src={club.presidentAvatar} />
                            <AvatarFallback>PR</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-xs font-bold text-indigo-500 uppercase">President</p>
                            <p className="font-bold text-slate-900 dark:text-slate-100">{club.presidentName}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-teal-50 dark:bg-teal-900/10 border-teal-100 dark:border-teal-900/30">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-teal-500 uppercase">Faculty Advisor</p>
                            <p className="font-bold text-slate-900 dark:text-slate-100">{club.facultyAdvisorName}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm uppercase text-slate-500">Club Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-sm"><Users className="h-4 w-4" /> Members</span>
                        <span className="font-bold">{club.membersCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4" /> Events</span>
                        <span className="font-bold">{club.eventsCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-sm"><Trophy className="h-4 w-4" /> Hackathons</span>
                        <span className="font-bold">{club.hackathonsCount}</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[hsl(var(--navy))] to-slate-900 text-white border-none">
                <CardContent className="p-6 text-center">
                    <Award className="h-12 w-12 mx-auto mb-2 text-yellow-400" />
                    <h3 className="text-lg font-bold mb-1">Your Status</h3>
                    <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                        {club.userRole}
                    </Badge>
                    <p className="text-xs text-white/60 mt-4">Member since Aug 2024</p>
                </CardContent>
            </Card>
        </div>
    </div>
);

const EventsTab = () => {
    const [events, setEvents] = useState(MOCK_EVENTS);

    const toggleRegister = (id: string) => {
        setEvents(prev => prev.map(e => {
            if (e.id === id) {
                const newStatus = !e.registered;
                toast.success(newStatus ? "Registered successfully!" : "Unregistered successfully");
                return {
                    ...e,
                    registered: newStatus,
                    enrolled: newStatus ? e.enrolled + 1 : e.enrolled - 1
                };
            }
            return e;
        }));
    };

    return (
        <div className="space-y-6">
            {events.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        <div className="bg-slate-100 dark:bg-slate-800 p-6 flex flex-col items-center justify-center min-w-[140px] border-r border-slate-200 dark:border-slate-700">
                            <span className="text-sm font-bold text-red-500 uppercase">{format(new Date(event.date), 'MMMM')}</span>
                            <span className="text-4xl font-extrabold my-1">{format(new Date(event.date), 'dd')}</span>
                            <span className="text-xs text-slate-500">{format(new Date(event.date), 'EEEE')}</span>
                        </div>
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold">{event.title}</h3>
                                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-2">
                                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {format(new Date(event.date), 'h:mm a')}</span>
                                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {event.location}</span>
                                    </div>
                                </div>
                                {event.status === 'UPCOMING' && (
                                    <Badge className={`${event.registered ? 'bg-green-500' : 'bg-slate-900'}`}>
                                        {event.registered ? 'Registered' : 'Open'}
                                    </Badge>
                                )}
                            </div>
                            <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm">{event.description}</p>

                            <div className="mt-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                        <span>Capacity</span>
                                        <span>{event.enrolled}/{event.capacity}</span>
                                    </div>
                                    <Progress value={(event.enrolled / event.capacity) * 100} className="w-32 h-2" />
                                </div>
                                {event.status === 'UPCOMING' && (
                                    <Button
                                        variant={event.registered ? "outline" : "default"}
                                        className={event.registered ? "border-red-200 text-red-500 hover:bg-red-50" : "bg-[hsl(var(--navy)) text-white"}
                                        onClick={() => toggleRegister(event.id)}
                                    >
                                        {event.registered ? 'Unregister' : 'Register Now'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

const HackathonsTab = () => {
    const [hackathons, setHackathons] = useState(MOCK_HACKATHONS);
    const [selectedHackathon, setSelectedHackathon] = useState<any | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isManageOpen, setIsManageOpen] = useState(false);

    // Form State
    const [teamName, setTeamName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const handleCreateTeam = () => {
        if (!teamName) return;

        // Mock team creation
        const updated = hackathons.map(h => {
            if (h.id === selectedHackathon.id) {
                return {
                    ...h,
                    registered: true,
                    teamName: teamName,
                    teamMembers: [
                        { id: 'u1', name: 'You', role: 'Leader', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You' },
                        ...selectedMembers.map(id => {
                            const user = MOCK_STUDENTS.find(s => s.id === id);
                            return { id: user?.id || id, name: user?.name || 'Unknown', role: 'Member', avatar: user?.avatar || '' };
                        })
                    ]
                } as any;
            }
            return h;
        });

        setHackathons(updated);
        setIsCreateOpen(false);
        setTeamName('');
        setSelectedMembers([]);
        toast.success("Team registered successfully!");
    };

    const handleLeaveTeam = () => {
        const updated = hackathons.map(h => {
            if (h.id === selectedHackathon.id) {
                return { ...h, registered: false, teamName: undefined, teamMembers: undefined };
            }
            return h;
        });
        setHackathons(updated);
        setIsManageOpen(false);
        toast.info("You have left the team.");
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {hackathons.map((hackathon) => (
                <Card key={hackathon.id} className="group hover:border-[hsl(var(--teal))] transition-all">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <Badge variant="outline" className="mb-2">{hackathon.status}</Badge>
                            <Trophy className="h-5 w-5 text-yellow-500" />
                        </div>
                        <CardTitle>{hackathon.title}</CardTitle>
                        <CardDescription>Prize Pool: {hackathon.prizePool}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Team Size</span>
                            <span className="font-bold">{hackathon.teamSize} members</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Date</span>
                            <span className="font-bold">{format(new Date(hackathon.date), 'MMM d, yyyy')}</span>
                        </div>

                        {hackathon.registered ? (
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-900/30">
                                <p className="text-xs text-green-700 dark:text-green-400 font-bold mb-1">Registered Team</p>
                                <p className="font-bold text-sm">{hackathon.teamName}</p>
                            </div>
                        ) : (
                            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-center text-sm text-slate-500">
                                Registration Open
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        {hackathon.registered ? (
                            <Button className="w-full" variant="outline" onClick={() => {
                                setSelectedHackathon(hackathon);
                                setIsManageOpen(true);
                            }}>
                                Manage Team
                            </Button>
                        ) : (
                            <Button className="w-full bg-[hsl(var(--navy))]" onClick={() => {
                                setSelectedHackathon(hackathon);
                                setIsCreateOpen(true);
                            }}>
                                Register Team
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            ))}

            {/* Create Team Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Register for {selectedHackathon?.title}</DialogTitle>
                        <DialogDescription>Create a team to participate.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Team Name</label>
                            <Input placeholder="e.g. Code Wizards" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Invite Members (Optional)</label>
                            <div className="space-y-2">
                                {MOCK_STUDENTS.map(student => (
                                    <div key={student.id}
                                        className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-colors ${selectedMembers.includes(student.id) ? 'border-[hsl(var(--teal))] bg-[hsl(var(--teal))]/5' : 'border-slate-200 dark:border-slate-800'}`}
                                        onClick={() => {
                                            if (selectedMembers.includes(student.id)) {
                                                setSelectedMembers(selectedMembers.filter(id => id !== student.id));
                                            } else {
                                                setSelectedMembers([...selectedMembers, student.id]);
                                            }
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={student.avatar} />
                                            </Avatar>
                                            <span className="text-sm font-medium">{student.name}</span>
                                        </div>
                                        {selectedMembers.includes(student.id) && <Check className="h-4 w-4 text-[hsl(var(--teal))]" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateTeam} disabled={!teamName}>Create Team</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Manage Team Dialog */}
            <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Team: {selectedHackathon?.teamName}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-500">Team Members</label>
                            <div className="space-y-2">
                                {selectedHackathon?.teamMembers?.map((member: any) => (
                                    <div key={member.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={member.avatar} />
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{member.name}</p>
                                                <p className="text-xs text-slate-500">{member.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={handleLeaveTeam}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Leave Team
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const DiscussionsTab = () => {
    const [posts, setPosts] = useState(MOCK_DISCUSSIONS);
    const [newPost, setNewPost] = useState('');

    const handlePost = () => {
        if (!newPost.trim()) return;
        const post = {
            id: Date.now().toString(),
            author: 'You',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
            title: 'New Discussion',
            content: newPost,
            likes: 0,
            comments: [],
            timestamp: 'Just now'
        };
        setPosts([post, ...posts]);
        setNewPost('');
        toast.success("Discussion started!");
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <Card>
                <CardContent className="p-4 space-y-4">
                    <Textarea
                        placeholder="Start a discussion..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="min-h-[100px] resize-none border-slate-200 dark:border-slate-800"
                    />
                    <div className="flex justify-end">
                        <Button onClick={handlePost} disabled={!newPost.trim()} className="bg-[hsl(var(--teal))] text-white hover:bg-[hsl(var(--teal))]/90">
                            Post Discussion
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <AnimatePresence>
                    {posts.map((post) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            layout
                        >
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={post.avatar} />
                                                <AvatarFallback>{post.author[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-sm">{post.author}</p>
                                                <p className="text-xs text-slate-500">{post.timestamp}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                    </div>
                                    <h3 className="font-bold mt-4 mb-2">{post.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">{post.content}</p>

                                    <div className="flex gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <Button variant="ghost" size="sm" className="gap-2 text-slate-500">
                                            <ThumbsUp className="h-4 w-4" /> {post.likes}
                                        </Button>
                                        <Button variant="ghost" size="sm" className="gap-2 text-slate-500">
                                            <MessageCircle className="h-4 w-4" /> {post.comments.length} Comments
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

const ResourcesTab = () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_RESOURCES.map((res) => (
            <Card key={res.id} className="group hover:border-[hsl(var(--teal))] transition-all cursor-pointer">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${res.type === 'PDF' ? 'bg-red-100 text-red-600' :
                            res.type === 'Video' ? 'bg-blue-100 text-blue-600' :
                                'bg-green-100 text-green-600'
                            }`}>
                            {res.type === 'PDF' ? <FileText className="h-5 w-5" /> :
                                res.type === 'Video' ? <Video className="h-5 w-5" /> :
                                    <Files className="h-5 w-5" />}
                        </div>
                        <Badge variant="outline">{res.type}</Badge>
                    </div>
                    <h3 className="font-bold line-clamp-1 mb-1">{res.title}</h3>
                    <p className="text-xs text-slate-500 mb-6">{res.size} • Uploaded {res.date}</p>
                    <div className="space-y-2">
                        <Progress value={0} className="h-1 bg-slate-100 hidden group-hover:block transition-all" />
                        <Button variant="outline" className="w-full gap-2 group-hover:bg-[hsl(var(--teal))] group-hover:text-white transition-colors">
                            <Download className="h-4 w-4" /> Download
                        </Button>
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

const AnalyticsTab = () => (
    <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Event Attendance</CardTitle>
                    <CardDescription>Your participation over the last semester</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ANALYTICS_DATA.attendance}>
                            <defs>
                                <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--teal))" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="hsl(var(--teal))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" dataKey="value" stroke="hsl(var(--teal))" fillOpacity={1} fill="url(#colorAtt)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Activity Breakdown</CardTitle>
                    <CardDescription>Where you spend most of your time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={ANALYTICS_DATA.participation}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {ANALYTICS_DATA.participation.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#0ea5e9', '#f59e0b', '#10b981'][index % 3]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-4">
                        {ANALYTICS_DATA.participation.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#0ea5e9', '#f59e0b', '#10b981'][index % 3] }} />
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
);

const CalendarTab = () => {
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Club Schedule</CardTitle>
                <CardDescription>Upcoming events and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 text-center text-sm font-bold text-slate-500 mb-4">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 30 }).map((_, i) => {
                        const isEvent = [5, 12, 18, 25].includes(i);
                        return (
                            <Dialog key={i}>
                                <DialogTrigger asChild>
                                    <div
                                        className={`h-12 rounded-xl flex items-center justify-center text-sm relative font-medium transition-all cursor-pointer hover:shadow-md ${isEvent
                                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-900'
                                            : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
                                            }`}
                                        onClick={() => isEvent && setSelectedDate(i + 1)}
                                    >
                                        {i + 1}
                                        {isEvent && <div className="absolute bottom-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
                                    </div>
                                </DialogTrigger>
                                {isEvent && (
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Event Details — Day {i + 1}</DialogTitle>
                                        </DialogHeader>
                                        <div className="py-4">
                                            {/* Mock finding event */}
                                            <div className="border border-indigo-100 bg-indigo-50/50 p-4 rounded-xl dark:border-indigo-900 dark:bg-indigo-900/20">
                                                <Badge className="mb-2">Workshop</Badge>
                                                <h3 className="font-bold text-lg mb-1">Intro to Neural Networks</h3>
                                                <p className="text-sm text-slate-500 mb-3">5:00 PM • Hall A</p>
                                                <p className="text-sm">Join us for a deep dive into the architecture of neural networks.</p>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button className="w-full">View Event Page</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                )}
                            </Dialog>
                        )
                    })}
                </div>
                <div className="mt-8 space-y-4">
                    <h4 className="font-bold text-sm text-slate-500 uppercase tracking-wider">Upcoming Agenda</h4>
                    {MOCK_EVENTS.map(e => (
                        <div key={e.id} className="flex gap-4 items-center group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-xl transition-colors">
                            <div className="h-12 w-12 bg-white border border-slate-200 text-[hsl(var(--navy))] rounded-xl flex flex-col items-center justify-center shadow-sm dark:bg-slate-900 dark:border-slate-700">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{format(new Date(e.date), 'MMM')}</span>
                                <span className="text-xl font-bold leading-none">{format(new Date(e.date), 'dd')}</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-sm group-hover:text-[hsl(var(--teal))] transition-colors">{e.title}</p>
                                <p className="text-xs text-slate-500">{format(new Date(e.date), 'h:mm a')} • {e.location}</p>
                            </div>
                            <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100">
                                <ChevronLeft className="h-4 w-4 rotate-180" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

// --- MAIN PAGE COMPONENT ---

const ClubDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const activeTab = useLocation().pathname.split('/').pop();
    const currentTab = (!activeTab || activeTab === id) ? 'overview' : activeTab;
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [club, setClub] = useState(MOCK_CLUB_DETAILS);

    return (
        <div className="space-y-6 pb-20 max-w-7xl mx-auto">
            {/* Header Navigation */}
            <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" className="pl-0 hover:bg-transparent text-slate-500 hover:text-[hsl(var(--navy))]" onClick={() => navigate('/dashboard/student/clubs')}>
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Back to Clubs
                </Button>
            </div>

            {/* Club Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-xl overflow-hidden"
            >
                <div className="h-64 w-full relative">
                    <img src={club.bannerUrl} alt={club.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy))]/90 via-transparent to-transparent" />
                </div>

                <div className="px-10 pb-10 relative">
                    <div className="flex flex-col md:flex-row items-end -mt-16 gap-8">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="h-32 w-32 rounded-3xl border-4 border-white dark:border-slate-900 bg-white shadow-2xl overflow-hidden flex-shrink-0"
                        >
                            <img src={club.logoUrl} alt="logo" className="h-full w-full object-cover" />
                        </motion.div>

                        <div className="flex-1 text-slate-900 dark:text-white mb-2">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-extrabold tracking-tight">{club.name}</h1>
                                <Badge className="bg-[hsl(var(--teal))] text-white border-0">Verified</Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium">
                                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {club.collegeName}</span>
                                <span className="hidden md:inline">•</span>
                                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {club.membersCount} Members</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button size="lg" className="bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/90 text-white font-bold rounded-xl shadow-lg shadow-[hsl(var(--teal))]/20">
                                Contact President
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Tabs Navigation */}
            <Tabs
                value={currentTab}
                onValueChange={(val) => navigate(`/dashboard/student/clubs/${id}/${val === 'overview' ? '' : val}`)}
                className="space-y-8"
            >
                <div className="sticky top-0 z-20 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-lg py-2 border-b border-slate-200 dark:border-slate-800 -mx-4 px-4 sm:mx-0 sm:px-0">
                    <TabsList className="bg-transparent h-auto p-0 gap-6 w-full justify-start overflow-x-auto no-scrollbar">
                        {['Overview', 'Events', 'Hackathons', 'Discussions', 'Resources', 'Calendar', 'Analytics'].map((tab) => (
                            <TabsTrigger
                                key={tab}
                                value={tab.toLowerCase()}
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[hsl(var(--teal))] data-[state=active]:text-[hsl(var(--teal))] bg-transparent shadow-none font-bold text-base px-1 pb-3 transition-all hover:text-[hsl(var(--teal))]/70"
                            >
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
                            <OverviewTab club={club} />
                        </TabsContent>
                        <TabsContent value="events" className="mt-0 focus-visible:outline-none">
                            <EventsTab />
                        </TabsContent>
                        <TabsContent value="hackathons" className="mt-0 focus-visible:outline-none">
                            <HackathonsTab />
                        </TabsContent>
                        <TabsContent value="discussions" className="mt-0 focus-visible:outline-none">
                            <DiscussionsTab />
                        </TabsContent>
                        <TabsContent value="resources" className="mt-0 focus-visible:outline-none">
                            <ResourcesTab />
                        </TabsContent>
                        <TabsContent value="calendar" className="mt-0 focus-visible:outline-none">
                            <CalendarTab />
                        </TabsContent>
                        <TabsContent value="analytics" className="mt-0 focus-visible:outline-none">
                            <AnalyticsTab />
                        </TabsContent>
                    </motion.div>
                </AnimatePresence>
            </Tabs>
        </div>
    );
};

export default ClubDetailPage;
