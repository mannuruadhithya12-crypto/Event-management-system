import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardCheck,
  Clock,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { judgeService, type JudgeStats } from '@/services/judgeService';
import { Button } from '@/components/ui/button';

const JudgeDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<JudgeStats>({
    assignedEvents: 0,
    pendingEvaluations: 0,
    completedEvaluations: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await judgeService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch judge stats", error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Assigned Events',
      value: stats.assignedEvents,
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      link: '/dashboard/judge/events'
    },
    {
      title: 'Pending Evaluations',
      value: stats.pendingEvaluations,
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      link: '/dashboard/judge/events'
    },
    {
      title: 'Completed',
      value: stats.completedEvaluations,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      link: '/dashboard/judge/history'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome, Judge
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your assigned events and evaluate submissions.
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => navigate('/dashboard/judge/events')}>
            View Assigned Events
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => navigate(stat.link)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-card border border-border/50">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            Instructions
          </h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              Select an event from "Assigned Events" to view submissions.
            </li>
            <li className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              Evaluate each team based on the provided rubric.
            </li>
            <li className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              You can save evaluations as "Draft" and edit them later.
            </li>
            <li className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              Once you submit a "Final" score, it cannot be changed.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JudgeDashboard;
