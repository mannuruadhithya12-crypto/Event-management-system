import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Calendar,
  Users,
  GraduationCap,
  FolderOpen,
  BarChart3,
  TrendingUp,
  ArrowRight,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Eye,
  Video,
  ListRestart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store';
import { mockHackathons, mockEvents, mockContent, mockColleges } from '@/data/mockData';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const chartData = [
  { month: 'Jan', students: 1200, events: 15, hackathons: 3 },
  { month: 'Feb', students: 1350, events: 18, hackathons: 4 },
  { month: 'Mar', students: 1400, events: 22, hackathons: 5 },
  { month: 'Apr', students: 1450, events: 20, hackathons: 4 },
  { month: 'May', students: 1500, events: 25, hackathons: 6 },
  { month: 'Jun', students: 1500, events: 28, hackathons: 7 },
];

const CollegeAdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const college = mockColleges.find(c => c.id === user?.collegeId);

  const collegeHackathons = mockHackathons.filter(h => h.collegeId === user?.collegeId);
  const collegeEvents = mockEvents.filter(e => e.collegeId === user?.collegeId);
  const collegeContent = mockContent.filter(c => c.collegeId === user?.collegeId);
  const pendingContent = mockContent.filter(c => c.collegeId === user?.collegeId && c.status === 'pending');

  const stats = [
    { label: 'Total Students', value: college?.studentCount || 0, icon: GraduationCap, color: 'text-blue-500', bgColor: 'bg-blue-500/10', change: '+5%' },
    { label: 'Faculty', value: college?.facultyCount || 0, icon: Users, color: 'text-[hsl(var(--teal))]', bgColor: 'bg-[hsl(var(--teal))]/10', change: '+2%' },
    { label: 'Hackathons', value: college?.stats.totalHackathons || 0, icon: Trophy, color: 'text-[hsl(var(--orange))]', bgColor: 'bg-[hsl(var(--orange))]/10', change: '+12%' },
    { label: 'Events', value: college?.stats.totalEvents || 0, icon: Calendar, color: 'text-purple-500', bgColor: 'bg-purple-500/10', change: '+8%' },
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
            {college?.name} Dashboard
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Manage your college's activities and track performance.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/dashboard/college-admin/settings')}>
            <Building2 className="mr-2 h-4 w-4" />
            College Settings
          </Button>
        </div>
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
                    <p className="mt-1 text-3xl font-bold">{stat.value.toLocaleString()}</p>
                    <p className="mt-1 text-xs text-green-500">{stat.change} this month</p>
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

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Student Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="students" stroke="#3b82f6" fillOpacity={1} fill="url(#colorStudents)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[hsl(var(--teal))]" />
              Events & Hackathons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="events" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="hackathons" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          <Tabs defaultValue="hackathons">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="webinars">Webinars</TabsTrigger>
            </TabsList>

            <TabsContent value="hackathons" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>College Hackathons</CardTitle>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {collegeHackathons.map((hackathon) => (
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
                          <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                            <span>{hackathon.registeredTeams} teams</span>
                            <span>•</span>
                            <span>${hackathon.prizePool.toLocaleString()} prize</span>
                          </div>
                        </div>
                        <Badge>{hackathon.status.replace('_', ' ')}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>College Events</CardTitle>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {collegeEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 dark:border-slate-700"
                      >
                        <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-blue-500/10">
                          <span className="text-xs font-medium text-blue-500">
                            {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="text-xl font-bold text-blue-500">
                            {new Date(event.startDate).getDate()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{event.title}</h4>
                          <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                            <span>{event.registeredCount} registered</span>
                            <span>•</span>
                            <span className="capitalize">{event.eventType.replace('_', ' ')}</span>
                          </div>
                        </div>
                        <Badge variant="outline">{event.status.replace('_', ' ')}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>College Content</CardTitle>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {collegeContent.map((content) => (
                      <div
                        key={content.id}
                        className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 dark:border-slate-700"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--teal))]/10">
                          <FolderOpen className="h-6 w-6 text-[hsl(var(--teal))]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{content.title}</h4>
                          <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                            <span>{content.downloadCount} downloads</span>
                            <span>•</span>
                            <span>{content.viewCount} views</span>
                          </div>
                        </div>
                        <Badge className={content.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'}>
                          {content.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="webinars" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>College Webinars</CardTitle>
                  <Button size="sm" onClick={() => navigate('/dashboard/webinars')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Placeholder for college webinars - filtering from mock data or api */}
                    {[
                      { id: 1, title: 'Introduction to Cloud Computing', speaker: 'Dr. Sarah Smith', date: '2024-03-25' },
                      { id: 2, title: 'Future of AI in Education', speaker: 'Prof. Alan Turing', date: '2024-04-02' },
                    ].map((webinar) => (
                      <div
                        key={webinar.id}
                        className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 dark:border-slate-700"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10">
                          <Video className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{webinar.title}</h4>
                          <p className="text-sm text-slate-500">by {webinar.speaker}</p>
                        </div>
                        <Badge variant="outline">{new Date(webinar.date).toLocaleDateString()}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Pending Approvals ({pendingContent.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingContent.map((content) => (
                  <div
                    key={content.id}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 dark:border-slate-700"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                      <FolderOpen className="h-6 w-6 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{content.title}</h4>
                      <p className="text-sm text-slate-500">by {content.uploaderName}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="text-green-500">
                        <CheckCircle className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500">
                        <XCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
                {pendingContent.length === 0 && (
                  <div className="py-8 text-center text-slate-500">
                    No pending approvals
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Engagement Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-[hsl(var(--navy))]" />
                Engagement Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
                  <svg className="h-full w-full -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-slate-100 dark:text-slate-800"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(college?.stats.engagementScore || 0) * 3.52} 352`}
                      className="text-[hsl(var(--teal))]"
                    />
                  </svg>
                  <span className="absolute text-3xl font-bold">{college?.stats.engagementScore}</span>
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  Your college is performing excellently!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListRestart className="h-5 w-5 text-[hsl(var(--orange))]" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 1, action: 'New registration', target: 'Tech-A-Thon 2024', time: '2h ago' },
                  { id: 2, action: 'Content approved', target: 'Operating Systems Notes', time: '4h ago' },
                  { id: 3, action: 'New webinar scheduled', target: 'Career Guidance', time: '6h ago' },
                  { id: 4, action: 'New student joined', target: 'CS Department', time: '1d ago' },
                ].map((activity) => (
                  <div key={activity.id} className="flex gap-3 text-sm">
                    <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[hsl(var(--teal))]" />
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-slate-500">{activity.target}</p>
                      <span className="text-xs text-slate-400">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Content Downloads</span>
                  <span className="font-semibold">{college?.stats.totalContent}</span>
                </div>
                <Progress value={70} className="mt-2 h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Event Attendance</span>
                  <span className="font-semibold">85%</span>
                </div>
                <Progress value={85} className="mt-2 h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Hackathon Participation</span>
                  <span className="font-semibold">62%</span>
                </div>
                <Progress value={62} className="mt-2 h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Sarah Chen', points: 2500, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
                  { name: 'Mike Ross', points: 2350, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
                  { name: 'Emma Wilson', points: 2200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
                ].map((student, i) => (
                  <div key={student.name} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold dark:bg-slate-800">
                      {i + 1}
                    </span>
                    <img src={student.avatar} alt={student.name} className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{student.name}</p>
                    </div>
                    <span className="text-sm font-bold text-[hsl(var(--teal))]">{student.points}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CollegeAdminDashboard;
