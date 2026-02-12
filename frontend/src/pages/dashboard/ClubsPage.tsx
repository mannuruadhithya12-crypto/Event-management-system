import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Search,
    Users,
    MapPin,
    Calendar,
    ArrowRight,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { clubApi } from '@/lib/api';
import type { Club } from '@/types';

const ClubsPage = () => {
    const navigate = useNavigate();
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const data = await clubApi.getAll();
                setClubs(data);
            } catch (error) {
                console.error("Failed to fetch clubs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchClubs();
    }, []);

    const filteredClubs = clubs.filter(club =>
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.collegeName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold">Student Clubs</h1>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                        Explore and join communities that share your passion.
                    </p>
                </div>
                <Button onClick={() => navigate('/dashboard/clubs/create')}>
                    Start a Club
                </Button>
            </motion.div>

            {/* Search and Filter */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search clubs by name, category, or college..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                </Button>
            </div>

            {/* Clubs Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    // Skeletons
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-64 rounded-xl bg-slate-100 animate-pulse dark:bg-slate-800" />
                    ))
                ) : filteredClubs.length > 0 ? (
                    filteredClubs.map((club, index) => (
                        <motion.div
                            key={club.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="h-full flex flex-col hover:border-slate-300 transition-colors dark:hover:border-slate-600">
                                <div className="h-32 w-full bg-slate-100 relative dark:bg-slate-800 rounded-t-xl overflow-hidden">
                                    {club.bannerUrl ? (
                                        <img src={club.bannerUrl} alt={club.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-[hsl(var(--navy))]/10">
                                            <Users className="h-10 w-10 text-[hsl(var(--navy))]" />
                                        </div>
                                    )}
                                    {club.logoUrl && (
                                        <div className="absolute -bottom-6 left-6 h-12 w-12 rounded-full border-4 border-white bg-white shadow-sm dark:border-slate-900 overflow-hidden">
                                            <img src={club.logoUrl} alt="logo" className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                <CardHeader className="pt-8">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl">{club.name}</CardTitle>
                                            <CardDescription className="line-clamp-1">{club.collegeName}</CardDescription>
                                        </div>
                                        {club.isActive && <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</Badge>}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                                        {club.description}
                                    </p>
                                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            <span>{/* Count placeholder */} 24 members</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>Est. {new Date(club.createdAt).getFullYear()}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t border-slate-100 p-4 dark:border-slate-800">
                                    <Button variant="ghost" className="w-full justify-between group" onClick={() => navigate(`/dashboard/clubs/${club.id}`)}>
                                        View Club Details
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-slate-500">
                        <Users className="mx-auto h-12 w-12 opacity-20" />
                        <p className="mt-2 text-lg font-medium">No clubs found</p>
                        <p>Try adjusting your search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClubsPage;
