import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    Users,
    Search,
    Plus,
    ArrowRight,
    ChevronLeft,
    CheckCircle2,
    Trophy,
    Rocket,
    Globe,
    Zap,
    Lock,
    ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { hackathonApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

const HackathonRegistrationPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();

    const [step, setStep] = useState(1);
    const [hackathon, setHackathon] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Form States
    const [teamName, setTeamName] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error('Authentication required for arena entry.');
            navigate('/login');
            return;
        }

        const fetchHackathon = async () => {
            try {
                const data = await hackathonApi.getById(id!);
                setHackathon(data);
            } catch (error) {
                toast.error('Failed to recognize hackathon coordinates.');
                navigate('/hackathons');
            } finally {
                setLoading(false);
            }
        };
        fetchHackathon();
    }, [id, isAuthenticated, navigate]);

    const handleNextStep = () => {
        if (step === 1 && !isAgreed) {
            toast.error('You must agree to the Rules of Engagement.');
            return;
        }
        setStep(prev => prev + 1);
    };

    const handleCreateTeam = async () => {
        if (!teamName.trim()) {
            toast.error('Squad name is mandatory.');
            return;
        }
        if (!user?.id) {
            toast.error('User identity missing. Please login again.');
            navigate('/login');
            return;
        }

        setIsProcessing(true);
        try {
            await hackathonApi.createTeam(id!, teamName, user.id);
            toast.success('Squad synthesized successfully!');
            setStep(3);
        } catch (error: any) {
            console.error("Team creation failed:", error);
            if (error.message?.includes('User not found') || error.message?.includes('404')) {
                toast.error('User record mismatch. Please re-authenticate.');
                // clear auth and redirect
                localStorage.removeItem('auth-storage');
                navigate('/login');
            } else {
                toast.error(error.message || 'Creation protocol failed.');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleJoinTeam = async () => {
        if (!joinCode.trim()) {
            toast.error('Valid join code required.');
            return;
        }
        if (!user?.id) {
            toast.error('User identity missing. Please login again.');
            navigate('/login');
            return;
        }

        setIsProcessing(true);
        try {
            await hackathonApi.joinTeam(id!, user.id, joinCode);
            toast.success('Successfully infiltrated squad!');
            setStep(3);
        } catch (error: any) {
            console.error("Team join failed:", error);
            if (error.message?.includes('User not found') || error.message?.includes('404')) {
                toast.error('User record mismatch. Please re-authenticate.');
                localStorage.removeItem('auth-storage');
                navigate('/login');
            } else {
                toast.error(error.message || 'Invalid infiltration code.');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="h-16 w-16 border-4 border-[hsl(var(--teal))]/20 border-t-[hsl(var(--teal))] rounded-full"
                />
                <p className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Initializing Registration Protocol...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-32">
            <div className="max-w-4xl mx-auto px-6">
                {/* Dynamic Progress Header */}
                <div className="mb-16">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <p className="text-[10px] font-black text-[hsl(var(--teal))] uppercase tracking-[0.4em] mb-2">{hackathon.title}</p>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Arena <span className="text-[hsl(var(--teal))]">Registration</span></h1>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Step {step} of 3</p>
                            <div className="flex gap-2">
                                {[1, 2, 3].map(s => (
                                    <div key={s} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step >= s ? 'bg-[hsl(var(--teal))] shadow-[0_0_10px_rgba(20,184,166,0.5)]' : 'bg-slate-200 dark:bg-slate-800'}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <Card className="rounded-[3rem] border-none shadow-3xl bg-white dark:bg-slate-900 p-12 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--teal))]/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
                                <div className="relative z-10 space-y-10">
                                    <div className="flex items-center gap-6">
                                        <div className="h-20 w-20 bg-orange-500/10 rounded-3xl flex items-center justify-center">
                                            <ShieldCheck className="h-10 w-10 text-orange-500" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black uppercase tracking-tight">Rules of Engagement</h2>
                                            <p className="text-sm font-bold text-slate-500">Review the technical protocols and ethics before entry.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                        {hackathon.rules ? hackathon.rules.split('.').map((rule: string, i: number) => rule.trim() && (
                                            <div key={i} className="flex gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                <span className="font-black text-[hsl(var(--teal))] tabular-nums">0{i + 1}</span>
                                                <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed">{rule}.</p>
                                            </div>
                                        )) : (
                                            <p className="text-slate-500 italic">No specific rules provided for this arena yet.</p>
                                        )}
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
                                        <button
                                            onClick={() => setIsAgreed(!isAgreed)}
                                            className={`h-8 w-8 rounded-xl border-2 flex items-center justify-center transition-all ${isAgreed ? 'bg-[hsl(var(--teal))] border-[hsl(var(--teal))] shadow-lg shadow-[hsl(var(--teal))]/20' : 'border-slate-200 dark:border-slate-700 hover:border-[hsl(var(--teal))]'}`}
                                        >
                                            {isAgreed && <CheckCircle2 className="h-5 w-5 text-white" />}
                                        </button>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">I affirm that I have read and will comply with all protocols.</p>
                                    </div>
                                </div>
                            </Card>

                            <div className="flex justify-between items-center">
                                <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-slate-400 gap-2" onClick={() => navigate(-1)}>
                                    <ChevronLeft className="h-4 w-4" /> Abort Entry
                                </Button>
                                <Button
                                    className="h-20 px-16 rounded-[2rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-lg gap-4 shadow-2xl hover:scale-[1.05] transition-all"
                                    onClick={handleNextStep}
                                >
                                    CONTINUE TO SQUAD ALIGNMENT
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Create Team */}
                                <Card className="rounded-[3rem] border-none shadow-3xl bg-white dark:bg-slate-900 p-10 flex flex-col items-center text-center space-y-8 group hover:-translate-y-2 transition-all duration-500">
                                    <div className="h-24 w-24 bg-[hsl(var(--teal))]/10 rounded-[2.5rem] flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6">
                                        <Plus className="h-10 w-10 text-[hsl(var(--teal))]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">Synthesize New Squad</h3>
                                        <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest">Lead your own team to victory</p>
                                    </div>
                                    <div className="w-full space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block text-left ml-2">Squad Identifier</label>
                                        <Input
                                            placeholder="ENTER TEAM NAME..."
                                            className="h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-black text-center uppercase tracking-widest shadow-inner"
                                            value={teamName}
                                            onChange={e => setTeamName(e.target.value)}
                                        />
                                        <Button
                                            className="w-full h-16 rounded-2xl bg-[hsl(var(--teal))] text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-[hsl(var(--teal))]/20 hover:scale-[1.02] transition-all"
                                            onClick={handleCreateTeam}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? 'SYNTHESIZING...' : 'INITIALIZE SQUAD'}
                                        </Button>
                                    </div>
                                </Card>

                                {/* Join Team */}
                                <Card className="rounded-[3rem] border-none shadow-3xl bg-white dark:bg-slate-900 p-10 flex flex-col items-center text-center space-y-8 group hover:-translate-y-2 transition-all duration-500">
                                    <div className="h-24 w-24 bg-purple-500/10 rounded-[2.5rem] flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-[-6deg]">
                                        <Search className="h-10 w-10 text-purple-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">Infiltrate Existing Squad</h3>
                                        <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest">Join your peers via secure code</p>
                                    </div>
                                    <div className="w-full space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block text-left ml-2">8-Digit Infiltration Code</label>
                                        <Input
                                            placeholder="00000000"
                                            className="h-16 rounded-2xl font-mono text-xl bg-slate-50 dark:bg-slate-800 border-none font-black text-center uppercase tracking-[0.5em] shadow-inner"
                                            maxLength={8}
                                            value={joinCode}
                                            onChange={e => setJoinCode(e.target.value)}
                                        />
                                        <Button
                                            variant="outline"
                                            className="w-full h-16 rounded-2xl border-2 border-slate-100 dark:border-slate-800 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                            onClick={handleJoinTeam}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? 'DECRYPTING...' : 'ENTER ARENA'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            <div className="text-center">
                                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400" onClick={() => setStep(1)}>
                                    <ChevronLeft className="h-3 w-3 mr-2" /> Return to Protocol Briefing
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-12"
                        >
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-[hsl(var(--teal))]/20 blur-[80px] rounded-full" />
                                <div className="relative h-48 w-48 bg-white dark:bg-slate-900 rounded-[4rem] shadow-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="h-24 w-24 text-[hsl(var(--teal))]" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Registration <span className="text-[hsl(var(--teal))]">Verified</span></h2>
                                <p className="text-lg font-bold text-slate-500 max-w-lg mx-auto leading-relaxed">
                                    Your coordinates have been synced with the arena. Your squad is now active in the {hackathon.title} grid.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                <Card className="p-8 rounded-[2.5rem] bg-slate-950 text-white border-none shadow-2xl flex flex-col items-center text-center">
                                    <Rocket className="h-10 w-10 text-[hsl(var(--teal))] mb-6" />
                                    <h4 className="text-xs font-black uppercase tracking-widest mb-2">Next Mission</h4>
                                    <p className="text-lg font-black italic mb-6">Explore the Arena Hub</p>
                                    <Button
                                        className="w-full h-14 rounded-2xl bg-white text-slate-950 font-black uppercase tracking-widest text-[10px] hover:bg-[hsl(var(--teal))] hover:text-white transition-all"
                                        onClick={() => navigate(`/dashboard/student/my-hackathons/${id}`)}
                                    >
                                        GO TO DASHBOARD
                                    </Button>
                                </Card>

                                <Card className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border-none shadow-2xl flex flex-col items-center text-center">
                                    <Trophy className="h-10 w-10 text-orange-500 mb-6" />
                                    <h4 className="text-xs font-black uppercase tracking-widest mb-2">Team Space</h4>
                                    <p className="text-lg font-black italic mb-6">Manage Your Squad</p>
                                    <Button
                                        variant="outline"
                                        className="w-full h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 font-black uppercase tracking-widest text-[10px] hover:border-[hsl(var(--teal))] transition-all"
                                        onClick={() => navigate(`/dashboard/student/my-hackathons`)}
                                    >
                                        VIEW COLLEAGUES
                                    </Button>
                                </Card>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default HackathonRegistrationPage;
