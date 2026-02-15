import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Calendar, Clock, MapPin, Users, Video, User, ChevronRight } from 'lucide-react';
import { webinarApi } from '@/lib/api';
import type { Webinar } from '@/types';
import { useAuthStore } from '@/store';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export default function WebinarsPage() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const isMyRegistrationsView = location.pathname.includes('/my-registrations');

    const [webinars, setWebinars] = useState<Webinar[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterMode, setFilterMode] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        fetchWebinars();
    }, [user]);

    const fetchWebinars = async () => {
        try {
            setLoading(true);
            const data = await webinarApi.getAll(user?.id);
            setWebinars(data);
        } catch (error) {
            console.error('Failed to fetch webinars:', error);
            toast.error('Failed to load webinars');
        } finally {
            setLoading(false);
        }
    };

    const filteredWebinars = webinars.filter(webinar => {
        const matchesSearch =
            webinar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            webinar.speakerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            webinar.hostCollege.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesMode = filterMode === 'all' || (webinar.mode || '').toLowerCase() === filterMode.toLowerCase();
        const matchesStatus = filterStatus === 'all' || (webinar.status || '').toLowerCase() === filterStatus.toLowerCase();
        const matchesView = !isMyRegistrationsView || webinar.isRegistered;

        return matchesSearch && matchesMode && matchesStatus && matchesView;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'UPCOMING': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'ONGOING': return 'bg-green-500/10 text-green-400 border-green-500/20 animate-pulse';
            case 'COMPLETED': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
            case 'CANCELLED': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-400';
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const WebinarSkeleton = () => (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden animate-pulse">
            <div className="h-48 bg-slate-700/50" />
            <div className="p-5 space-y-4">
                <div className="h-6 bg-slate-700/50 rounded w-3/4" />
                <div className="h-4 bg-slate-700/50 rounded w-1/2" />
                <div className="space-y-2">
                    <div className="h-4 bg-slate-700/50 rounded w-full" />
                    <div className="h-4 bg-slate-700/50 rounded w-full" />
                </div>
                <div className="pt-4 border-t border-slate-700/50 flex justify-between">
                    <div className="h-8 bg-slate-700/50 rounded w-20" />
                    <div className="h-8 bg-slate-700/50 rounded w-24" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                        Webinars & Workshops
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Learn from industry experts and stay ahead of the curve
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        to={isMyRegistrationsView ? "/dashboard/webinars" : "/dashboard/webinars/my-registrations"}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all border border-slate-700"
                    >
                        {isMyRegistrationsView ? 'View All Webinars' : 'My Registrations'}
                    </Link>
                    {user?.role === 'college_admin' && (
                        <Link
                            to="/dashboard/college-admin/webinars/create"
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                        >
                            Create Webinar
                        </Link>
                    )}
                </div>
            </div>

            {/* Filters & Search */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="md:col-span-6 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title, speaker, or college..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div className="md:col-span-3">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={filterMode}
                            onChange={(e) => setFilterMode(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                        >
                            <option value="all">All Modes</option>
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>
                </div>
                <div className="md:col-span-3">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                    >
                        <option value="all">All Statuses</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Webinar Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => <WebinarSkeleton key={i} />)}
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence>
                        {filteredWebinars.map((webinar) => (
                            <motion.div
                                key={webinar.id}
                                variants={itemVariants}
                                layout
                                className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
                            >
                                {/* Banner Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={webinar.bannerImage || 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800'}
                                        alt={webinar.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
                                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${getStatusColor(webinar.status || 'UPCOMING')}`}>
                                        {webinar.status || 'UPCOMING'}
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-xl font-bold text-white line-clamp-2 mb-1 group-hover:text-blue-400 transition-colors">
                                            {webinar.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-300">
                                            <User className="w-4 h-4 text-blue-400" />
                                            <span>{webinar.speakerName}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 space-y-4">
                                    <div className="flex justify-between items-center text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{webinar.startDate ? new Date(webinar.startDate).toLocaleDateString() : 'TBD'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            <span>{webinar.startDate ? new Date(webinar.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            {webinar.mode === 'Online' ? <Video className="w-4 h-4 text-green-400" /> : <MapPin className="w-4 h-4 text-red-400" />}
                                            <span>{webinar.mode} • {webinar.hostCollege}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Users className="w-4 h-4" />
                                            <span>{webinar.registeredCount} / {webinar.maxParticipants}</span>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/dashboard/webinars/${webinar.id}`)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${webinar.status === 'ONGOING' && webinar.isRegistered
                                                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/25 animate-bounce'
                                                    : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white'
                                                }`}
                                        >
                                            {webinar.status === 'ONGOING' && webinar.isRegistered ? 'Join Now' : 'View Details'}
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {!loading && filteredWebinars.length === 0 && (
                <div className="text-center py-20 space-y-4">
                    <div className="bg-slate-800/50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                        <Search className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">No webinars found</h3>
                    <p className="text-gray-400">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
}
