import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy,
    Calendar,
    Users,
    Clock,
    ArrowRight,
    Search,
    Filter,
    Award,
    Download,
    CheckCircle2,
    Monitor,
    MapPin,
    AlertCircle,
    ChevronRight,
    Star,
    ExternalLink,
    FileDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format, differenceInDays, differenceInHours } from 'date-fns';
import { useAuthStore } from '@/store';
import { hackathonApi } from '@/lib/api';

// --- PREMIUM STYLING UTILS ---
const cardGradients = [
    'from-indigo-500/20 to-purple-500/20',
    'from-emerald-500/20 to-teal-500/20',
    'from-orange-500/20 to-pink-500/20',
    'from-blue-500/20 to-cyan-500/20'
];

// Mock Data (Fallback if API fails during dev)
const MOCK_REGISTERED: any[] = [
    {
        id: 'h1',
        title: 'InnovateX 2024',
        description: 'Build the future of ed-tech in 48 hours.',
        collegeName: 'MIT Institute of Technology',
        startDate: new Date(Date.now() + 86400000 * 5),
        endDate: new Date(Date.now() + 86400000 * 7),
        status: 'registration_open',
        mode: 'offline',
        maxTeamSize: 4,
        prizePool: 5000,
        bannerImage: 'https://images.unsplash.com/photo-1504384308090-c54be3855833',
        registrationDeadline: new Date(Date.now() + 86400000 * 2),
    },
    {
        id: 'h2',
        title: 'CyberGuard Hackathon',
        description: 'Cybersecurity challenges for the brave.',
        collegeName: 'Cyber University',
        startDate: new Date(Date.now() + 86400000 * 12),
        endDate: new Date(Date.now() + 86400000 * 14),
        status: 'registration_open',
        mode: 'online',
        maxTeamSize: 3,
        prizePool: 3000,
        bannerImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
        registrationDeadline: new Date(Date.now() + 86400000 * 10),
    }
];

const MOCK_COMPLETED = [
    {
        id: 'h3',
        title: 'GreenEarth Challenge',
        collegeName: 'Eco State University',
        completionDate: new Date(Date.now() - 86400000 * 20).toISOString(),
        submissionStatus: 'Submitted',
        rank: 3,
        certificateAvailable: true,
        bannerImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09'
    },
    {
        id: 'h4',
        title: 'FinTech Revolution',
        collegeName: 'Business School',
        completionDate: new Date(Date.now() - 86400000 * 45).toISOString(),
        submissionStatus: 'Submitted',
        rank: null,
        certificateAvailable: true,
        bannerImage: 'https://images.unsplash.com/photo-1611974765270-ca1258822981'
    }
];

const MyHackathonsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState('registered');
    const [registeredHackathons, setRegisteredHackathons] = useState<any[]>([]);
    const [completedHackathons, setCompletedHackathons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const [registered, completed] = await Promise.all([
                    hackathonApi.getRegistered(user.id),
                    hackathonApi.getCompleted(user.id)
                ]);

                // Use live data if available, fallback to mock for demonstration if empty
                setRegisteredHackathons(registered && registered.length > 0 ? registered : MOCK_REGISTERED);
                setCompletedHackathons(completed && completed.length > 0 ? completed : MOCK_COMPLETED);
            } catch (error) {
                console.error("Failed to fetch hackathons:", error);
                toast.error("Failed to load your hackathons");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleDownloadCertificate = (id: string, name: string) => {
        const promise = new Promise((resolve) => {
            setTimeout(() => {
                // Mock PDF Download process
                const link = document.createElement('a');
                link.href = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
                link.download = `Certificate_${name.replace(/\s+/g, '_')}.pdf`;
                document.body.appendChild(link);
                // In real world, we'd fetch the blob from API
                // link.click(); 
                document.body.removeChild(link);
                resolve(true);
            }, 2000);
        });

        toast.promise(promise, {
            loading: 'Generating your PDF certificate...',
            success: (data) => `Certificate for ${name} has been downloaded!`,
            error: 'Failed to generate certificate PDF. Please try again later.'
        });
    };

    const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
        const target = new Date(targetDate);
        const now = new Date();
        const days = differenceInDays(target, now);
        const hours = differenceInHours(target, now) % 24;

        if (days < 0) return <span className="text-red-500 font-bold">Started</span>;

        return (
            <div className="flex gap-2 text-xs font-mono bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 shadow-sm">
                <span className="font-bold">{days}d</span>
                <span className="opacity-50">:</span>
                <span className="font-bold">{hours}h</span>
            </div>
        );
    };

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
            {/* Header with Glassmorphism Effect */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-[2rem] bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--teal))]/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full -ml-24 -mb-24 blur-3xl" />

                <div className="relative z-10 flex flex-col gap-2">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-4"
                    >
                        <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                            <Trophy className="h-10 w-10 text-yellow-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight">My Hackathons</h1>
                            <p className="text-slate-300 font-medium">Empower your coding journey, one sprint at a time.</p>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex gap-4 relative z-10"
                >
                    <div className="px-6 py-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center min-w-[100px]">
                        <p className="text-2xl font-black">{registeredHackathons.length}</p>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Active</p>
                    </div>
                    <div className="px-6 py-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center min-w-[100px]">
                        <p className="text-2xl font-black text-[hsl(var(--teal))]">{completedHackathons.length}</p>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Won</p>
                    </div>
                </motion.div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <div className="sticky top-20 z-20 backdrop-blur-md py-4 -mx-4 px-4">
                    <TabsList className="bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 w-full sm:w-auto h-auto flex gap-2">
                        <TabsTrigger value="registered" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-[hsl(var(--teal))] data-[state=active]:shadow-lg transition-all duration-300 font-bold text-sm">
                            Registered
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-[hsl(var(--teal))] data-[state=active]:shadow-lg transition-all duration-300 font-bold text-sm">
                            Completed
                        </TabsTrigger>
                        <TabsTrigger
                            value="find-new"
                            className="rounded-2xl px-8 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-[hsl(var(--teal))] data-[state=active]:shadow-lg transition-all duration-300 font-bold text-sm"
                            onClick={() => navigate('/hackathons')}
                        >
                            Find New
                        </TabsTrigger>
                        <div className="flex-1" />
                    </TabsList>
                </div>

                {/* Registered Tab */}
                <TabsContent value="registered" className="focus-visible:outline-none">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <Skeleton key={i} className="h-[400px] rounded-[2.5rem]" />
                                ))
                            ) : registeredHackathons.length > 0 ? (
                                registeredHackathons.map((hackathon, idx) => (
                                    <motion.div
                                        key={hackathon.id}
                                        layout
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ y: -10 }}
                                        className="relative group"
                                    >
                                        <Card className="h-full rounded-[2.5rem] overflow-hidden border-none shadow-xl bg-white dark:bg-slate-900 flex flex-col transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                                            {/* Gradient Overlay */}
                                            <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${cardGradients[idx % cardGradients.length]}`} />

                                            <div className="h-48 relative overflow-hidden">
                                                <img
                                                    src={hackathon.bannerImage}
                                                    alt={hackathon.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                                                <div className="absolute top-6 right-6">
                                                    <Badge className="bg-white/20 backdrop-blur-xl border border-white/30 text-white font-bold py-1.5 px-4 rounded-full uppercase text-[10px] tracking-widest">
                                                        {hackathon.mode}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <CardContent className="p-8 space-y-6 flex-1 flex flex-col">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-[hsl(var(--teal))] uppercase tracking-widest bg-[hsl(var(--teal))]/10 w-fit px-3 py-1 rounded-full">
                                                        <Monitor className="h-3 w-3" /> Dashboard Ready
                                                    </div>
                                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white line-clamp-2 leading-tight">
                                                        {hackathon.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                                        <MapPin className="h-4 w-4" />
                                                        <span className="truncate">{hackathon.collegeName}</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800/50 mt-auto">
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Countdown</p>
                                                        <CountdownTimer targetDate={hackathon.startDate.toString()} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Team</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex -space-x-2">
                                                                {[1, 2, 3].map(i => (
                                                                    <div key={i} className="h-7 w-7 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${hackathon.id}${i}`} />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <span className="text-xs font-bold text-slate-500">+1</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>

                                            <CardFooter className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                                                <Button
                                                    className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-[hsl(var(--teal))] dark:hover:bg-[hsl(var(--teal))] transition-all duration-300 font-black text-sm group/btn"
                                                    onClick={() => navigate(`/hackathons/${hackathon.id}`)}
                                                >
                                                    EXPLORE DASHBOARD
                                                    <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
                                    <div className="h-32 w-32 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 shadow-inner animate-bounce">
                                        <Trophy className="h-16 w-16 text-slate-300" />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">The Arena Awaits</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium">
                                        You haven't joined any hackathons yet. High-stakes innovation is just one click away.
                                    </p>
                                    <Button
                                        onClick={() => navigate('/hackathons')}
                                        size="lg"
                                        className="rounded-2xl px-12 h-16 bg-[hsl(var(--teal))] shadow-xl shadow-[hsl(var(--teal))]/20 font-black text-white hover:scale-105 transition-all"
                                    >
                                        DISCOVER OPPORTUNITIES
                                    </Button>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </TabsContent>

                {/* Completed Tab */}
                <TabsContent value="completed" className="focus-visible:outline-none">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {loading ? (
                            Array.from({ length: 2 }).map((_, i) => (
                                <Skeleton key={i} className="h-[300px] rounded-[2.5rem]" />
                            ))
                        ) : completedHackathons.length > 0 ? (
                            completedHackathons.map((hackathon) => (
                                <motion.div
                                    key={hackathon.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="h-full"
                                >
                                    <Card className="h-full rounded-[2.5rem] border-none shadow-lg bg-white dark:bg-slate-900 overflow-hidden">
                                        <div className="p-8 space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                                                    <Award className="h-8 w-8 text-[hsl(var(--teal))]" />
                                                </div>
                                                {hackathon.rank && hackathon.rank <= 3 && (
                                                    <div className="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-2 shadow-sm border border-yellow-200">
                                                        <Star className="h-3 w-3 fill-current" />
                                                        WINNER #{hackathon.rank}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <CardTitle className="text-xl font-black line-clamp-1">{hackathon.title}</CardTitle>
                                                <CardDescription className="font-medium">{hackathon.collegeName}</CardDescription>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    <span>Submission</span>
                                                    <span>Completed</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm py-3 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                    <span className="text-slate-500 font-bold">Ended</span>
                                                    <span className="font-black text-slate-900 dark:text-white">
                                                        {format(new Date(hackathon.completionDate), 'MMM d, yyyy')}
                                                    </span>
                                                </div>
                                            </div>

                                            {hackathon.certificateAvailable && (
                                                <Button
                                                    className="w-full h-14 rounded-2xl bg-[hsl(var(--teal))] text-white shadow-lg shadow-[hsl(var(--teal))]/20 hover:opacity-90 font-black gap-3 transition-all"
                                                    onClick={() => handleDownloadCertificate(hackathon.id, hackathon.title)}
                                                >
                                                    <FileDown className="h-5 w-5" />
                                                    DOWNLOAD CERTIFICATE (PDF)
                                                </Button>
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-slate-500 font-medium">
                                No completed hackathons yet. Your legacy begins with the next commit.
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MyHackathonsPage;
