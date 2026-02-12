import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Calendar,
  Users,
  Building2,
  FolderOpen,
  BarChart3,
  TrendingUp,
  ArrowRight,
  Plus,
  CheckCircle,
  XCircle,
  Shield,
  Globe,
  Activity,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockColleges, mockHackathons, mockEvents } from '@/data/mockData';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const platformStats = [
  { label: 'Total Colleges', value: 500, icon: Building2, color: 'text-blue-500', bgColor: 'bg-blue-500/10', change: '+12%' },
  { label: 'Total Students', value: 150000, icon: Users, color: 'text-[hsl(var(--teal))]', bgColor: 'bg-[hsl(var(--teal))]/10', change: '+18%' },
  { label: 'Total Hackathons', value: 1200, icon: Trophy, color: 'text-[hsl(var(--orange))]', bgColor: 'bg-[hsl(var(--orange))]/10', change: '+24%' },
  { label: 'Total Events', value: 5000, icon: Calendar, color: 'text-purple-500', bgColor: 'bg-purple-500/10', change: '+15%' },
];

const growthData = [
  { month: 'Jan', colleges: 420, students: 120000 },
  { month: 'Feb', colleges: 435, students: 125000 },
  { month: 'Mar', colleges: 450, students: 130000 },
  { month: 'Apr', colleges: 465, students: 135000 },
  { month: 'May', colleges: 480, students: 142000 },
  { month: 'Jun', colleges: 500, students: 150000 },
];

const categoryData = [
  { name: 'Tech', value: 45, color: '#3b82f6' },
  { name: 'Engineering', value: 30, color: '#14b8a6' },
  { name: 'Business', value: 15, color: '#f97316' },
  { name: 'Other', value: 10, color: '#8b5cf6' },
];

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  const recentColleges = mockColleges.slice(0, 4);
  const recentHackathons = mockHackathons.slice(0, 4);

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
            Platform Overview
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Monitor and manage the entire CollegeHub platform.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Globe className="mr-2 h-4 w-4" />
            Platform Status
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add College
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {platformStats.map((stat, index) => (
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

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Platform Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorColleges" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Area yAxisId="left" type="monotone" dataKey="colleges" stroke="#3b82f6" fillOpacity={1} fill="url(#colorColleges)" />
                  <Area yAxisId="right" type="monotone" dataKey="students" stroke="#14b8a6" fillOpacity={1} fill="url(#colorStudents)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[hsl(var(--navy))]" />
              College Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-slate-600">{cat.name} ({cat.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          <Tabs defaultValue="colleges">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="colleges">Colleges</TabsTrigger>
              <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="webinars">Webinars</TabsTrigger>
            </TabsList>

            <TabsContent value="colleges" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Colleges</CardTitle>
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentColleges.map((college) => (
                      <div
                        key={college.id}
                        className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 dark:border-slate-700"
                      >
                        <img
                          src={college.logo}
                          alt={college.name}
                          className="h-12 w-12 rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{college.name}</h4>
                          <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                            <span>{college.studentCount.toLocaleString()} students</span>
                            <span>•</span>
                            <span>{college.facultyCount} faculty</span>
                          </div>
                        </div>
                        <Badge className={college.isActive ? 'bg-green-500' : 'bg-slate-500'}>
                          {college.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hackathons" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Hackathons</CardTitle>
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentHackathons.map((hackathon) => (
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
                            <span>{hackathon.collegeName}</span>
                            <span>•</span>
                            <span>{hackathon.registeredTeams} teams</span>
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
                  <CardTitle>Recent Events</CardTitle>
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockEvents.slice(0, 4).map((event) => (
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
                            <span>{event.collegeName}</span>
                            <span>•</span>
                            <span>{event.registeredCount} registered</span>
                          </div>
                        </div>
                        <Badge variant="outline">{event.status.replace('_', ' ')}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="webinars" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Global Webinars</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/webinars')}>
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: 1, title: 'Data Science with Python', college: 'Tech University', date: '2024-03-28' },
                      { id: 2, title: 'Modern Web Architectures', college: 'Austin College', date: '2024-04-05' },
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
                          <p className="text-sm text-slate-500">{webinar.college}</p>
                        </div>
                        <Badge variant="outline">{new Date(webinar.date).toLocaleDateString()}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Platform Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                Platform Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">API Uptime</span>
                  <span className="font-semibold text-green-500">99.9%</span>
                </div>
                <Progress value={99.9} className="mt-2 h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Server Load</span>
                  <span className="font-semibold">42%</span>
                </div>
                <Progress value={42} className="mt-2 h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Database</span>
                  <span className="font-semibold text-green-500">Healthy</span>
                </div>
                <Progress value={95} className="mt-2 h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="mr-2 h-4 w-4" />
                Manage Colleges
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                Security Settings
              </Button>
            </CardContent>
          </Card>

          {/* Top Performing Colleges */}
          <Card>
            <CardHeader>
              <CardTitle>Top Colleges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockColleges.map((college, i) => (
                  <div key={college.id} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold dark:bg-slate-800">
                      {i + 1}
                    </span>
                    <img src={college.logo} alt={college.name} className="h-8 w-8 rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{college.name}</p>
                    </div>
                    <span className="text-sm font-bold text-[hsl(var(--teal))]">{college.stats.engagementScore}</span>
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

export default SuperAdminDashboard;
