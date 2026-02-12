import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Trophy,
  Users,
  Calendar,
  MapPin,
  ChevronDown,
  X,
  SlidersHorizontal,
  Clock,
  Sparkles,
  ArrowRight,
  Zap,
  Gamepad2,
  Cpu,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { hackathonApi } from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { HackathonFilters } from '@/types';

// --- ROBUST MOCK DATA ---
const MOCK_HACKATHONS = [
  {
    id: 'h1',
    title: 'Global AI Summit Hackathon',
    shortDescription: 'Build the next generation of AI agents and automated systems using LLMs.',
    collegeName: 'Stanford University',
    collegeId: 'col-1',
    mode: 'hybrid',
    status: 'ongoing',
    prizePool: 25000,
    registeredTeams: 142,
    bannerImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80',
    startDate: new Date(Date.now() - 86400000 * 2), // Started 2 days ago
    endDate: new Date(Date.now() + 86400000 * 5),
    tags: ['AI', 'ML', 'Python']
  },
  {
    id: 'h2',
    title: 'Cyber Security Challenge 2024',
    shortDescription: 'CTF and defensive security challenges for the brightest minds in cyber.',
    collegeName: 'MIT Engineering',
    collegeId: 'col-2',
    mode: 'offline',
    status: 'upcoming',
    prizePool: 15000,
    registeredTeams: 88,
    bannerImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
    startDate: new Date(Date.now() + 86400000 * 10),
    endDate: new Date(Date.now() + 86400000 * 12),
    tags: ['Security', 'Linux', 'Network']
  },
  {
    id: 'h3',
    title: 'Eco-Tech Innovation Sprint',
    shortDescription: 'Sustainability focused hackathon to solve climate change issues through tech.',
    collegeName: 'University of Oxford',
    collegeId: 'col-3',
    mode: 'online',
    status: 'upcoming',
    prizePool: 10000,
    registeredTeams: 215,
    bannerImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80',
    startDate: new Date(Date.now() + 86400000 * 15),
    endDate: new Date(Date.now() + 86400000 * 17),
    tags: ['Earth', 'IoT', 'Clean Energy']
  },
  {
    id: 'h4',
    title: 'FinTech Revolution 2.0',
    shortDescription: 'Disrupting traditional banking with blockchain and smart contracts.',
    collegeName: 'London School of Economics',
    collegeId: 'col-4',
    mode: 'online',
    status: 'ongoing',
    prizePool: 50000,
    registeredTeams: 320,
    bannerImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
    startDate: new Date(Date.now() - 86400000 * 1),
    endDate: new Date(Date.now() + 86400000 * 3),
    tags: ['Finance', 'Web3', 'Blockchain']
  },
  {
    id: 'h5',
    title: 'HealthTech Connect',
    shortDescription: 'Bridging the gap between patient care and modern digital solutions.',
    collegeName: 'Johns Hopkins University',
    collegeId: 'col-5',
    mode: 'offline',
    status: 'completed',
    prizePool: 20000,
    registeredTeams: 110,
    bannerImage: 'https://images.unsplash.com/photo-1576091160550-2173dad99968?auto=format&fit=crop&q=80',
    startDate: new Date(Date.now() - 86400000 * 30),
    endDate: new Date(Date.now() - 86400000 * 28),
    tags: ['Health', 'App Dev', 'UI/UX']
  },
  {
    id: 'h6',
    title: 'GameDev Arena',
    shortDescription: '48-hour game jam to build the most immersive indie games.',
    collegeName: 'Digipen Institute',
    collegeId: 'col-6',
    mode: 'hybrid',
    status: 'upcoming',
    prizePool: 8000,
    registeredTeams: 75,
    bannerImage: 'https://images.unsplash.com/photo-1552824734-14b2d56d47b5?auto=format&fit=crop&q=80',
    startDate: new Date(Date.now() + 86400000 * 25),
    endDate: new Date(Date.now() + 86400000 * 27),
    tags: ['Unity', 'C#', 'Gaming']
  }
];

const HackathonsPage = () => {
  const navigate = useNavigate();
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<HackathonFilters>({});
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const data = await hackathonApi.getAll();
        // If data is empty or fail, use mock data as fallback
        setHackathons(data && data.length > 0 ? [...data, ...MOCK_HACKATHONS] : MOCK_HACKATHONS);
      } catch (error) {
        console.error('Failed to fetch hackathons:', error);
        toast.error('Could not connect to live servers. Showing mock data.');
        setHackathons(MOCK_HACKATHONS);
      } finally {
        setTimeout(() => setLoading(false), 1000); // Small delay for aesthetic loader
      }
    };
    fetchHackathons();
  }, []);

  const filteredHackathons = useMemo(() => {
    return hackathons.filter((hackathon) => {
      const matchSearch = searchQuery === '' ||
        hackathon.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hackathon.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hackathon.collegeName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchMode = !filters.mode || filters.mode.length === 0 || filters.mode.includes(hackathon.mode);
      const matchStatus = !filters.status || hackathon.status === filters.status;
      const matchCollege = !filters.college || hackathon.collegeId === filters.college;

      return matchSearch && matchMode && matchStatus && matchCollege;
    });
  }, [hackathons, searchQuery, filters]);

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const activeFiltersCount = Object.values(filters).filter(v =>
    v && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="h-24 w-24 rounded-full border-t-2 border-r-2 border-[hsl(var(--teal))] border-solid animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Trophy className="h-8 w-8 text-[hsl(var(--teal))]" />
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-sm font-black uppercase tracking-[0.3em] text-slate-400"
        >
          Initializing Arena...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-500">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 pt-32 pb-24">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-30" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '48px 48px',
          }} />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[hsl(var(--teal))] rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600 rounded-full blur-[100px]"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-white/5 backdrop-blur-xl text-[hsl(var(--teal))] border border-white/10 px-6 py-2 rounded-full mb-8 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl">
              🚀 University Hackathon Ecosystem
            </Badge>
            <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black text-white leading-none tracking-tighter mb-8">
              Code. <span className="text-[hsl(var(--teal))]">Compete.</span> <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-slate-500">Conquer.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-400 font-medium leading-relaxed mb-12">
              The premier battlefield for student developers. Turn your boldest ideas into reality and claim your spot on the global leaderboard.
            </p>
          </motion.div>

          {/* Search Bar - Premium Search */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mx-auto max-w-3xl w-full px-4"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(var(--teal))] via-blue-500 to-purple-600 rounded-[2.5rem] blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="relative bg-slate-900 border border-white/10 rounded-[2rem] flex items-center p-2 h-20 shadow-2xl">
                <Search className="ml-6 h-6 w-6 text-slate-500 group-focus-within:text-[hsl(var(--teal))] transition-all" />
                <Input
                  type="text"
                  placeholder="Search by title, stack, or college..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-white text-lg placeholder:text-slate-600 focus-visible:ring-0 w-full px-6"
                />
                <Button className="h-full rounded-[1.5rem] px-8 bg-[hsl(var(--teal))] text-white font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform">
                  Search
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="relative z-20 -mt-8 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Action Header / Filters */}
          <div className={cn(
            "sticky top-24 z-30 flex flex-col lg:flex-row items-center justify-between gap-6 p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 backdrop-blur-xl transition-all duration-300 mb-16",
            isScrolled && "top-4 opacity-95 scale-[0.98]"
          )}>
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <Select
                  value={filters.status || ''}
                  onValueChange={(value) => setFilters({ ...filters, status: value || undefined })}
                >
                  <SelectTrigger className="w-40 bg-transparent border-none shadow-none font-black text-xs uppercase tracking-widest">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
                <Select
                  value={filters.mode?.[0] || ''}
                  onValueChange={(value) => setFilters({ ...filters, mode: value ? [value as any] : undefined })}
                >
                  <SelectTrigger className="w-40 bg-transparent border-none shadow-none font-black text-xs uppercase tracking-widest">
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  className="h-12 px-6 rounded-2xl font-black text-xs uppercase text-rose-500 hover:bg-rose-50 gap-2"
                  onClick={clearFilters}
                >
                  <X className="h-4 w-4" /> Reset
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-6 h-12 rounded-2xl bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))] border border-[hsl(var(--teal))]/20">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-black uppercase tracking-widest">
                  {filteredHackathons.length} Arenas Active
                </span>
              </div>
            </div>
          </div>

          {/* Grid Content */}
          <AnimatePresence mode="popLayout">
            {filteredHackathons.length > 0 ? (
              <motion.div
                layout
                className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredHackathons.map((hackathon, index) => (
                  <motion.div
                    key={hackathon.id}
                    layout
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                    onClick={() => navigate(`/hackathons/${hackathon.id}`)}
                  >
                    <Card className="relative h-full border-none bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-4">
                      {/* Image Cluster */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={hackathon.bannerImage}
                          alt={hackathon.title}
                          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                        {/* Status Badges */}
                        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                          <div className="flex flex-col gap-2">
                            <Badge className={cn(
                              "px-4 py-1.5 rounded-xl font-black uppercase tracking-[0.1em] text-[10px] border-none shadow-lg",
                              hackathon.status === 'upcoming' && 'bg-blue-600 text-white',
                              hackathon.status === 'ongoing' && 'bg-[hsl(var(--teal))] text-white',
                              hackathon.status === 'completed' && 'bg-slate-600 text-white',
                            )}>
                              {hackathon.status}
                            </Badge>
                            <Badge className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-1.5 rounded-xl font-black uppercase tracking-[0.1em] text-[10px]">
                              {hackathon.mode}
                            </Badge>
                          </div>

                          <Button size="icon" className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[hsl(var(--teal))] transition-all">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Visual Pulse for Live Events */}
                        {hackathon.status === 'ongoing' && (
                          <div className="absolute bottom-6 left-6 flex items-center gap-2">
                            <div className="h-3 w-3 bg-[hsl(var(--teal))] rounded-full animate-ping" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">LIVE SPRINT</span>
                          </div>
                        )}
                      </div>

                      <div className="p-8 space-y-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <Globe className="h-3.5 w-3.5 text-slate-400" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[200px]">
                              {hackathon.collegeName}
                            </p>
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight line-clamp-2">
                            {hackathon.title}
                          </h3>
                        </div>

                        {/* Tags Preview */}
                        <div className="flex flex-wrap gap-2">
                          {hackathon.tags?.slice(0, 3).map((tag: string) => (
                            <span key={tag} className="text-[10px] font-bold px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-lg">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                              <Trophy className="h-3 w-3" /> Prize Pool
                            </p>
                            <p className="text-xl font-black text-slate-900 dark:text-white">
                              ${hackathon.prizePool.toLocaleString()}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                              <Users className="h-3 w-3" /> Squads
                            </p>
                            <p className="text-xl font-black text-slate-900 dark:text-white">
                              {hackathon.registeredTeams}
                            </p>
                          </div>
                        </div>

                        <Button className="w-full h-14 rounded-2xl bg-[hsl(var(--teal))]/5 text-[hsl(var(--teal))] font-black uppercase text-xs tracking-[0.2em] hover:bg-[hsl(var(--teal))] hover:text-white transition-all duration-500">
                          Challenge Entry
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-32 text-center bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800"
              >
                <div className="h-32 w-32 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-inner group">
                  <Gamepad2 className="h-16 w-16 text-slate-200 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-[0.2em]">
                  No Arena Available
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-10 font-bold leading-relaxed">
                  The servers are quiet. Try different coordinates or reset your search parameters to find the battlefield.
                </p>
                <Button
                  size="lg"
                  className="h-16 px-12 rounded-[1.5rem] bg-[hsl(var(--teal))] font-black text-white hover:scale-105 shadow-xl shadow-[hsl(var(--teal))]/20 transition-all uppercase tracking-widest text-xs"
                  onClick={clearFilters}
                >
                  RE-CALIBRATE SEARCH
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl bg-gradient-to-br from-[hsl(var(--navy))] to-slate-900 p-12 md:p-20 rounded-[4rem] text-center shadow-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[hsl(var(--teal))]/10 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
              Host Your Own <br /> <span className="text-[hsl(var(--teal))]">Innovation Arena?</span>
            </h2>
            <p className="text-slate-400 font-bold max-w-xl mx-auto mb-10 text-lg">
              Collaborate with us to organize hackathons that inspire and challenge the next generation of pioneers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="rounded-2xl h-16 bg-white text-slate-900 font-black px-10 hover:scale-105 transition-all text-xs uppercase tracking-widest">
                Partner with Us
              </Button>
              <Button size="lg" variant="outline" className="rounded-2xl h-16 border-white/20 text-white font-black px-10 hover:bg-white/10 text-xs uppercase tracking-widest">
                View Past Events
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HackathonsPage;
