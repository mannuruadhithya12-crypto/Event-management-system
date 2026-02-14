import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { webinarApi } from '@/lib/api';
import { toast } from 'sonner';
import {
    Users,
    Video,
    Calendar,
    Clock,
    MoreVertical,
    Plus,
    Pencil,
    Trash2,
    Search,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Link, useNavigate } from 'react-router-dom';
import type { Webinar } from '@/types';

const AdminWebinarsPage = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [webinars, setWebinars] = useState<Webinar[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [analytics, setAnalytics] = useState<any>(null);

    useEffect(() => {
        fetchWebinars();
        fetchAnalytics();
    }, []);

    const fetchWebinars = async () => {
        setLoading(true);
        try {
            const data = await webinarApi.getAll(); // Fetch all webinars (backend filters by college if applicable)
            setWebinars(data);
        } catch (error) {
            console.error("Failed to fetch webinars", error);
            toast.error("Failed to load webinars");
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const data = await webinarApi.getAnalytics();
            setAnalytics(data);
        } catch (error) {
            console.error("Failed to fetch analytics", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this webinar?')) return;

        try {
            await webinarApi.delete(id);
            toast.success('Webinar deleted successfully');
            setWebinars(webinars.filter(w => w.id !== id));
        } catch (error) {
            toast.error('Failed to delete webinar');
        }
    };

    const filteredWebinars = webinars.filter(webinar =>
        webinar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        webinar.speakerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Webinar Management</h1>
                    <p className="text-slate-500 font-medium">Create, edit, and manage webinars for your students.</p>
                </div>
                <Link to="/dashboard/college-admin/webinars/create">
                    <Button className="rounded-xl bg-blue-600 font-bold hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" /> Create Webinar
                    </Button>
                </Link>
            </div>

            {/* Analytics Stats */}
            {!loading && analytics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="rounded-[2rem] border-none shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Total Webinars</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black">{analytics.totalWebinars}</div>
                            <p className="text-xs mt-2 opacity-70">Published and upcoming sessions</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] border-none shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Total Registrations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black">{analytics.totalRegistrations}</div>
                            <p className="text-xs mt-2 opacity-70">Students signed up across all webinars</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] border-none shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Avg. Attendance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black">{analytics.averageAttendance?.toFixed(1) || 0}</div>
                            <p className="text-xs mt-2 opacity-70">Average students per session</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Webinars Table */}
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 p-8 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold">All Webinars</CardTitle>
                        <CardDescription>View and manage all scheduled sessions.</CardDescription>
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search webinars..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50 dark:bg-slate-800/20">
                            <TableRow>
                                <TableHead className="w-[300px] pl-8 font-bold">Webinar Details</TableHead>
                                <TableHead className="font-bold">Speaker</TableHead>
                                <TableHead className="font-bold">Schedule</TableHead>
                                <TableHead className="font-bold">Registrations</TableHead>
                                <TableHead className="font-bold">Status</TableHead>
                                <TableHead className="text-right pr-8 font-bold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell>
                                </TableRow>
                            ) : filteredWebinars.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">No webinars found.</TableCell>
                                </TableRow>
                            ) : (
                                filteredWebinars.map((webinar) => (
                                    <TableRow key={webinar.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <TableCell className="pl-8 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-white text-base">{webinar.title}</span>
                                                <span className="text-xs text-slate-500">{webinar.mode} • {webinar.hostCollege}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                                                    {webinar.speakerName.charAt(0)}
                                                </div>
                                                <span className="font-medium text-sm">{webinar.speakerName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-xs font-medium text-slate-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{new Date(webinar.startDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{new Date(webinar.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-slate-400" />
                                                <span className="font-bold">{webinar.registeredCount} / {webinar.maxParticipants}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`rounded-lg px-3 py-1 ${webinar.status === 'UPCOMING' ? 'bg-blue-500/10 text-blue-500' :
                                                webinar.status === 'ONGOING' ? 'bg-green-500/10 text-green-500 animate-pulse' :
                                                    webinar.status === 'COMPLETED' ? 'bg-slate-500/10 text-slate-500' :
                                                        'bg-red-500/10 text-red-500'
                                                }`}>
                                                {webinar.status}
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
                                                    <DropdownMenuItem onClick={() => navigate(`/student/webinars/${webinar.id}`)}>
                                                        <Video className="mr-2 h-4 w-4" /> View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => navigate(`/dashboard/college-admin/webinars/edit/${webinar.id}`)}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(webinar.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminWebinarsPage;
