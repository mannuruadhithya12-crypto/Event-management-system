import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Clock,
    Users,
    MapPin,
    Trophy,
    Calendar,
    CheckCircle2,
    Monitor,
    Share2,
    Flag,
    AlertCircle,
    ChevronDown,
    ArrowRight,
    X,
    FileText,
    UploadCloud,
    Trash2,
    Zap,
    LifeBuoy,
    Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';
import { hackathonApi, submissionApi } from '@/lib/api';
import { useAuthStore } from '@/store';

interface FileSubmission {
    fileName: string;
    date: string;
    status: string;
}

interface HackathonDetail {
    id: string;
    title: string;
    description: string;
    collegeName: string;
    mode: string;
    startDate: string;
    endDate: string;
    teamSize: string;
    prizePool: string;
    bannerImage: string;
    logo: string;
    rules: string[];
    timeline: { time: string; event: string }[];
    team: {
        name: string;
        members: { id: string; name: string; role: string; avatar: string }[];
    };
    submission: FileSubmission | null;
}

// MOCK DATA
const MOCK_HACKATHON: HackathonDetail = {
    id: 'h1',
    title: 'InnovateX 2024',
    description: 'InnovateX is the premier hackathon for building the future of educational technology. Join us for 48 hours of intense coding, mentoring, and innovation. We are looking for solutions that can revolutionize how students learn and teachers teach.',
    collegeName: 'MIT Institute of Technology',
    mode: 'Offline',
    startDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    teamSize: '2-4',
    prizePool: '$5,000',
    bannerImage: 'https://images.unsplash.com/photo-1504384308090-c54be3855833',
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=InnovateX',
    rules: [
        'All code must be written during the hackathon.',
        'Teams must consist of 2-4 members.',
        'Use of open-source libraries is allowed.'
    ],
    timeline: [
        { time: 'Day 1 - 10:00 AM', event: 'Opening Ceremony' },
        { time: 'Day 1 - 12:00 PM', event: 'Hacking Begins' },
        { time: 'Day 2 - 12:00 PM', event: 'Submission Deadline' },
        { time: 'Day 2 - 4:00 PM', event: 'Winner Announcement' }
    ],
    team: {
        name: 'Code Wizards',
        members: [
            { id: 'u1', name: 'You', role: 'Leader', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You' },
            { id: 'u2', name: 'Alex M.', role: 'Frontend', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
            { id: 'u3', name: 'Sam K.', role: 'Backend', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam' }
        ]
    },
    submission: null // No submission yet
};

const HackathonDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [hackathon, setHackathon] = useState<HackathonDetail>(MOCK_HACKATHON);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Fetch logic here
    }, [id]);

    const handleLeaveHackathon = () => {
        if (confirm("Are you sure you want to withdraw from this hackathon? This action cannot be undone.")) {
            toast.success("Successfully withdrew from hackathon");
            navigate('/dashboard/student/my-hackathons');
        }
    };

    const handleFileUpload = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.zip,.pdf';
        fileInput.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
                setIsSubmitting(true);
                setTimeout(() => {
                    setHackathon(prev => ({
                        ...prev,
                        submission: {
                            fileName: file.name,
                            date: new Date().toISOString(),
                            status: 'Submitted'
                        }
                    }));
                    setIsSubmitting(false);
                    toast.success("Project submitted successfully!");
                }, 1500);
            }
        };
        fileInput.click();
    };

    return (
        <div className="pb-20 space-y-8 max-w-7xl mx-auto px-4">
            {/* Dynamic Breadcrumbs */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-sm text-slate-500 font-medium"
            >
                <button onClick={() => navigate('/dashboard/student/my-hackathons')} className="hover:text-[hsl(var(--teal))] transition-colors">My Hackathons</button>
                <X className="h-3 w-3 rotate-45" />
                <span className="text-slate-900 dark:text-white font-bold">{hackathon.title}</span>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Content - Main Details */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Premium Hero Section */}
                    <div className="relative h-[400px] w-full rounded-[3rem] overflow-hidden shadow-2xl group">
                        <img src={hackathon.bannerImage} alt={hackathon.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                        <div className="absolute top-8 left-8 flex gap-3">
                            <Badge className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-2 rounded-2xl text-xs font-black tracking-widest uppercase">
                                {hackathon.mode}
                            </Badge>
                            <Badge className="bg-[hsl(var(--teal))] text-white px-4 py-2 rounded-2xl text-xs font-black tracking-widest uppercase border-0">
                                LIVE SPRINT
                            </Badge>
                        </div>

                        <div className="absolute bottom-10 left-10 right-10">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-4"
                            >
                                <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter">
                                    {hackathon.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-slate-200">
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                                        <MapPin className="h-4 w-4 text-[hsl(var(--teal))]" />
                                        <span className="text-sm font-bold">{hackathon.collegeName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                                        <Users className="h-4 w-4 text-[hsl(var(--teal))]" />
                                        <span className="text-sm font-bold">{hackathon.teamSize} Slots</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Glassmorphism Tabs */}
                    <Tabs defaultValue="overview" className="space-y-8">
                        <TabsList className="bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-[2rem] border border-slate-200 dark:border-slate-800 w-full justify-start h-auto flex flex-wrap gap-2">
                            {['Overview', 'Timeline', 'Rules', 'Team', 'Submission'].map(tab => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab.toLowerCase()}
                                    className="rounded-2xl px-8 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-[hsl(var(--teal))] data-[state=active]:shadow-lg transition-all duration-300 font-black text-xs uppercase tracking-widest"
                                >
                                    {tab}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value="overview" className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 space-y-6">
                                    <div className="h-14 w-14 bg-[hsl(var(--teal))]/10 rounded-2xl flex items-center justify-center">
                                        <Zap className="h-8 w-8 text-[hsl(var(--teal))]" />
                                    </div>
                                    <h3 className="text-2xl font-black">The Vision</h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                        {hackathon.description}
                                    </p>
                                </Card>

                                <div className="space-y-8">
                                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Grand Prize Pool</p>
                                        <p className="text-4xl font-black">{hackathon.prizePool}</p>
                                        <div className="mt-6 flex items-center gap-2">
                                            <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center uppercase font-black text-sm">
                                                S
                                            </div>
                                            <p className="text-xs font-bold opacity-80">Sponsored by TechFlow Systems</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                                            <div className="flex items-center gap-2 text-green-600 font-black">
                                                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                                                ACTIVE
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Verified</p>
                                            <div className="flex items-center gap-2 text-blue-600 font-black">
                                                <CheckCircle2 className="h-4 w-4" />
                                                YES
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="timeline">
                            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-10">
                                <div className="space-y-12 relative border-l-4 border-slate-100 dark:border-slate-800 ml-4 pl-12 py-4">
                                    {hackathon.timeline.map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="relative"
                                        >
                                            <div className="absolute -left-[62px] top-0 h-10 w-10 rounded-full border-8 border-white dark:border-slate-900 bg-[hsl(var(--teal))] shadow-lg flex items-center justify-center">
                                                <Clock className="h-4 w-4 text-white" />
                                            </div>
                                            <p className="text-sm font-black text-[hsl(var(--teal))] uppercase tracking-widest mb-1">{item.time}</p>
                                            <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase">{item.event}</h4>
                                            <p className="text-slate-500 font-medium">Main Hall & Discord Voice Channels</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="rules">
                            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-10">
                                <div className="grid gap-6">
                                    {hackathon.rules.map((rule, i) => (
                                        <div key={i} className="flex gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 group hover:border-[hsl(var(--teal))]/30 transition-all duration-300">
                                            <div className="h-10 w-10 flex-shrink-0 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center font-black text-slate-400 shadow-sm border border-slate-100 dark:border-slate-600">
                                                {i + 1}
                                            </div>
                                            <p className="text-lg font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{rule}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="team">
                            <div className="grid gap-8">
                                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-10">
                                    <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-900 dark:bg-slate-800 p-8 rounded-[2rem] gap-6 mb-10">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[hsl(var(--teal))] mb-1">Squad Name</p>
                                            <h3 className="text-3xl font-black text-white">{hackathon.team.name}</h3>
                                        </div>
                                        <Button variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10 px-8 h-12 font-black" onClick={handleLeaveHackathon}>
                                            WITHDRAW SQUAD
                                        </Button>
                                    </div>

                                    <div className="grid gap-4">
                                        {hackathon.team.members.map(member => (
                                            <div key={member.id} className="group relative">
                                                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/30 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="h-14 w-14 rounded-2xl ring-2 ring-white dark:ring-slate-700">
                                                            <AvatarImage src={member.avatar} />
                                                            <AvatarFallback>U</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-black text-slate-900 dark:text-white">{member.name}</p>
                                                            <p className="text-xs font-bold text-[hsl(var(--teal))] uppercase tracking-widest">{member.role}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="submission">
                            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-10 text-center">
                                {!hackathon.submission ? (
                                    <div
                                        className="border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] p-16 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all duration-500 group"
                                        onClick={handleFileUpload}
                                    >
                                        <div className="h-24 w-24 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-8 shadow-xl border border-slate-100 dark:border-slate-700 group-hover:scale-110 group-hover:rotate-6 transition-all">
                                            <UploadCloud className="h-12 w-12 text-[hsl(var(--teal))]" />
                                        </div>
                                        <h3 className="text-2xl font-black mb-2">Deploy Your Assets</h3>
                                        <p className="text-slate-500 font-medium max-w-sm mb-8">
                                            Upload your production-ready build (ZIP/PDF). Ensure documentation is included.
                                        </p>
                                        <Button className="rounded-2xl px-12 h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black hover:bg-[hsl(var(--teal))] dark:hover:bg-[hsl(var(--teal))]">
                                            SELECT FILES
                                        </Button>
                                        {isSubmitting && <Progress value={45} className="w-full mt-10 h-3 rounded-full" />}
                                    </div>
                                ) : (
                                    <div className="bg-emerald-50 dark:bg-emerald-950/10 border-2 border-emerald-100 dark:border-emerald-900/20 rounded-[3rem] p-12 space-y-8 animate-in zoom-in-95 duration-500">
                                        <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                                            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black text-emerald-900 dark:text-emerald-400">Mission Accomplished</h3>
                                            <p className="text-emerald-700 dark:text-emerald-600 font-bold mt-2">
                                                Your submission is logged and verified.
                                            </p>
                                        </div>
                                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <FileText className="h-6 w-6 text-slate-400" />
                                                <div className="text-left">
                                                    <p className="font-black text-slate-900 dark:text-white line-clamp-1">{hackathon.submission.fileName}</p>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{format(new Date(hackathon.submission.date), 'MMM d, h:mm a')}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" className="text-red-500 hover:bg-red-50 rounded-xl font-black" onClick={() => setHackathon({ ...hackathon, submission: null })}>
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Sidebar - High Impact Actions */}
                <div className="space-y-8">
                    <Card className="bg-slate-900 dark:bg-slate-900 border-none shadow-2xl relative overflow-hidden rounded-[2.5rem] p-8">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[hsl(var(--teal))]/10 rounded-full -mr-24 -mt-24 blur-3xl opacity-50" />

                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[hsl(var(--teal))] mb-6">Live Countdown</p>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 text-center border border-white/10">
                                <p className="text-4xl font-black text-white">04</p>
                                <p className="text-[10px] font-black uppercase text-slate-500 mt-1">Days</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 text-center border border-white/10">
                                <p className="text-4xl font-black text-white">18</p>
                                <p className="text-[10px] font-black uppercase text-slate-500 mt-1">Hours</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold border-b border-white/5 pb-4">
                                <span className="text-slate-400">Launch</span>
                                <span className="text-white">{format(new Date(hackathon.startDate), 'MMM dd')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-slate-400">Deadline</span>
                                <span className="text-white">{format(new Date(hackathon.endDate), 'MMM dd')}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-[2.5rem] border-none shadow-xl p-8 space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Active Resources</h4>
                        <div className="grid gap-3">
                            <Button variant="outline" className="h-16 rounded-2xl justify-between px-6 border-slate-100 dark:border-slate-800 hover:border-[hsl(var(--teal))] transition-all group font-black uppercase text-[10px] tracking-wider">
                                <div className="flex items-center gap-3">
                                    <Layers className="h-5 w-5 text-indigo-500" />
                                    Problem Space
                                </div>
                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                            </Button>
                            <Button variant="outline" className="h-16 rounded-2xl justify-between px-6 border-slate-100 dark:border-slate-800 hover:border-[hsl(var(--teal))] transition-all group font-black uppercase text-[10px] tracking-wider">
                                <div className="flex items-center gap-3">
                                    <LifeBuoy className="h-5 w-5 text-rose-500" />
                                    Support Desk
                                </div>
                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                            </Button>
                        </div>
                    </Card>

                    <Button
                        variant="ghost"
                        className="w-full text-slate-500 hover:text-red-500 font-black text-xs uppercase tracking-widest"
                        onClick={handleLeaveHackathon}
                    >
                        Discontinue Participation
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HackathonDetailPage;
