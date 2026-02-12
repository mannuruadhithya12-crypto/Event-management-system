import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Calendar,
  Users,
  FolderOpen,
  BarChart3,
  Plus,
  ArrowRight,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store';
import { mockHackathons, mockEvents, mockContent } from '@/data/mockData';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const myHackathons = mockHackathons.filter(h => h.organizerId === '2');
  const myEvents = mockEvents.filter(e => e.organizerId === '2');
  const myContent = mockContent.filter(c => c.uploaderId === '2');
  const pendingContent = mockContent.filter(c => c.status === 'pending');

  const stats = [
    { label: 'My Hackathons', value: myHackathons.length, icon: Trophy, color: 'text-[hsl(var(--orange))]', bgColor: 'bg-[hsl(var(--orange))]/10' },
    { label: 'My Events', value: myEvents.length, icon: Calendar, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'My Content', value: myContent.length, icon: FolderOpen, color: 'text-[hsl(var(--teal))]', bgColor: 'bg-[hsl(var(--teal))]/10' },
    { label: 'Total Views', value: '2.4K', icon: Eye, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
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
            Welcome, {user?.firstName}! 👋
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Manage your events, content, and track student engagement.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/dashboard/faculty/events/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
          <Button onClick={() => navigate('/dashboard/faculty/hackathons/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Hackathon
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
          <Tabs defaultValue="hackathons">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="hackathons">My Hackathons</TabsTrigger>
              <TabsTrigger value="events">My Events</TabsTrigger>
              <TabsTrigger value="content">My Content</TabsTrigger>
            </TabsList>

            <TabsContent value="hackathons" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Hackathons</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/faculty/hackathons')}>
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
                          <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                            <span>{hackathon.registeredTeams} teams</span>
                            <span>•</span>
                            <span>{hackathon.totalParticipants} participants</span>
                          </div>
                        </div>
                        <Badge>{hackathon.status.replace('_', ' ')}</Badge>
                      </div>
                    ))}
                    {myHackathons.length === 0 && (
                      <div className="py-8 text-center text-slate-500">
                        No hackathons yet. Create your first one!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Events</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/faculty/events')}>
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myEvents.map((event) => (
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
                  <CardTitle>Content</CardTitle>
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myContent.map((content) => (
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
          </Tabs>

          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Pending Content Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingContent.slice(0, 3).map((content) => (
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
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/dashboard/faculty/events/create')}>
                <Calendar className="mr-2 h-4 w-4" />
                Create Event
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/dashboard/faculty/hackathons/create')}>
                <Trophy className="mr-2 h-4 w-4" />
                Create Hackathon
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/dashboard/faculty/content/upload')}>
                <FolderOpen className="mr-2 h-4 w-4" />
                Upload Content
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/dashboard/faculty/analytics')}>
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Engagement Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Engagement This Month
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Event Registrations</span>
                  <span className="font-semibold">+24%</span>
                </div>
                <Progress value={75} className="mt-2 h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Content Downloads</span>
                  <span className="font-semibold">+18%</span>
                </div>
                <Progress value={60} className="mt-2 h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Hackathon Teams</span>
                  <span className="font-semibold">+42%</span>
                </div>
                <Progress value={85} className="mt-2 h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm">Approved "ML Notes"</p>
                    <p className="text-xs text-slate-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm">12 new event registrations</p>
                    <p className="text-xs text-slate-500">5 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10">
                    <Trophy className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm">New team registered for AI Challenge</p>
                    <p className="text-xs text-slate-500">1 day ago</p>
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

export default FacultyDashboard;
