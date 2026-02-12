import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Calendar,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  ArrowRight,
  Zap,
  Star,
  Video,
  MessageSquare,
  Activity
} from 'lucide-react';
import ActivityTimeline from '@/components/ActivityTimeline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, useNotificationStore } from '@/store';
import { mockTeams, mockContent, mockCertificates, mockLeaderboard } from '@/data/mockData';
import { api, activityApi } from '@/lib/api';
import type { Hackathon, Event } from '@/types';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [myHackathons, setMyHackathons] = useState<Hackathon[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [upcomingWebinars, setUpcomingWebinars] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hackathons = await api.get<Hackathon[]>('/hackathons');
        setMyHackathons(hackathons.slice(0, 2));

        const events = await api.get<Event[]>('/events');
        setMyEvents(events.slice(0, 2));

        const webinars = await api.get<any[]>('/webinars');
        setUpcomingWebinars(webinars.slice(0, 2));

        if (user) {
          const activitiesData = await activityApi.getByUser(user.id);
          setActivities(activitiesData.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  const myTeams = mockTeams;
  const myCertificates = mockCertificates;
  const myRank = mockLeaderboard.find(entry => entry.userId === user?.id);

  const stats = [
    { label: 'Points', value: user?.points || 0, icon: Trophy, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
    { label: 'Hackathons', value: 3, icon: Zap, color: 'text-[hsl(var(--teal))]', bgColor: 'bg-[hsl(var(--teal))]/10' },
    { label: 'Events', value: 8, icon: Calendar, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'Certificates', value: myCertificates.length, icon: Award, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { label: 'Streak', value: user?.streak || 0, icon: Star, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
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
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Here's what's happening in your academic world today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {myRank && (
            <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 dark:bg-amber-900/20">
              <Trophy className="h-5 w-5 text-amber-500" />
              <span className="font-semibold text-amber-700 dark:text-amber-400">
                Rank #{myRank.rank}
              </span>
            </div>
          )}
          <Button onClick={() => navigate('/hackathons')}>
            Explore Hackathons
            <ArrowRight className="ml-2 h-4 w-4" />
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

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* My Hackathons */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[hsl(var(--orange))]" />
                My Hackathons
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/student/hackathons')}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myHackathons.map((hackathon) => (
                  <div
                    key={hackathon.id}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <img
                      src={hackathon.bannerImage}
                      alt={hackathon.title}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="truncate font-semibold">{hackathon.title}</h4>
                      <p className="text-sm text-slate-500">{hackathon.collegeName}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(hackathon.startDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          ${hackathon.prizePool.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline">{hackathon.status.replace('_', ' ')}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* My Teams */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[hsl(var(--teal))]" />
                My Teams
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/student/teams')}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myTeams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--navy))]/10">
                      <Users className="h-6 w-6 text-[hsl(var(--navy))]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{team.name}</h4>
                      <p className="text-sm text-slate-500">{team.hackathonName}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {team.members.slice(0, 3).map((member, i) => (
                            <img
                              key={member.id}
                              src={member.avatar}
                              alt={member.name}
                              className="h-6 w-6 rounded-full border-2 border-white dark:border-slate-800"
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-500">{team.members.length} members</span>
                      </div>
                    </div>
                    <Badge className={team.submissionStatus === 'submitted' ? 'bg-green-500' : ''}>
                      {team.submissionStatus.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Upcoming Events
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/student/events')}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-blue-500/10">
                      <span className="text-xs font-medium text-blue-500 uppercase">
                        {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-xl font-bold text-blue-500">
                        {new Date(event.startDate).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="truncate font-semibold">{event.title}</h4>
                      <p className="text-sm text-slate-500">{event.collegeName}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="capitalize">{event.mode}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">{event.eventType.replace('_', ' ')}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Progress to Next Rank */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Progress to Next Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              {myRank ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Current Rank</span>
                    <span className="font-semibold">#{myRank.rank}</span>
                  </div>
                  <div className="mt-2">
                    <Progress value={75} className="h-2" />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    250 more points to reach Rank #{myRank.rank - 1}
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-500">Start participating to earn points!</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Certificates */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                Certificates
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/student/certificates')}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 dark:border-slate-700"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                      <Award className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{cert.eventName || cert.hackathonName}</p>
                      <p className="text-xs text-slate-500 capitalize">{cert.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Forum Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-pink-500" />
                Community Activity
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/forum')}>
                View Forum
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { id: 1, title: 'How to optimize React performance?', author: 'John Doe', replies: 12 },
                  { id: 2, title: 'Upcoming hackathon in Austin!', author: 'Jane Smith', replies: 8 },
                  { id: 3, title: 'Best practices for REST APIs', author: 'Mike Ross', replies: 5 },
                ].map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10">
                      <MessageSquare className="h-5 w-5 text-pink-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{post.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-slate-500">by {post.author}</p>
                        <span className="text-xs text-slate-500">{post.replies} replies</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Daily Streak */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Daily Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
                    <span className="text-3xl font-bold text-amber-500">{user?.streak || 0}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">days streak</p>
                </div>
              </div>
              <div className="mt-4 flex justify-center gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div
                    key={day + i}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${i < 5 ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                      }`}
                  >
                    {day}
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

export default StudentDashboard;
