import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, Calendar, Trophy, Globe } from 'lucide-react';
import { useAuthStore } from '@/store';
import { facultyApi } from '@/lib/api';
import { toast } from 'sonner';

const FacultyHackathonsDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [hackathons, setHackathons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        loadHackathons();
    }, [page]);

    const loadHackathons = async () => {
        try {
            setLoading(true);
            const response: any = await facultyApi.getHackathons(page, 12);
            // Handle both Page object and direct list
            const hackathonsList = Array.isArray(response) ? response : (response?.content || []);
            setHackathons(hackathonsList);
            setTotalPages(response.totalPages || 0);
        } catch (error: any) {
            console.error('Failed to load hackathons:', error);
            toast.error('Failed to load hackathons');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this hackathon?')) return;

        try {
            await facultyApi.deleteHackathon(id);
            toast.success('Hackathon deleted successfully');
            loadHackathons();
        } catch (error: any) {
            console.error('Failed to delete hackathon:', error);
            toast.error('Failed to delete hackathon');
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-4 w-64 mt-2" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-48" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center"
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Hackathons</h1>
                    <p className="text-muted-foreground">Manage hackathons you have organized</p>
                </div>
                <Button onClick={() => navigate('/dashboard/faculty/hackathons/create')}>
                    <Plus className="mr-2 h-4 w-4" /> Create Hackathon
                </Button>
            </motion.div>

            {hackathons.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <Trophy className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No hackathons yet</h3>
                        <p className="text-slate-500 mb-4">Create your first hackathon to get started</p>
                        <Button onClick={() => navigate('/dashboard/faculty/hackathons/create')}>
                            <Plus className="mr-2 h-4 w-4" /> Create Hackathon
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {hackathons.map((hackathon, index) => (
                            <motion.div
                                key={hackathon.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/dashboard/faculty/hackathons/${hackathon.id}`)}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="line-clamp-2">{hackathon.title}</CardTitle>
                                                <CardDescription className="mt-1">
                                                    {hackathon.startDate ? new Date(hackathon.startDate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    }) : 'TBD'}
                                                </CardDescription>
                                            </div>
                                            <Badge variant={hackathon.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                                                {hackathon.status?.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    <span>{hackathon.registeredCount || 0} registered</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Globe className="h-4 w-4" />
                                                    <span className="capitalize">{hackathon.mode || 'Online'}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => navigate(`/dashboard/faculty/hackathons/${hackathon.id}/edit`)}
                                                >
                                                    <Edit className="h-4 w-4 mr-1" /> Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(hackathon.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                            >
                                Previous
                            </Button>
                            <span className="flex items-center px-4 text-sm text-slate-600">
                                Page {page + 1} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FacultyHackathonsDashboard;
