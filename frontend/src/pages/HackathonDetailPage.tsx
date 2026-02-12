import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  Share2,
  Bookmark,
  CheckCircle,
  ChevronRight,
  Github,
  Globe,
  FileText,
  Award,
  MessageSquare,
  Sparkles,
  Zap,
  ShieldCheck,
  Layout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { hackathonApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import TeamModule from '@/components/TeamModule';
import SubmissionModule from '@/components/SubmissionModule';

// Re-using same mock data for consistency
const MOCK_HACKATHONS = [
  {
    id: 'h1',
    title: 'Global AI Summit Hackathon',
    description: 'Build the next generation of AI agents and automated systems using LLMs. This challenge focuses on real-world utility of autonomous agents in healthcare, legal, and educational sectors. Participants will have access to premium API credits and mentoring from top-tier AI researchers.',
    collegeName: 'Stanford University',
    organizerName: 'Stanford AI Lab',
    mode: 'hybrid',
    status: 'ongoing',
    prizePool: 25000,
    registeredTeams: 142,
    bannerImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80',
    startDate: new Date(Date.now() - 86400000 * 2),
    endDate: new Date(Date.now() + 86400000 * 5),
    techStack: ['Python', 'OpenAI', 'LangChain', 'Next.js'],
    rules: [
      'Original work only. Plagiarism leads to disqualification.',
      'Teams must be 2-4 members.',
      'Final submission must include a functional demo video.',
      'Main focus should be on LLM integration.'
    ],
    judgingCriteria: [
      { id: '1', name: 'Innovation', weight: 40, description: 'How unique is the approach?' },
      { id: '2', name: 'Technical Depth', weight: 30, description: 'Correct usage of complex AI models.' },
      { id: '3', name: 'Feasibility', weight: 30, description: 'Can this be scaled in the real world?' }
    ],
    problemStatements: [
      { id: 'p1', title: 'AI for Remote Education', category: 'Education', difficulty: 'medium', description: 'Design an agent that helps students perform complex laboratory research remotely.' }
    ]
  },
  {
    id: 'h2',
    title: 'Cyber Security Challenge 2024',
    description: 'CTF and defensive security challenges for the brightest minds in cyber. This event tests your capability to defend critical infrastructure against sophisticated cyber attacks. Features live red-teaming scenarios and hardware security audits.',
    collegeName: 'MIT Engineering',
    organizerName: 'MIT Cyber Society',
    mode: 'offline',
    status: 'upcoming',
    prizePool: 15000,
    registeredTeams: 88,
    bannerImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
    startDate: new Date(Date.now() + 86400000 * 10),
    endDate: new Date(Date.now() + 86400000 * 12),
    techStack: ['C++', 'Security Onion', 'Wireshark', 'Metasploit'],
    rules: [
      'No intentional damage to provider infrastructure.',
      'All participants must bring their own hardware.',
      'Sharing flags with other teams is prohibited.'
    ],
    judgingCriteria: [
      { id: '1', name: 'Defense Quality', weight: 50, description: 'Effectiveness of mitigation strategies.' },
      { id: '2', name: 'Speed', weight: 30, description: 'Time taken to identify vulnerabilities.' },
      { id: '3', name: 'Documentation', weight: 20, description: 'Quality of the incident report.' }
    ],
    problemStatements: [
      { id: 'p2', title: 'Critical Grid Defense', category: 'Infrastructure', difficulty: 'hard', description: 'Protect a simulated power grid controller from external manipulation.' }
    ]
  },
  {
    id: 'h3',
    title: 'Eco-Tech Innovation Sprint',
    description: 'Sustainability focused hackathon to solve climate change issues through tech. We are looking for hardware or software solutions that reduce carbon footprints or enhance recycling efficiencies in urban environments.',
    collegeName: 'University of Oxford',
    organizerName: 'Oxford Climate Group',
    mode: 'online',
    status: 'upcoming',
    prizePool: 10000,
    registeredTeams: 215,
    bannerImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80',
    startDate: new Date(Date.now() + 86400000 * 15),
    endDate: new Date(Date.now() + 86400000 * 17),
    techStack: ['IoT', 'Arduino', 'React', 'Firebase'],
    rules: [
      'Must address at least one UN Sustainability Goal.',
      'Open source components must be properly attributed.',
      'Maximum team size is 5.'
    ],
    judgingCriteria: [
      { id: '1', name: 'Impact', weight: 50, description: 'Potential for real-world environmental change.' },
      { id: '2', name: 'Feasibility', weight: 30, description: 'How easy is it to implement?' },
      { id: '3', name: 'Pitch', weight: 20, description: 'Clarity of the solution presentation.' }
    ],
    problemStatements: [
      { id: 'p3', title: 'Urban Waste Tracker', category: 'Logistics', difficulty: 'easy', description: 'Enable citizens to trace their recycled goods in real time.' }
    ]
  }
];

const HackathonDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [hackathon, setHackathon] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchHackathon = async () => {
      if (!id) return;
      try {
        const data = await hackathonApi.getById(id);
        if (data) {
          setHackathon(data);
          if (data.resultsPublished) {
            const res = await hackathonApi.getResults(id);
            setResults(res);
          }
        } else {
          // Fallback to mock data if API returns null
          const mock = MOCK_HACKATHONS.find(m => m.id === id);
          if (mock) setHackathon(mock);
          else throw new Error('Not found');
        }
      } catch (error) {
        console.error('Failed to fetch hackathon:', error);
        // Robust mock fallback
        const mock = MOCK_HACKATHONS.find(m => m.id === id);
        if (mock) {
          setHackathon(mock);
          toast.info('Viewing preview mode (using mock data)');
        } else {
          toast.error('Hackathon not found');
        }
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchHackathon();
  }, [id]);

  if (loading) return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="h-12 w-12 border-4 border-[hsl(var(--teal))] border-t-transparent rounded-full mb-6" />
      <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Loading Arena Intelligence...</p>
    </div>
  );

  if (!hackathon) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="text-center bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800">
          <ShieldCheck className="h-16 w-16 text-rose-500 mx-auto mb-6 opacity-20" />
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest">Target Lost</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold mb-8">This hackathon coordinate no longer exists in our database.</p>
          <Button
            size="lg"
            className="h-16 px-12 rounded-2xl bg-[hsl(var(--teal))] text-white font-black uppercase tracking-widest text-xs"
            onClick={() => navigate('/hackathons')}
          >
            RETURN TO LISTING
          </Button>
        </div>
      </div>
    );
  }

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.error('Identity required. Please sign in.');
      navigate('/login');
      return;
    }
    toast.info('To register, navigate to the Team tab and form your squad!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Frequency secured. Link copied!');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20 overflow-x-hidden">
      {/* Premium Header */}
      <div className="sticky top-0 z-[100] border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/hackathons')} className="rounded-xl gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 font-black text-xs uppercase tracking-widest flex">
            <ArrowLeft className="h-4 w-4" /> Exit to Listing
          </Button>
          <div className="hidden md:flex items-center gap-4">
            <Badge className="bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))] border-none font-black px-4 py-1 rounded-lg text-[10px] uppercase tracking-widest">
              VERIFIED EVENT
            </Badge>
          </div>
        </div>
      </div>

      {/* Extreme Hero */}
      <div className="relative h-[600px] w-full overflow-hidden">
        <img
          src={hackathon.bannerImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80'}
          alt={hackathon.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-8 pb-20">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Badge className="bg-[hsl(var(--teal))] text-white px-6 py-2 rounded-2xl font-black border-none uppercase tracking-[0.2em] text-[10px] shadow-2xl">
                  {hackathon.mode}
                </Badge>
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl px-6 py-2 rounded-2xl border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em]">
                  <Sparkles className="h-3 w-3 text-yellow-400" /> {hackathon.status}
                </div>
              </div>

              <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
                {hackathon.title}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-[2rem] bg-white/10 backdrop-blur-2xl flex items-center justify-center border border-white/10 shadow-3xl">
                    <Calendar className="h-8 w-8 text-[hsl(var(--teal))]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-1">Deployment Timeline</p>
                    <p className="font-black text-xl text-white">
                      {hackathon.startDate instanceof Date ? format(hackathon.startDate, 'MMM dd') : new Date(hackathon.startDate).toLocaleDateString()} - {hackathon.endDate instanceof Date ? format(hackathon.endDate, 'MMM dd') : new Date(hackathon.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-[2rem] bg-white/10 backdrop-blur-2xl flex items-center justify-center border border-white/10 shadow-3xl">
                    <MapPin className="h-8 w-8 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-1">Arena Location</p>
                    <p className="font-black text-xl text-white truncate max-w-[300px]">{hackathon.location || hackathon.collegeName}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Interactive Content Grid */}
      <div className="mx-auto max-w-7xl px-8 -mt-16 relative z-10 flex flex-col lg:flex-row gap-12">
        {/* Main Tabs Column */}
        <div className="flex-1 min-w-0">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-white/80 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] w-full justify-start gap-4 h-20 p-3 shadow-2xl mb-12 overflow-x-auto no-scrollbar backdrop-blur-xl">
              {['Overview', 'Problems', 'Team', 'Submission', 'Rules'].map(tab => (
                <TabsTrigger
                  key={tab}
                  value={tab.toLowerCase() === 'problems' ? 'problem-statements' : tab.toLowerCase()}
                  className="rounded-2xl h-full px-10 font-black text-xs uppercase tracking-widest data-[state=active]:bg-slate-900 dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-slate-900 transition-all duration-500"
                >
                  {tab}
                </TabsTrigger>
              ))}
              {hackathon.resultsPublished && (
                <TabsTrigger value="results" className="rounded-2xl h-full px-10 font-black text-xs uppercase tracking-widest bg-yellow-400/20 text-yellow-600 data-[state=active]:bg-yellow-400 data-[state=active]:text-white transition-all">
                  RESULTS LIVE
                </TabsTrigger>
              )}
            </TabsList>

            <div className="outline-none">
              <AnimatePresence mode="wait">
                <TabsContent value="overview">
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[3rem] p-12 overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--teal))]/5 rounded-full -mr-32 -mt-32 blur-[100px]" />
                      <div className="prose max-w-none dark:prose-invert relative z-10">
                        <div className="flex items-center gap-6 mb-10">
                          <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center">
                            <Zap className="h-8 w-8 text-[hsl(var(--teal))]" />
                          </div>
                          <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-none">The Mission</h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-xl font-medium leading-relaxed mb-12">
                          {hackathon.description}
                        </p>

                        <div className="grid md:grid-cols-2 gap-12 mt-12">
                          <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[hsl(var(--teal))]">Stack Deployment</h3>
                            <div className="flex flex-wrap gap-3">
                              {hackathon.techStack?.map((tech: string) => (
                                <Badge key={tech} className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 shadow-sm px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-rose-500">Evaluation Matrix</h3>
                            <div className="space-y-4">
                              {hackathon.judgingCriteria?.map((criterion: any) => (
                                <div key={criterion.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex justify-between items-center group">
                                  <span className="font-bold text-slate-900 dark:text-white group-hover:text-[hsl(var(--teal))] transition-colors">{criterion.name}</span>
                                  <span className="bg-[hsl(var(--teal))] text-white font-black text-[10px] px-3 py-1 rounded-lg shadow-lg">{criterion.weight}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="problem-statements">
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    {hackathon.problemStatements?.map((ps: any, i: number) => (
                      <Card key={ps.id} className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                        <div className="p-10">
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8">
                            <div className="space-y-3">
                              <Badge className="bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))] font-black px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-[0.2em] border-none">
                                Track-0{i + 1}: {ps.category}
                              </Badge>
                              <h3 className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-[hsl(var(--teal))] transition-all">
                                {ps.title}
                              </h3>
                            </div>
                            <Badge className={cn("px-6 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest", ps.difficulty === 'hard' ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-700')}>
                              Level: {ps.difficulty}
                            </Badge>
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-lg font-bold leading-relaxed mb-8">{ps.description}</p>
                          <Button variant="outline" className="h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 font-black text-xs uppercase gap-3 group/btn">
                            Access Technical Brief <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-2 transition-transform" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </motion.div>
                </TabsContent>

                <TabsContent value="team">
                  <TeamModule hackathonId={hackathon.id} />
                </TabsContent>

                <TabsContent value="submission">
                  <SubmissionModule hackathonId={hackathon.id} />
                </TabsContent>

                <TabsContent value="rules">
                  <Card className="border-none bg-white dark:bg-slate-900 rounded-[3rem] p-12 shadow-2xl">
                    <div className="grid gap-6">
                      {hackathon.rules?.map((rule: string, index: number) => (
                        <div key={index} className="flex gap-8 p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 group hover:border-[hsl(var(--teal))]/30 transition-all">
                          <div className="h-14 w-14 rounded-[1.5rem] bg-white dark:bg-slate-700 flex items-center justify-center font-black text-2xl text-[hsl(var(--teal))] shadow-sm border border-slate-100 dark:border-slate-600">
                            {index + 1}
                          </div>
                          <p className="flex-1 text-xl font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                            {rule}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>
              </AnimatePresence>
            </div>
          </Tabs>
        </div>

        {/* Sidebar Area */}
        <div className="w-full lg:w-[400px] flex flex-col gap-8">
          <Card className="bg-slate-950 border-none rounded-[3rem] overflow-hidden shadow-3xl relative p-12 text-center group">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--teal))]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10">
              <div className="h-24 w-24 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 flex items-center justify-center mx-auto mb-10 shadow-3xl">
                <Trophy className="h-12 w-12 text-[hsl(var(--teal))] transition-transform group-hover:scale-125" />
              </div>
              <div className="space-y-2 mb-12">
                <p className="text-6xl font-black text-white leading-none">${hackathon.prizePool?.toLocaleString()}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Total Bounty Pool</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Registrants</p>
                  <p className="text-2xl font-black text-white">{hackathon.registeredTeams}</p>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mode</p>
                  <p className="text-2xl font-black text-white uppercase">{hackathon.mode}</p>
                </div>
              </div>

              <Button className="w-full h-20 rounded-[1.5rem] bg-[hsl(var(--teal))] text-white font-black text-xl shadow-2xl shadow-[hsl(var(--teal))]/20 hover:scale-[1.03] transition-all" onClick={handleRegister}>
                INITIATE REGISTRATION
              </Button>
            </div>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-none rounded-[3rem] p-10 shadow-2xl space-y-8">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Network & Coordination</h4>
            <div className="space-y-4">
              <Button variant="outline" className="w-full h-16 rounded-2xl justify-between px-8 border-slate-100 dark:border-slate-800 font-black text-xs uppercase tracking-widest group" onClick={handleShare}>
                <div className="flex items-center gap-4">
                  <Share2 className="h-5 w-5 text-indigo-500" /> Secure Protocol Link
                </div>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button variant="outline" className="w-full h-16 rounded-2xl justify-between px-8 border-slate-100 dark:border-slate-800 font-black text-xs uppercase tracking-widest group" onClick={() => setIsBookmarked(!isBookmarked)}>
                <div className="flex items-center gap-4">
                  <Bookmark className={cn("h-5 w-5", isBookmarked ? "text-orange-500 fill-orange-500" : "text-orange-400")} /> Archive Challenge
                </div>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
          </Card>

          <div className="bg-slate-900 dark:bg-white p-2 rounded-[2.5rem] flex items-center gap-6 shadow-2xl">
            <div className="h-16 w-16 rounded-[1.8rem] bg-white/10 dark:bg-slate-900/10 flex items-center justify-center font-black text-2xl text-white dark:text-slate-900">
              {hackathon.organizerName?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-xs font-black text-[hsl(var(--teal))] uppercase tracking-widest mb-1">Controller</p>
              <p className="font-black text-white dark:text-slate-900 truncate text-lg uppercase leading-none">{hackathon.organizerName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonDetailPage;
