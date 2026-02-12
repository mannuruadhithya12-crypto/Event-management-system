import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { hackathonApi } from '@/lib/api';
import { toast } from 'sonner';
import type { HackathonFilters } from '@/types';

const HackathonsPage = () => {
  const navigate = useNavigate();
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<HackathonFilters>({});

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const data = await hackathonApi.getAll();
        setHackathons(data || []);
      } catch (error) {
        console.error('Failed to fetch hackathons:', error);
        toast.error('Failed to load hackathons');
        setHackathons([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  const filteredHackathons = hackathons.filter((hackathon) => {
    if (searchQuery && !hackathon.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !hackathon.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.mode && filters.mode.length > 0 && !filters.mode.includes(hackathon.mode)) {
      return false;
    }
    if (filters.college && hackathon.collegeId !== filters.college) {
      return false;
    }
    if (filters.status && hackathon.status !== filters.status) {
      return false;
    }
    return true;
  });

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const activeFiltersCount = Object.values(filters).filter(v =>
    v && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-4 border-[hsl(var(--teal))] border-t-transparent rounded-full"
        />
        <p className="text-slate-500 font-medium animate-pulse">Scanning Hackathons...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--navy))] to-[hsl(var(--navy))]/90 px-4 py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="relative mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md font-bold uppercase tracking-widest text-[10px]">
              Phase 4 System Active
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6">
              Innovation <span className="text-[hsl(var(--teal))] underline underline-offset-8 decoration-8 decoration-[hsl(var(--teal))]/20">Starts Here</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-white/70 leading-relaxed font-medium">
              Compete with the best minds across colleges. Build products that matter. Win life-changing opportunities.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-12 max-w-2xl px-4"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(var(--teal))] to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <Search className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400 group-focus-within:text-[hsl(var(--teal))] transition-colors" />
                <Input
                  type="text"
                  placeholder="Find your next challenge..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-16 pl-14 pr-6 text-lg shadow-2xl rounded-2xl border-none ring-0 outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--teal))]/50"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Select
                value={filters.status || ''}
                onValueChange={(value) => setFilters({ ...filters, status: value || undefined })}
              >
                <SelectTrigger className="w-48 h-12 rounded-xl bg-white border-none shadow-sm font-bold">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.mode?.[0] || ''}
                onValueChange={(value) => setFilters({ ...filters, mode: value ? [value as any] : undefined })}
              >
                <SelectTrigger className="w-44 h-12 rounded-xl bg-white border-none shadow-sm font-bold">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>

              {activeFiltersCount > 0 && (
                <Button variant="ghost" className="h-12 px-6 rounded-xl font-bold bg-white/50 text-slate-500 gap-2" onClick={clearFilters}>
                  <X className="h-4 w-4" /> Reset
                </Button>
              )}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[hsl(var(--teal))] animate-pulse" />
              <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
                {filteredHackathons.length} ACTIVE CHALLENGES
              </span>
            </div>
          </div>

          {/* Hackathons Grid */}
          {filteredHackathons.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredHackathons.map((hackathon, index) => (
                <motion.div
                  key={hackathon.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/hackathons/${hackathon.id}`)}
                >
                  <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl overflow-hidden hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={hackathon.bannerImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80'}
                        alt={hackathon.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="absolute left-5 top-5 flex flex-col gap-2">
                        <Badge className={cn(
                          "px-3 py-1 rounded-lg font-black uppercase tracking-widest text-[10px] shadow-sm border-none",
                          hackathon.status === 'upcoming' && 'bg-blue-500 text-white',
                          hackathon.status === 'ongoing' && 'bg-orange-500 text-white',
                          hackathon.status === 'completed' && 'bg-slate-500 text-white',
                        )}>
                          {hackathon.status || 'Upcoming'}
                        </Badge>
                        <Badge className="bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1 rounded-lg font-black uppercase tracking-widest text-[10px] w-fit">
                          {hackathon.mode || 'Online'}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-8">
                      <p className="text-[10px] font-black text-[hsl(var(--teal))] uppercase tracking-[0.2em] mb-2">
                        {hackathon.collegeName}
                      </p>
                      <h3 className="text-xl font-black text-[hsl(var(--navy))] group-hover:text-[hsl(var(--teal))] transition-colors line-clamp-1 mb-3">
                        {hackathon.title}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed h-10 mb-6 font-medium">
                        {hackathon.shortDescription}
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prizes</span>
                            <span className="font-black text-[hsl(var(--navy))]">${hackathon.prizePool?.toLocaleString()}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Teams</span>
                            <span className="font-black text-[hsl(var(--navy))]">{hackathon.registeredTeams || 0}</span>
                          </div>
                        </div>
                        <Button size="icon" className="h-12 w-12 rounded-2xl bg-slate-50 hover:bg-[hsl(var(--teal))] text-slate-400 hover:text-white transition-all shadow-sm">
                          <ChevronDown className="h-5 w-5 -rotate-90" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[40px] shadow-sm border border-slate-100">
              <div className="h-24 w-24 bg-slate-50 rounded-[32px] flex items-center justify-center mb-8 shadow-inner">
                <Search className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-[hsl(var(--navy))] mb-4 uppercase tracking-widest">
                No Challenges Found
              </h3>
              <p className="text-slate-400 max-w-sm mb-8 font-medium">
                We couldn't find any hackathons matching your search criteria. Try broadening your search.
              </p>
              <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 border-slate-100 font-black hover:bg-slate-50" onClick={clearFilters}>
                RESET ALL FILTERS
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HackathonsPage;
