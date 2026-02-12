import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
        setHackathon(data);
        if (data.resultsPublished) {
          const res = await hackathonApi.getResults(id);
          setResults(res);
        }
      } catch (error) {
        console.error('Failed to fetch hackathon:', error);
        toast.error('Hackathon not found');
      } finally {
        setLoading(false);
      }
    };
    fetchHackathon();
  }, [id]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-4 border-[hsl(var(--teal))] border-t-transparent rounded-full"
        />
        <p className="text-slate-500 font-medium animate-pulse">Loading Hackathon...</p>
      </div>
    </div>
  );

  if (!hackathon) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[hsl(var(--navy))]">Hackathon not found</h1>
          <Button
            className="mt-6 h-11 rounded-xl bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/90 text-white font-bold"
            onClick={() => navigate('/hackathons')}
          >
            Back to Hackathons
          </Button>
        </div>
      </div>
    );
  }

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to register');
      navigate('/login');
      return;
    }
    toast.info('Please create or join a team to participate!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const registrationDeadline = hackathon.registrationDeadline ? new Date(hackathon.registrationDeadline) : null;
  const daysUntilDeadline = registrationDeadline
    ? Math.ceil((registrationDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Back Button */}
      <div className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3">
        <div className="mx-auto max-w-7xl">
          <Button variant="ghost" onClick={() => navigate('/hackathons')} className="rounded-xl gap-2 hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4" />
            Back to Hackathons
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[400px] sm:h-[450px] w-full bg-slate-900 overflow-hidden">
        <img
          src={hackathon.bannerImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80'}
          alt={hackathon.title}
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-12">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge className="bg-[hsl(var(--teal))] text-white px-3 py-1 rounded-lg font-bold border-none uppercase tracking-wider text-[10px]">
                  {hackathon.mode || 'Online'}
                </Badge>
                <Badge variant="outline" className="text-white border-white/20 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg font-bold uppercase tracking-wider text-[10px]">
                  {hackathon.status?.replace('_', ' ') || 'Upcoming'}
                </Badge>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                {hackathon.title}
              </h1>

              <div className="flex flex-wrap items-center gap-8 text-white/90">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Timeline</p>
                    <p className="font-bold">{new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Location</p>
                    <p className="font-bold">{hackathon.location || 'Virtual'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="mx-auto max-w-7xl px-4 -mt-8 relative z-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-white/80 backdrop-blur-md border rounded-2xl w-full justify-start gap-2 h-16 p-2 shadow-sm mb-8 overflow-x-auto no-scrollbar">
                <TabsTrigger value="overview" className="rounded-xl px-6 font-bold flex gap-2 data-[state=active]:bg-[hsl(var(--navy))] data-[state=active]:text-white transition-all">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="problem-statements" className="rounded-xl px-6 font-bold flex gap-2 data-[state=active]:bg-[hsl(var(--navy))] data-[state=active]:text-white transition-all">
                  Problems
                </TabsTrigger>
                <TabsTrigger value="team" className="rounded-xl px-6 font-bold flex gap-2 data-[state=active]:bg-[hsl(var(--navy))] data-[state=active]:text-white transition-all">
                  My Team
                </TabsTrigger>
                <TabsTrigger value="submission" className="rounded-xl px-6 font-bold flex gap-2 data-[state=active]:bg-[hsl(var(--navy))] data-[state=active]:text-white transition-all">
                  Submission
                </TabsTrigger>
                <TabsTrigger value="rules" className="rounded-xl px-6 font-bold flex gap-2 data-[state=active]:bg-[hsl(var(--navy))] data-[state=active]:text-white transition-all">
                  Rules
                </TabsTrigger>
                {hackathon.resultsPublished && (
                  <TabsTrigger value="results" className="rounded-xl px-6 font-bold flex gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white animate-pulse transition-all">
                    Results
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview" className="outline-none">
                <Card className="border-none shadow-sm bg-white/50 backdrop-blur-md rounded-3xl p-8">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3 className="text-2xl font-black text-[hsl(var(--navy))] mb-6 flex items-center gap-3">
                      <div className="h-8 w-1.5 bg-[hsl(var(--teal))] rounded-full" />
                      About the Challenge
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                      {hackathon.description}
                    </p>

                    <h3 className="text-xl font-bold text-[hsl(var(--navy))] mb-4">Focus Technologies</h3>
                    <div className="flex flex-wrap gap-3 mb-8">
                      {hackathon.techStack?.map((tech: string) => (
                        <Badge key={tech} className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-100 shadow-sm px-4 py-2 rounded-xl font-bold">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold text-[hsl(var(--navy))] mb-4">Judging Matrix</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {hackathon.judgingCriteria?.map((criterion: any) => (
                        <div key={criterion.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[hsl(var(--teal))]/30 transition-colors group">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-slate-900 group-hover:text-[hsl(var(--teal))] transition-colors">{criterion.name}</h4>
                            <Badge className="bg-[hsl(var(--teal))] text-white border-none font-black rounded-lg">
                              {criterion.weight}%
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500 leading-relaxed">{criterion.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="problem-statements" className="outline-none">
                <div className="space-y-6">
                  {hackathon.problemStatements?.map((ps: any) => (
                    <Card key={ps.id} className="border-none shadow-sm bg-white/50 backdrop-blur-md rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                      <div className="p-8">
                        <div className="flex items-start justify-between gap-4 mb-6">
                          <div>
                            <Badge variant="outline" className="mb-3 text-[10px] uppercase tracking-[0.2em] border-[hsl(var(--teal))]/20 text-[hsl(var(--teal))] font-black px-3 py-1 bg-[hsl(var(--teal))]/5 rounded-lg">
                              {ps.category}
                            </Badge>
                            <h3 className="text-2xl font-black text-[hsl(var(--navy))] group-hover:text-[hsl(var(--teal))] transition-colors underline decoration-[hsl(var(--teal))]/10 decoration-4 underline-offset-8">
                              {ps.title}
                            </h3>
                          </div>
                          <Badge className={cn(
                            "rounded-xl px-4 py-1.5 font-black uppercase tracking-widest text-[10px] shadow-sm",
                            ps.difficulty === 'easy' && 'bg-green-500 text-white',
                            ps.difficulty === 'medium' && 'bg-yellow-500 text-white',
                            ps.difficulty === 'hard' && 'bg-red-500 text-white',
                          )}>
                            {ps.difficulty}
                          </Badge>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-8 text-lg">{ps.description}</p>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Users className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Select this track</span>
                          </div>
                          <Button variant="ghost" className="rounded-xl font-black text-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/10 gap-2">
                            VIEW FULL BRIEF <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {(!hackathon.problemStatements || hackathon.problemStatements.length === 0) && (
                    <div className="text-center py-20 bg-white/30 rounded-[40px] border-4 border-dashed border-white/40 backdrop-blur-sm">
                      <div className="h-20 w-20 bg-white/50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <FileText className="h-10 w-10 text-slate-300" />
                      </div>
                      <p className="text-slate-500 font-bold text-xl uppercase tracking-widest">Awaiting problem release</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="team" className="outline-none">
                <TeamModule hackathonId={hackathon.id} />
              </TabsContent>

              <TabsContent value="submission" className="outline-none">
                <SubmissionModule hackathonId={hackathon.id} />
              </TabsContent>

              <TabsContent value="rules" className="outline-none">
                <Card className="border-none bg-white/50 backdrop-blur-md rounded-[40px] p-8">
                  <div className="space-y-4">
                    {hackathon.rules?.map((rule: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-6 p-6 rounded-3xl bg-white/60 border border-white hover:border-[hsl(var(--teal))]/30 transition-all hover:translate-x-2"
                      >
                        <div className="h-10 w-10 rounded-2xl bg-[hsl(var(--teal))]/10 flex items-center justify-center flex-shrink-0 font-black text-[hsl(var(--teal))]">
                          {index + 1}
                        </div>
                        <span className="text-slate-700 font-bold text-lg leading-relaxed">{rule}</span>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="results" className="outline-none">
                <div className="space-y-6">
                  {results.sort((a, b) => a.rankPoint - b.rankPoint).map((res: any, idx) => (
                    <motion.div
                      key={res.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className={cn(
                        "border-none rounded-[40px] overflow-hidden relative",
                        res.rankPoint === 1 ? "bg-gradient-to-br from-yellow-50 to-orange-50 shadow-xl shadow-yellow-200/20 py-8" : "bg-white/50 py-6"
                      )}>
                        {res.rankPoint === 1 && (
                          <div className="absolute top-0 right-0 p-8">
                            <Trophy className="h-12 w-12 text-yellow-500 animate-bounce" />
                          </div>
                        )}
                        <CardContent className="flex items-center gap-8 px-10">
                          <div className={cn(
                            "h-16 w-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm",
                            res.rankPoint === 1 ? "bg-yellow-400 text-white" : "bg-slate-100 text-slate-400"
                          )}>
                            {res.rankPoint}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-black text-slate-900 mb-1">{res.team?.name}</h3>
                            <p className="text-[hsl(var(--teal))] font-black uppercase tracking-widest text-xs">{res.prize}</p>
                            {res.feedback && (
                              <p className="text-slate-500 mt-3 text-sm italic font-medium">"{res.feedback}"</p>
                            )}
                          </div>
                          <Button variant="ghost" className="rounded-xl font-black hover:bg-white/50" onClick={() => navigate(`/dashboard/clubs`)}>
                            VIEW PROJECT
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-8">
            {/* Status Card */}
            <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] bg-white rounded-[40px] overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-center h-24 w-24 rounded-[32px] bg-orange-50 mx-auto mb-8 shadow-inner">
                  <Trophy className="h-12 w-12 text-[hsl(var(--orange))]" />
                </div>
                <div className="text-center mb-10">
                  <p className="text-5xl font-black text-[hsl(var(--navy))] mb-1">${hackathon.prizePool?.toLocaleString()}</p>
                  <p className="text-sm font-black text-[hsl(var(--teal))] uppercase tracking-[0.3em]">PRIZE POOL</p>
                </div>

                <div className="space-y-6 border-t border-b border-slate-50 py-8 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-slate-400" />
                      </div>
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Ends In</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{daysUntilDeadline} Days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center">
                        <Users className="h-5 w-5 text-slate-400" />
                      </div>
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Team Size</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{hackathon.minTeamSize}-{hackathon.maxTeamSize}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button className="w-full h-16 rounded-2xl bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/90 text-white font-black text-xl shadow-xl shadow-[hsl(var(--teal))]/20 transform hover:-translate-y-1 transition-all" onClick={handleRegister}>
                    JOIN NOW
                  </Button>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1 h-14 rounded-2xl border-2 border-slate-100 font-black gap-2 hover:bg-slate-50" onClick={handleShare}>
                      <Share2 className="h-5 w-5" /> SHARE
                    </Button>
                    <Button variant="outline" className="h-14 w-14 rounded-2xl border-2 border-slate-100 flex items-center justify-center hover:bg-slate-50" onClick={() => setIsBookmarked(!isBookmarked)}>
                      <Bookmark className={cn("h-6 w-6", isBookmarked && "fill-orange-500 text-orange-500")} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Organizer Info */}
            <Card className="border-none shadow-sm bg-white/50 backdrop-blur-md rounded-[32px] p-4">
              <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/80 border border-white">
                <div className="h-16 w-16 rounded-[20px] bg-[hsl(var(--navy))] text-white flex items-center justify-center shadow-lg font-black text-2xl">
                  {hackathon.organizerName?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-[hsl(var(--teal))] uppercase tracking-[0.2em] mb-1">Organized By</p>
                  <p className="font-black text-[hsl(var(--navy))] truncate text-lg leading-none">{hackathon.organizerName}</p>
                  <p className="text-xs font-bold text-slate-400 truncate mt-1">{hackathon.collegeName}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonDetailPage;
