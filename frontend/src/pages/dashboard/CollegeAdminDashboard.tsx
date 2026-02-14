import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store';
import { hackathonApi, analyticsApi } from '@/lib/api';
import { toast } from 'sonner';
import {
  Users,
  Trophy,
  Calendar,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  MoreVertical,
  FileText,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CollegeAdminDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Mocking functionality for now or fetch actual admin stats
      // const data = await analyticsApi.getCollegeAnalytics(user.collegeId); 
      // setStats(data);

      const hackathonsData = await hackathonApi.getAll(); // Filter by college in real app
      setHackathons(hackathonsData);

      setStats({
        totalStudents: 1250,
        activeHackathons: hackathonsData.filter((h: any) => h.status === 'OPEN').length,
        totalRegistrations: 450,
        completionRate: "85%"
      });
    } catch (error) {
      console.error("Failed to fetch admin data", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    // Implement status update logic (e.g., Approve/Reject hackathon)
    toast.info(`Status update to ${newStatus} coming soon!`);
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 font-medium">Manage your college's hackathons and performance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl font-bold">
            <Filter className="mr-2 h-4 w-4" /> Filter View
          </Button>
          <Button className="rounded-xl bg-[hsl(var(--teal))] font-bold hover:bg-[hsl(var(--teal))]/90">
            + Create Hackathon
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-[2rem] border-none shadow-lg bg-white dark:bg-slate-900">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Students</p>
              <h3 className="text-4xl font-black mt-2 text-slate-900 dark:text-white">
                {stats?.totalStudents || 0}
              </h3>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
              <Users className="h-7 w-7" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-lg bg-white dark:bg-slate-900">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active Events</p>
              <h3 className="text-4xl font-black mt-2 text-slate-900 dark:text-white">
                {stats?.activeHackathons || 0}
              </h3>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
              <Activity className="h-7 w-7" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-lg bg-white dark:bg-slate-900">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Registrations</p>
              <h3 className="text-4xl font-black mt-2 text-slate-900 dark:text-white">
                {stats?.totalRegistrations || 0}
              </h3>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center">
              <FileText className="h-7 w-7" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-lg bg-white dark:bg-slate-900">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Completion</p>
              <h3 className="text-4xl font-black mt-2 text-slate-900 dark:text-white">
                {stats?.completionRate || "0%"}
              </h3>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center">
              <TrendingUp className="h-7 w-7" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hackathon Management Table */}
      <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 p-8">
          <CardTitle className="text-xl font-bold">Hackathon Management</CardTitle>
          <CardDescription>Manage approval status and view details of all hackathons.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/20">
              <TableRow>
                <TableHead className="w-[300px] pl-8 font-bold">Hackathon</TableHead>
                <TableHead className="font-bold">Mode</TableHead>
                <TableHead className="font-bold">Registered</TableHead>
                <TableHead className="font-bold">Dates</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right pr-8 font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hackathons.map((h) => (
                <TableRow key={h.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <TableCell className="pl-8 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-white text-base">{h.title}</span>
                      <span className="text-xs text-slate-500">{h.hostCollege || "Your College"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-lg">{h.mode}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="font-bold">124</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs font-medium text-slate-500">
                      <span>Start: {h.startDate}</span>
                      <span>End: {h.endDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`rounded-lg px-3 py-1 ${h.approvalStatus === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' :
                        h.approvalStatus === 'REJECTED' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' :
                          'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                      }`}>
                      {h.approvalStatus || 'PENDING'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(h.id, 'APPROVED')} className="text-emerald-600 font-bold focus:text-emerald-600 focus:bg-emerald-50">
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(h.id, 'REJECTED')} className="text-red-600 font-bold focus:text-red-600 focus:bg-red-50">
                          <XCircle className="mr-2 h-4 w-4" /> Reject
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Event</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollegeAdminDashboard;
