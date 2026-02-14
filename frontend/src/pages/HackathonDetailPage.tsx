import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store';
import { hackathonApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  CheckCircle2,
  Share2,
  Bookmark,
  ExternalLink,
  AlertCircle,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import RegistrationModal from '@/components/hackathon/RegistrationModal';

const HackathonDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [hackathon, setHackathon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [registerOpen, setRegisterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) fetchHackathonDetails();
  }, [id]);

  useEffect(() => {
    if (hackathon?.registrationDeadline) {
      const deadlineDate = new Date(hackathon.registrationDeadline);
      if (isNaN(deadlineDate.getTime())) {
        setTimeLeft("TBD");
        return;
      }
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = deadlineDate.getTime() - now;

        if (distance < 0) {
          setTimeLeft("Registration Closed");
          clearInterval(timer);
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`${days}d ${hours}h ${minutes}m left`);
        }
      }, 1000);
      return () => clearInterval(timer);
    } else if (hackathon) {
      setTimeLeft("TBD");
    }
  }, [hackathon]);

  const fetchHackathonDetails = async () => {
    setLoading(true);
    try {
      const data = await hackathonApi.getById(id!);
      setHackathon(data);
    } catch (error) {
      console.error("Failed to fetch hackathon details", error);
      toast.error("Failed to load hackathon details");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (type: 'INDIVIDUAL' | 'TEAM') => {
    if (!user) {
      toast.error("Please login to register");
      navigate('/login');
      return;
    }

    if (type === 'TEAM') {
      navigate(`/student/team/create?hackathonId=${id}&name=${encodeURIComponent(hackathon.title)}`);
    } else {
      // Individual registration logic (could be direct or modal)
      toast.info("Individual registration coming soon! Join a team for now.");
    }
  };

  if (loading) return <div className="p-20 text-center"><Skeleton className="h-[500px] w-full max-w-4xl mx-auto rounded-3xl" /></div>;
  if (!hackathon) return <div className="p-20 text-center">Hackathon not found</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      {/* Banner */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src={hackathon.bannerImage || 'https://images.unsplash.com/photo-1504384308090-c54be3855833?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'}
          alt={hackathon.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <Button
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10 mb-6 pl-0"
            onClick={() => navigate('/hackathons')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Hackathons
          </Button>
          <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
            <div>
              <div className="flex gap-3 mb-4">
                <Badge className="bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/90 text-white border-none text-xs px-3 py-1">
                  {hackathon.mode || 'Online'}
                </Badge>
                <Badge variant="outline" className="text-white border-white/20 select-none">
                  {hackathon.status}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
                {hackathon.title}
              </h1>
              <div className="flex flex-wrap gap-6 text-slate-300 font-medium text-sm">
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[hsl(var(--teal))]" /> {hackathon.startDate} - {hackathon.endDate}</span>
                {hackathon.country && <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-red-400" /> {hackathon.country}</span>}
                <span className="flex items-center gap-2"><Trophy className="h-4 w-4 text-yellow-400" /> {hackathon.prizePool || 'Prize Pool TBA'}</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 min-w-[300px]">
              <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-2">Registration Ends In</p>
              <div className="text-3xl font-black text-white mb-4 font-mono">
                {timeLeft}
              </div>
              <Button
                size="lg"
                className="w-full bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/90 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20"
                onClick={() => setRegisterOpen(true)}
                disabled={hackathon.status === 'CLOSED'}
              >
                Register Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl w-full flex">
                {['Overview', 'Problem Statements', 'Rules', 'Sponsors'].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab.toLowerCase().replace(' ', '-')}
                    className="flex-1 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wide"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="mt-8 space-y-8">
                <Card className="border-none shadow-sm dark:bg-slate-900">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4">About the Event</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {hackathon.description}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-none shadow-sm dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Users className="h-5 w-5 text-[hsl(var(--teal))]" /> Team Size
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-black text-slate-900 dark:text-white">
                        {hackathon.minTeamSize} - {hackathon.maxTeamSize} <span className="text-lg font-medium text-slate-500">Members</span>
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-sm dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Clock className="h-5 w-5 text-[hsl(var(--teal))]" /> Duration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-black text-slate-900 dark:text-white">
                        48 <span className="text-lg font-medium text-slate-500">Hours</span>
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="problem-statements" className="mt-8">
                <Card className="border-none shadow-sm dark:bg-slate-900">
                  <CardContent className="p-12 text-center text-slate-400">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">Problem statements will be revealed 24 hours before the event.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg bg-slate-900 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Tech Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {hackathon.tags?.map((tag: string) => (
                    <Badge key={tag} className="bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-lg">Share & Save</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start rounded-xl h-12 font-bold" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard");
                }}>
                  <Share2 className="mr-3 h-4 w-4" /> Share Event
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl h-12 font-bold">
                  <Bookmark className="mr-3 h-4 w-4" /> Save for Later
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl h-12 font-bold">
                  <ExternalLink className="mr-3 h-4 w-4" /> Visit Website
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <RegistrationModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        hackathon={hackathon}
        user={user}
      />
    </div>
  );
};

export default HackathonDetailPage;
