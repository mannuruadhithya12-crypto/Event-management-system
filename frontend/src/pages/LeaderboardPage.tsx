import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  Users,
  Calendar,
  Award,
  Flame,
  Search,
  Filter,
  Video,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockLeaderboard, mockColleges } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { analyticsApi } from '@/lib/api';
import { useEffect } from 'react';

const timeRanges = [
  { value: 'all', label: 'All Time' },
  { value: 'month', label: 'This Month' },
  { value: 'week', label: 'This Week' },
];

const LeaderboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [activeTab, setActiveTab] = useState('students');
  const [colleges, setColleges] = useState<any[]>(mockColleges);

  useEffect(() => {
    if (activeTab === 'colleges') {
      analyticsApi.getCollegeRankings()
        .then(data => setColleges(data))
        .catch(err => console.error('Error fetching college rankings:', err));
    }
  }, [activeTab]);

  const filteredLeaderboard = mockLeaderboard.filter((entry) => {
    if (searchQuery && !entry.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCollege && entry.collegeName !== mockColleges.find(c => c.id === selectedCollege)?.name) {
      return false;
    }
    return true;
  });

  const topThree = filteredLeaderboard.slice(0, 3);
  const rest = filteredLeaderboard.slice(3);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="relative mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20"
          >
            <Trophy className="h-10 w-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
          >
            Leaderboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-white/80"
          >
            Recognizing the most active and accomplished students on CollegeHub
          </motion.p>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-slate-200 bg-white px-4 pt-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent border-b-0 space-x-2">
              <TabsTrigger value="students" className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800">Students</TabsTrigger>
              <TabsTrigger value="colleges" className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800">Colleges</TabsTrigger>
              <TabsTrigger value="badges" className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800">Badges & Achievements</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Filters (only for students/colleges) */}
      {(activeTab === 'students' || activeTab === 'colleges') && (
        <section className="border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder={activeTab === 'students' ? "Search by name..." : "Search by college..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {activeTab === 'students' && (
                <Select value={selectedCollege} onValueChange={setSelectedCollege}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Colleges" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockColleges.map((college) => (
                      <SelectItem key={college.id} value={college.id}>
                        {college.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 py-12">
        {activeTab === 'students' && (
          <>
            {/* Top 3 Podium (Students) */}
            {topThree.length >= 3 && (
              <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:items-end mb-24">
                {/* 2nd Place */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="order-2 flex flex-col items-center lg:order-1"
                >
                  <div className="relative">
                    <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-slate-300 dark:border-slate-600">
                      <img
                        src={topThree[1]?.avatar}
                        alt={topThree[1]?.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-slate-400 text-lg font-bold text-white">
                      2
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <Medal className="mx-auto h-6 w-6 text-slate-400" />
                    <h3 className="mt-2 text-lg font-semibold">{topThree[1]?.name}</h3>
                    <p className="text-sm text-slate-500">{topThree[1]?.collegeName}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-400">
                      {topThree[1]?.points.toLocaleString()}
                    </p>
                  </div>
                </motion.div>

                {/* 1st Place */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0 }}
                  className="order-1 flex flex-col items-center lg:order-2"
                >
                  <div className="relative">
                    <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-amber-400 shadow-xl shadow-amber-500/30">
                      <img
                        src={topThree[0]?.avatar}
                        alt={topThree[0]?.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-lg font-bold text-white">
                      <Crown className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                      Champion
                    </Badge>
                    <h3 className="mt-2 text-xl font-semibold">{topThree[0]?.name}</h3>
                    <p className="text-sm text-slate-500">{topThree[0]?.collegeName}</p>
                    <p className="mt-1 text-3xl font-bold text-amber-500">
                      {topThree[0]?.points.toLocaleString()}
                    </p>
                  </div>
                </motion.div>

                {/* 3rd Place */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="order-3 flex flex-col items-center"
                >
                  <div className="relative">
                    <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-amber-700">
                      <img
                        src={topThree[2]?.avatar}
                        alt={topThree[2]?.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-amber-700 text-lg font-bold text-white">
                      3
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <Medal className="mx-auto h-6 w-6 text-amber-700" />
                    <h3 className="mt-2 text-lg font-semibold">{topThree[2]?.name}</h3>
                    <p className="text-sm text-slate-500">{topThree[2]?.collegeName}</p>
                    <p className="mt-1 text-2xl font-bold text-amber-700">
                      {topThree[2]?.points.toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Full Leaderboard Table (Students) */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold">Full Rankings</h2>

              <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-900">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Rank</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Student</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">College</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">
                          <div className="flex items-center justify-center gap-1">
                            <Trophy className="h-4 w-4" />
                            Hackathons
                          </div>
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">
                          <div className="flex items-center justify-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Events
                          </div>
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">
                          <div className="flex items-center justify-center gap-1">
                            <Award className="h-4 w-4" />
                            Certificates
                          </div>
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">
                          <div className="flex items-center justify-center gap-1">
                            <Flame className="h-4 w-4" />
                            Streak
                          </div>
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900 dark:text-white">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {filteredLeaderboard.map((entry, index) => (
                        <motion.tr
                          key={entry.userId}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.05 }}
                          className={cn(
                            "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                            index < 3 && "bg-amber-50/50 dark:bg-amber-900/10"
                          )}
                        >
                          <td className="px-6 py-4">
                            <span className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                              entry.rank === 1 && "bg-amber-400 text-white",
                              entry.rank === 2 && "bg-slate-400 text-white",
                              entry.rank === 3 && "bg-amber-700 text-white",
                              entry.rank > 3 && "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            )}>
                              {entry.rank}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={entry.avatar}
                                alt={entry.name}
                                className="h-10 w-10 rounded-full"
                              />
                              <span className="font-medium">{entry.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                            {entry.collegeName}
                          </td>
                          <td className="px-6 py-4 text-center text-sm">
                            {entry.hackathonsParticipated}
                          </td>
                          <td className="px-6 py-4 text-center text-sm">
                            {entry.eventsAttended}
                          </td>
                          <td className="px-6 py-4 text-center text-sm">
                            {entry.certificatesEarned}
                          </td>
                          <td className="px-6 py-4 text-center text-sm">
                            <span className="flex items-center justify-center gap-1">
                              <Flame className="h-4 w-4 text-orange-500" />
                              {entry.streakDays}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-lg font-bold text-[hsl(var(--navy))] dark:text-[hsl(var(--teal))]">
                              {entry.points.toLocaleString()}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'colleges' && (
          <div className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...colleges].sort((a, b) => b.stats.engagementScore - a.stats.engagementScore).map((college, i) => (
                <Card key={college.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-slate-300">#{(i + 1).toString().padStart(2, '0')}</span>
                      <img src={college.logo} alt={college.name} className="h-12 w-12 rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-bold">{college.name}</h4>
                        <p className="text-xs text-slate-500">{college.studentCount.toLocaleString()} Students</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[hsl(var(--teal))]">{college.stats.engagementScore}</p>
                        <p className="text-[10px] text-slate-400 uppercase">Score</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="rounded bg-slate-50 p-2 dark:bg-slate-800">
                        <p className="font-bold">{college.stats.totalHackathons}</p>
                        <p className="text-slate-500">Hackathons</p>
                      </div>
                      <div className="rounded bg-slate-50 p-2 dark:bg-slate-800">
                        <p className="font-bold">{college.stats.totalEvents}</p>
                        <p className="text-slate-500">Events</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Unlock Achievements</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Complete tasks and participate in events to earn exclusive badges.</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: 'Early Bird', description: 'Register for 5 events before the deadline.', icon: Flame, color: 'text-orange-500', bgColor: 'bg-orange-500/10', requirement: '5/5' },
                { name: 'Hackathon Hero', description: 'Participated in 3 major hackathons.', icon: Trophy, color: 'text-amber-500', bgColor: 'bg-amber-500/10', requirement: '2/3' },
                { name: 'Community Leader', description: 'Gain 50+ upvotes on forum posts.', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10', requirement: '12/50' },
                { name: 'Knowledge Seeker', description: 'Watch 10+ webinar recordings.', icon: Video, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10', requirement: '4/10' },
              ].map((badge) => (
                <Card key={badge.name} className="relative overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${badge.bgColor}`}>
                      <badge.icon className={`h-10 w-10 ${badge.color}`} />
                    </div>
                    <h3 className="font-bold">{badge.name}</h3>
                    <p className="mt-2 text-xs text-slate-500">{badge.description}</p>
                    <div className="mt-4">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">{badge.requirement} Completed</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
