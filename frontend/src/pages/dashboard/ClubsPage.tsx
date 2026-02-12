import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Users,
    MapPin,
    Filter,
    X,
    Grid3x3,
    List,
    CheckCircle2,
    BookOpen,
    Calendar,
    MessageSquare,
    Files,
    ChevronRight,
    Trophy,
    Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import type { Club } from '@/types';

// Enhanced Mock Data
const MOCK_CLUBS: Club[] = [
    {
        id: '1',
        name: 'AI & Robotics Club',
        description: 'Exploring the frontiers of Artificial Intelligence and Robotics. Led by Prof. Anderson from the CS Department.',
        collegeName: 'Engineering & Technology',
        collegeId: 'eng-1',
        category: 'Technology',
        bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89f55137256b',
        logoUrl: 'https://images.unsplash.com/photo-1546776310-a51d3dd0e8d5?w=400&h=400&fit=crop',
        isActive: true,
        createdAt: new Date().toISOString(),
        facultyAdvisorName: 'Prof. Anderson',
        tags: 'AI, Robotics, ML',
        achievements: 'Winner of National Robotics Championship 2024'
    },
    {
        id: '2',
        name: 'Debate & Oratory Society',
        description: 'Fostering critical thinking and public speaking skills. Mentored by Dr. Williams. Weekly sessions on current affairs.',
        collegeName: 'Arts & Humanities',
        collegeId: 'arts-1',
        category: 'Debate',
        bannerUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655',
        isActive: true, // Assuming active
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        facultyAdvisorName: 'Dr. Williams',
        tags: 'Public Speaking, Debate, Politics'
    },
    {
        id: '3',
        name: 'Eco-Warriors',
        description: 'Dedicated to environmental sustainability and green initiatives on campus. Supported by the Environmental Science Dept.',
        collegeName: 'Science',
        collegeId: 'sci-1',
        category: 'Social Cause',
        bannerUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
        isActive: true,
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        facultyAdvisorName: 'Prof. Green',
        tags: 'Environment, Sustainability, Nature'
    },
    {
        id: '4',
        name: 'FinTech Enthusiasts',
        description: 'Understanding the intersection of Finance and Technology. Workshops on Blockchain, Crypto, and Stock Markets.',
        collegeName: 'Business School',
        collegeId: 'bus-1',
        category: 'Finance',
        bannerUrl: 'https://images.unsplash.com/photo-1611974765270-ca1258822981',
        isActive: true,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        facultyAdvisorName: 'Dr. Markets',
        tags: 'Finance, Tech, Crypto'
    },
    {
        id: '5',
        name: 'Creative Arts Club',
        description: 'A space for painters, sculptors, and digital artists to collaborate and showcase their work.',
        collegeName: 'Arts & Design',
        collegeId: 'art-1',
        category: 'Arts',
        bannerUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
        isActive: true,
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
        facultyAdvisorName: 'Prof. Arter',
        tags: 'Art, Design, Creativity'
    }
];

const ClubsPage = () => {
    const navigate = useNavigate();
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [myClubsSearch, setMyClubsSearch] = useState('');
    const [debouncedMyClubsSearch, setDebouncedMyClubsSearch] = useState('');

    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedCollege, setSelectedCollege] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'name' | 'members' | 'recent'>('name');

    // Mock user state
    const [joinedClubs, setJoinedClubs] = useState<Set<string>>(new Set(['1', '4']));
    const [joiningClubId, setJoiningClubId] = useState<string | null>(null);

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 800));
                setClubs(MOCK_CLUBS);
            } catch (error) {
                console.error("Failed to fetch clubs:", error);
                toast.error("Failed to load clubs");
            } finally {
                setLoading(false);
            }
        };
        fetchClubs();
    }, []);

    // Debounce effects for filtering
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedMyClubsSearch(myClubsSearch), 300);
        return () => clearTimeout(timer);
    }, [myClubsSearch]);

    const handleJoinClub = async (clubId: string, clubName: string) => {
        setJoiningClubId(clubId);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            setJoinedClubs(prev => new Set(prev).add(clubId));
            toast.success(`Successfully joined ${clubName}!`, {
                description: "You'll now receive updates from this club.",
            });
        } catch (error) {
            toast.error("Failed to join club");
        } finally {
            setJoiningClubId(null);
        }
    };

    const handleLeaveClub = async (clubId: string, clubName: string) => {
        setJoiningClubId(clubId);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            setJoinedClubs(prev => {
                const newSet = new Set(prev);
                newSet.delete(clubId);
                return newSet;
            });
            toast.info(`Left ${clubName}`, {
                description: "You have been removed from the club members list."
            });
        } catch (error) {
            toast.error("Failed to leave club");
        } finally {
            setJoiningClubId(null);
        }
    };

    // Derived State
    const categories = ['all', ...new Set(clubs.map(club => club.category).filter((c): c is string => !!c))];
    const colleges = ['all', ...new Set(clubs.map(club => club.collegeName))];

    const filteredDiscoveryClubs = clubs
        .filter(club => {
            const matchesSearch =
                club.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                club.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                club.collegeName.toLowerCase().includes(debouncedSearch.toLowerCase());

            const matchesCategory = selectedCategory === 'all' || club.category === selectedCategory;
            const matchesCollege = selectedCollege === 'all' || club.collegeName === selectedCollege;

            return matchesSearch && matchesCategory && matchesCollege;
        })
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            return 0;
        });

    const myJoinedClubsList = clubs
        .filter(club => joinedClubs.has(club.id))
        .filter(club =>
            club.name.toLowerCase().includes(debouncedMyClubsSearch.toLowerCase()) ||
            club.description.toLowerCase().includes(debouncedMyClubsSearch.toLowerCase())
        );

    const clearFilters = () => {
        setSelectedCategory('all');
        setSelectedCollege('all');
        setSearchQuery('');
    };

    const hasActiveFilters = selectedCategory !== 'all' || selectedCollege !== 'all' || searchQuery !== '';

    // Specialized Card for Joined Clubs
    const JoinedClubCard = ({ club }: { club: Club }) => (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group h-full"
        >
            <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[hsl(var(--teal))] to-[hsl(var(--navy))]" />
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="relative">
                            <img
                                src={club.logoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${club.id}`}
                                alt={club.name}
                                className="h-16 w-16 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-800 shadow-sm"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-slate-900">
                                MEMBER
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg leading-tight truncate">{club.name}</h3>
                            <p className="text-xs text-slate-500 mt-1 truncate">{club.collegeName}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="text-[10px] h-5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    Core Team
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-6 py-4 border-t border-b border-slate-100 dark:border-slate-800">
                        <div className="text-center">
                            <p className="text-xl font-bold text-slate-900 dark:text-white">128</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Members</p>
                        </div>
                        <div className="text-center border-l border-r border-slate-100 dark:border-slate-800">
                            <p className="text-xl font-bold text-slate-900 dark:text-white">3</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Events</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-slate-900 dark:text-white">1</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Hackathon</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-6">
                        <Button variant="outline" size="sm" className="h-9 w-full flex-col gap-0.5 px-0 hover:bg-slate-50 hover:text-[hsl(var(--navy))]" onClick={() => navigate(`/dashboard/student/clubs/${club.id}`)}>
                            <Users className="h-4 w-4" />
                            <span className="text-[9px]">View</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 w-full flex-col gap-0.5 px-0 hover:bg-slate-50 hover:text-[hsl(var(--navy))]" onClick={() => navigate(`/dashboard/student/clubs/${club.id}/calendar`)}>
                            <Calendar className="h-4 w-4" />
                            <span className="text-[9px]">Calendar</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 w-full flex-col gap-0.5 px-0 hover:bg-slate-50 hover:text-[hsl(var(--navy))]" onClick={() => navigate(`/dashboard/student/clubs/${club.id}/discussions`)}>
                            <MessageSquare className="h-4 w-4" />
                            <span className="text-[9px]">Discuss</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 w-full flex-col gap-0.5 px-0 hover:bg-slate-50 hover:text-[hsl(var(--navy))]" onClick={() => navigate(`/dashboard/student/clubs/${club.id}/resources`)}>
                            <Files className="h-4 w-4" />
                            <span className="text-[9px]">Files</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    // Standard Discovery Card
    const ClubCard = ({ club, isJoined }: { club: Club, isJoined: boolean }) => (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -5 }}
            className="h-full"
        >
            <Card className="h-full flex flex-col group hover:shadow-2xl hover:border-[hsl(var(--teal))] transition-all duration-300 overflow-hidden border-slate-200 dark:border-slate-800">
                <div
                    className="h-40 w-full relative overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/dashboard/student/clubs/${club.id}`)}
                >
                    {club.bannerUrl ? (
                        <div className="w-full h-full relative">
                            <img
                                src={club.bannerUrl}
                                alt={club.name}
                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </div>
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[hsl(var(--navy))]/20 to-[hsl(var(--teal))]/20">
                            <Users className="h-16 w-16 text-[hsl(var(--navy))]/30" />
                        </div>
                    )}

                    {club.logoUrl && (
                        <motion.div
                            className="absolute -bottom-8 left-6 h-16 w-16 rounded-xl border-4 border-white bg-white shadow-xl dark:border-slate-900 overflow-hidden"
                        >
                            <img src={club.logoUrl} alt="logo" className="h-full w-full object-cover" />
                        </motion.div>
                    )}

                    <div className="absolute top-4 right-4 flex gap-2">
                        {isJoined && (
                            <Badge className="bg-green-500/90 backdrop-blur-sm text-white border-0 shadow-lg">
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Member
                            </Badge>
                        )}
                        <Badge variant="secondary" className="backdrop-blur-md bg-white/20 text-white border-white/20">
                            {club.category}
                        </Badge>
                    </div>
                </div>

                <CardHeader className="pt-10 pb-2">
                    <div className="space-y-1">
                        <CardTitle className="text-xl group-hover:text-[hsl(var(--teal))] transition-colors line-clamp-1">
                            {club.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 text-xs">
                            <MapPin className="h-3 w-3" />
                            {club.collegeName}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4 py-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 min-h-[2.5rem]">
                        {club.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>120+ Members</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            <span>Active</span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="border-t border-slate-100 p-4 dark:border-slate-800 grid grid-cols-2 gap-2 mt-auto">
                    <Button
                        variant="secondary"
                        className="w-full text-xs"
                        onClick={() => navigate(`/dashboard/student/clubs/${club.id}`)}
                    >
                        View Details
                    </Button>
                    {isJoined ? (
                        <Button
                            variant="outline"
                            className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:hover:bg-red-900/20 text-xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLeaveClub(club.id, club.name);
                            }}
                            disabled={joiningClubId === club.id}
                        >
                            {joiningClubId === club.id ? 'Leaving...' : 'Leave'}
                        </Button>
                    ) : (
                        <Button
                            className="w-full bg-[hsl(var(--navy))] text-white hover:bg-[hsl(var(--navy))]/90 text-xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleJoinClub(club.id, club.name)
                            }}
                            disabled={joiningClubId === club.id}
                        >
                            {joiningClubId === club.id ? 'Joining...' : 'Join Now'}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );

    return (
        <div className="space-y-8 min-h-screen pb-10">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight">Student Communities</h1>
                <p className="text-slate-500">Discover, join, and lead student organizations.</p>
            </div>

            <Tabs defaultValue="my-clubs" className="space-y-8">
                <TabsList className="bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl w-full sm:w-auto inline-flex h-auto">
                    <TabsTrigger
                        value="my-clubs"
                        className="rounded-lg px-6 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[hsl(var(--navy))] data-[state=active]:shadow-sm transition-all"
                    >
                        My Joined Clubs
                        <Badge className="ml-2 bg-[hsl(var(--navy))] text-white h-5 px-1.5 rounded-full text-[10px]">
                            {joinedClubs.size}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                        value="discover"
                        className="rounded-lg px-6 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[hsl(var(--navy))] data-[state=active]:shadow-sm transition-all"
                    >
                        Discover Clubs
                    </TabsTrigger>
                </TabsList>

                {/* My Clubs Tab */}
                <TabsContent value="my-clubs" className="space-y-6 focus-visible:outline-none">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Search your clubs..."
                                className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-[hsl(var(--teal))]"
                                value={myClubsSearch}
                                onChange={(e) => setMyClubsSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <Skeleton key={i} className="h-64 rounded-2xl" />
                                ))
                            ) : myJoinedClubsList.length > 0 ? (
                                myJoinedClubsList.map((club) => (
                                    <JoinedClubCard key={club.id} club={club} />
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full py-16 flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl"
                                >
                                    <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                        <BookOpen className="h-10 w-10 text-slate-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">No clubs found</h3>
                                    <p className="text-slate-500 max-w-sm mt-2">
                                        {myClubsSearch
                                            ? "We couldn't find any joined clubs matching your search."
                                            : "You haven't joined any clubs yet. Switch to the 'Discover' tab to explore!"}
                                    </p>
                                    {!myClubsSearch && (
                                        <Button
                                            className="mt-6 bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/90"
                                            onClick={() => document.querySelector<HTMLButtonElement>('[value="discover"]')?.click()}
                                        >
                                            Explore Clubs
                                        </Button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </TabsContent>

                {/* Discover Tab */}
                <TabsContent value="discover" className="space-y-6 focus-visible:outline-none">
                    {/* Filter Bar */}
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Search all clubs..."
                                className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                            <Button
                                variant={showFilters ? "default" : "outline"}
                                className="gap-2 h-11 border-slate-200 dark:border-slate-800"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="h-4 w-4" />
                                Filters
                                {hasActiveFilters && (
                                    <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-[hsl(var(--teal))] text-white">!</Badge>
                                )}
                            </Button>
                            <select
                                className="h-11 rounded-md border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus:ring-[hsl(var(--teal))]"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                            >
                                <option value="name">Sort by Name</option>
                                <option value="recent">Newest First</option>
                            </select>

                            <div className="flex gap-1 border border-slate-200 dark:border-slate-800 rounded-lg p-1 bg-white dark:bg-slate-900">
                                <Button
                                    variant={viewMode === 'grid' ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="h-9 w-9 p-0"
                                >
                                    <Grid3x3 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className="h-9 w-9 p-0"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Expandable Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Category</label>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map((cat) => (
                                                <Badge
                                                    key={cat}
                                                    variant={selectedCategory === cat ? 'default' : 'outline'}
                                                    className="cursor-pointer hover:bg-[hsl(var(--teal))]/10"
                                                    onClick={() => setSelectedCategory(cat)}
                                                >
                                                    {cat === 'all' ? 'All' : cat}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">College</label>
                                        <select
                                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                                            value={selectedCollege}
                                            onChange={(e) => setSelectedCollege(e.target.value)}
                                        >
                                            {colleges.map((col) => (
                                                <option key={col} value={col}>{col === 'all' ? 'All Colleges' : col}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={clearFilters}>
                                            <X className="mr-2 h-4 w-4" /> Reset Filters
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Results Grid */}
                    <div className={viewMode === 'grid' ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-4"}>
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-80 rounded-2xl" />
                            ))
                        ) : filteredDiscoveryClubs.length > 0 ? (
                            filteredDiscoveryClubs.map((club) => (
                                <ClubCard key={club.id} club={club} isJoined={joinedClubs.has(club.id)} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-slate-500">
                                No clubs found matching your criteria.
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ClubsPage;
