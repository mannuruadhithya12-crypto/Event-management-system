import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  FileText,
  Award,
  Clock,
  CheckCircle,
  Star,
  TrendingUp,
  ArrowRight,
  Users,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store';
import { mockHackathons, mockTeams } from '@/data/mockData';

const JudgeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Mock data for judge
  const myHackathons = mockHackathons.slice(0, 2);
  const pendingSubmissions = mockTeams.filter(t => t.submissionStatus === 'submitted');
  const evaluatedSubmissions = mockTeams.filter(t => t.submissionStatus === 'evaluated');

  const stats = [
    { label: 'Hackathons Judging', value: 2, icon: Trophy, color: 'text-[hsl(var(--orange))]', bgColor: 'bg-[hsl(var(--orange))]/10' },
    { label: 'Pending Reviews', value: pendingSubmissions.length, icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
    { label: 'Evaluated', value: evaluatedSubmissions.length, icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { label: 'Total Reviews', value: 45, icon: Star, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, Judge {user?.firstName}! ⚖️
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Review submissions, provide feedback, and help identify the best projects.
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/judge/hackathons')}>
          View My Hackathons
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Pending Reviews */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Pending Reviews
              </CardTitle>
              <Badge variant="secondary">{pendingSubmissions.length} pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingSubmissions.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 dark:border-slate-700"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--navy))]/10">
                      <FileText className="h-6 w-6 text-[hsl(var(--navy))]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{team.projectName || team.name}</h4>
                      <p className="text-sm text-slate-500">{team.hackathonName}</p>
                      <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {team.members.length} members
                        </span>
                        {team.githubUrl && (
                          <span>• GitHub Repo</span>
                        )}
                      </div>
                    </div>
                    <Button size="sm">
                      Review Now
                    </Button>
                  </div>
                ))}
                {pendingSubmissions.length === 0 && (
                  <div className="py-8 text-center text-slate-500">
                    No pending reviews. Great job!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* My Hackathons */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[hsl(var(--orange))]" />
                Hackathons I'm Judging
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/judge/hackathons')}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myHackathons.map((hackathon) => (
                  <div
                    key={hackathon.id}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 dark:border-slate-700"
                  >
                    <img
                      src={hackathon.bannerImage}
                      alt={hackathon.title}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{hackathon.title}</h4>
                      <p className="text-sm text-slate-500">{hackathon.collegeName}</p>
                      <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                        <span>{hackathon.registeredTeams} teams</span>
                        <span>•</span>
                        <span>${hackathon.prizePool.toLocaleString()} prize</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge>{hackathon.status.replace('_', ' ')}</Badge>
                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(hackathon.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Evaluations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Recent Evaluations
              </CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { team: 'CodeCrafters', project: 'MediScan AI', score: 92, date: '2 hours ago' },
                  { team: 'TechTitans', project: 'EcoTrack', score: 88, date: '5 hours ago' },
                  { team: 'Innovators', project: 'SmartLearn', score: 95, date: '1 day ago' },
                ].map((evaluation, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 dark:border-slate-700"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{evaluation.project}</h4>
                      <p className="text-sm text-slate-500">by {evaluation.team}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-green-500">{evaluation.score}/100</span>
                      <p className="text-xs text-slate-500">{evaluation.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Judging Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Judging Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">AI Innovation Challenge</span>
                  <span className="font-semibold">75%</span>
                </div>
                <Progress value={75} className="mt-2 h-2" />
                <p className="mt-1 text-xs text-slate-500">15/20 teams evaluated</p>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Web3 Builders Hack</span>
                  <span className="font-semibold">40%</span>
                </div>
                <Progress value={40} className="mt-2 h-2" />
                <p className="mt-1 text-xs text-slate-500">8/20 teams evaluated</p>
              </div>
            </CardContent>
          </Card>

          {/* Judging Criteria Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[hsl(var(--teal))]" />
                Judging Criteria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="rounded-lg border border-slate-100 p-3 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Innovation</span>
                    <span className="text-sm text-slate-500">30%</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Originality and creativity</p>
                </div>
                <div className="rounded-lg border border-slate-100 p-3 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Technical Complexity</span>
                    <span className="text-sm text-slate-500">25%</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Implementation quality</p>
                </div>
                <div className="rounded-lg border border-slate-100 p-3 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Impact</span>
                    <span className="text-sm text-slate-500">25%</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Real-world usefulness</p>
                </div>
                <div className="rounded-lg border border-slate-100 p-3 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Presentation</span>
                    <span className="text-sm text-slate-500">20%</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Demo and pitch quality</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Judge Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Average Evaluation Time</span>
                  <span className="font-semibold">12 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Feedback Quality Score</span>
                  <span className="font-semibold text-green-500">4.8/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total Hackathons</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Teams Evaluated</span>
                  <span className="font-semibold">156</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-red-500/10">
                    <span className="text-xs font-bold text-red-500">2</span>
                    <span className="text-[10px] text-red-500">days</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">AI Challenge Reviews Due</p>
                    <p className="text-xs text-slate-500">5 teams remaining</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-amber-500/10">
                    <span className="text-xs font-bold text-amber-500">5</span>
                    <span className="text-[10px] text-amber-500">days</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Web3 Hack Starts</p>
                    <p className="text-xs text-slate-500">Judging begins</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JudgeDashboard;
