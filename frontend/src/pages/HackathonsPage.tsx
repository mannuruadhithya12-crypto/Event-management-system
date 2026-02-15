import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store';
import { hackathonApi } from '@/lib/api';
import FilterSidebar from '@/components/hackathon/FilterSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  ArrowRight,
  Bookmark,
  Globe,
  Search
} from 'lucide-react';

const HackathonsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchHackathons();
    if (user) fetchBookmarks();
  }, [filters, user]);

  const fetchHackathons = async () => {
    setLoading(true);
    try {
      // If filters are empty, use getAll, else use filter endpoint
      // Always use filter endpoint to benefit from pagination
      const data = await hackathonApi.filter(filters);

      if (data && typeof data === 'object' && 'content' in data && Array.isArray(data.content)) {
        setHackathons(data.content);
      } else if (Array.isArray(data)) {
        setHackathons(data);
      } else {
        setHackathons([]);
      }
    } catch (error) {
      console.error("Failed to fetch hackathons", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const data = await hackathonApi.getBookmarks(user!.id);
      setBookmarks(data.map((h: any) => h.id));
    } catch (error) {
      console.error("Failed to fetch bookmarks");
    }
  };

  const handleBookmark = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to bookmark");
      return;
    }
    try {
      await hackathonApi.bookmark(id, user.id);
      if (bookmarks.includes(id)) {
        setBookmarks(bookmarks.filter(b => b !== id));
        toast.success("Bookmark removed");
      } else {
        setBookmarks([...bookmarks, id]);
        toast.success("Hackathon saved!");
      }
    } catch (error) {
      toast.error("Failed to update bookmark");
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await hackathonApi.seed();
      toast.success("Database seeded with sample hackathons!");
      fetchHackathons();
    } catch (error) {
      toast.error("Failed to seed database");
    } finally {
      setSeeding(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'OPEN': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'CLOSED': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
      case 'ONGOING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'COMPLETED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-20">
      {/* Hero Section */}
      <div className="relative bg-slate-900 border-b border-slate-800 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(var(--teal))]/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] -ml-32 -mb-32"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6"
          >
            Find Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--teal))] to-emerald-400">Battleground</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-10"
          >
            Discover, compete, and win in the nation's top hackathons.
          </motion.p>

          {/* Seed Button for Demo */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              onClick={handleSeed}
              disabled={seeding}
            >
              {seeding ? 'Seeding...' : '🌱 Seed Database (Demo Only)'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <FilterSidebar filters={filters} setFilters={setFilters} className="sticky top-24" />
          </div>

          {/* Main Grid */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                {loading ? 'Searching...' : `${hackathons.length} Hackathons Found`}
              </h2>
              {/* Sort Dropdown could go here */}
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-[400px] rounded-3xl" />
                ))}
              </div>
            ) : hackathons.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {hackathons.map((hackathon, index) => (
                  <motion.div
                    key={hackathon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => navigate(`/hackathons/${hackathon.id}`)}
                    className="group cursor-pointer"
                  >
                    <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden relative">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={hackathon.bannerImage || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'}
                          alt={hackathon.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4">
                          <Button
                            size="icon"
                            className={`rounded-full h-10 w-10 shadow-lg ${bookmarks.includes(hackathon.id) ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-white/90 text-slate-900 hover:bg-white'}`}
                            onClick={(e) => handleBookmark(e, hackathon.id)}
                          >
                            <Bookmark className={`h-5 w-5 ${bookmarks.includes(hackathon.id) ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                        <div className="absolute top-4 left-4">
                          <Badge className={`backdrop-blur-md px-3 py-1 text-xs font-bold border ${getStatusColor(hackathon.status)}`}>
                            {hackathon.status}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                            <Globe className="h-3 w-3" /> {hackathon.mode || 'Online'}
                          </div>
                          {hackathon.country && (
                            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {hackathon.country}
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-xl font-black line-clamp-1 group-hover:text-[hsl(var(--teal))] transition-colors">
                          {hackathon.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 mt-2">
                          {hackathon.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {hackathon.tags?.slice(0, 3).map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {hackathon.tags?.length > 3 && (
                            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
                              +{hackathon.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl">
                            <Users className="h-4 w-4 text-[hsl(var(--teal))]" />
                            <span>{hackathon.minTeamSize}-{hackathon.maxTeamSize} Members</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl">
                            <Trophy className="h-4 w-4 text-yellow-500" />
                            <span>{hackathon.prizePool || 'TBA'}</span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Reg Ends: {hackathon.registrationDeadline}</span>
                        </div>
                        <Button size="sm" variant="ghost" className="text-[hsl(var(--teal))] hover:text-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/10 font-bold group/btn">
                          View Details <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-700">
                <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                  <Search className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Hackathons Found</h3>
                <p className="text-slate-500 max-w-sm mb-6">Try adjusting your filters or search terms. You can also seed the database with demo data.</p>
                <Button onClick={() => setFilters({})} variant="outline">Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonsPage;
