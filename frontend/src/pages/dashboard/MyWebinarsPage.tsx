import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar, Clock, Video, Download,
    ExternalLink, CheckCircle, Clock3, Award
} from 'lucide-react';
import { webinarApi } from '@/lib/api';
import type { WebinarRegistration } from '@/types';
import { useAuthStore } from '@/store';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function MyWebinarsPage() {
    const { user } = useAuthStore();
    const [registrations, setRegistrations] = useState<WebinarRegistration[]>([]);
    const [loading, setLoading] = useState(true);
    const [generatingId, setGeneratingId] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchRegistrations();
        }
    }, [user]);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            if (!user) return;
            const data = await webinarApi.getMyRegistrations(user.id);
            setRegistrations(data);
        } catch (error) {
            console.error('Failed to fetch registrations:', error);
            toast.error('Failed to load your registrations');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (webinarId: string) => {
        if (!user) return;
        try {
            const { url } = await webinarApi.join(webinarId, user.id);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Failed to join:', error);
            toast.error('Failed to join webinar');
        }
    };

    const handleGenerateCertificate = async (webinarId: string, registrationId: string) => {
        if (!user) return;
        setGeneratingId(registrationId);
        try {
            await webinarApi.generateCertificate(webinarId, user.id);
            toast.success('Certificate generated successfully!');
            fetchRegistrations();
        } catch (error) {
            console.error('Certificate generation failed:', error);
            toast.error('Failed to generate certificate');
        } finally {
            setGeneratingId(null);
        }
    };

    const handleDownloadCertificate = (webinarId: string) => {
        if (!user) return;
        const downloadUrl = `http://localhost:8080/api/webinars/${webinarId}/certificate/download?userId=${user.id}`;
        window.open(downloadUrl, '_blank');
    };

    const upcomingEvents = registrations.filter(r => r.status === 'UPCOMING' || r.status === 'ONGOING');
    const pastEvents = registrations.filter(r => r.status === 'COMPLETED' || r.status === 'CANCELLED');

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">My Registrations</h1>
                    <p className="text-gray-400 mt-2">Manage your scheduled webinars and history</p>
                </div>
                <Link
                    to="/student/webinars"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all border border-slate-700"
                >
                    Browse More
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="space-y-12">

                    {/* Upcoming Section */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Clock3 className="w-5 h-5 text-blue-400" />
                            Upcoming & Ongoing
                        </h2>

                        {upcomingEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {upcomingEvents.map((reg) => (
                                    <motion.div
                                        key={reg.id}
                                        className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${reg.status === 'ONGOING' ? 'bg-green-500/20 text-green-400 animate-pulse' : 'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {reg.status}
                                            </span>
                                            <Link to={`/student/webinars/${reg.webinarId}`} className="p-2 hover:bg-slate-700 rounded-lg text-gray-400 hover:text-white transition-colors">
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{reg.webinarTitle}</h3>
                                        <p className="text-sm text-gray-400 mb-4">with {reg.speakerName}</p>

                                        <div className="space-y-2 text-sm text-gray-300 mb-6">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-blue-400" />
                                                <span>{new Date(reg.startDate).toDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-blue-400" />
                                                <span>{new Date(reg.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>

                                        {reg.status === 'ONGOING' ? (
                                            <button
                                                onClick={() => handleJoin(reg.webinarId)}
                                                className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Video className="w-4 h-4" />
                                                Join Now
                                            </button>
                                        ) : (
                                            <div className="w-full py-2 bg-slate-700/50 text-gray-400 text-center rounded-lg text-sm">
                                                Starts soon
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-800/30 rounded-2xl p-8 text-center border border-slate-700/30 border-dashed">
                                <p className="text-gray-400">No upcoming webinars registered.</p>
                                <Link to="/student/webinars" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">Find webinars to join</Link>
                            </div>
                        )}
                    </section>

                    {/* Past Section */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-gray-400" />
                            Completed History
                        </h2>

                        {pastEvents.length > 0 ? (
                            <div className="space-y-4">
                                {pastEvents.map((reg) => (
                                    <div key={reg.id} className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-medium">{reg.webinarTitle}</h3>
                                                <p className="text-sm text-gray-500">Attended on {new Date(reg.startDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {reg.certificateGenerated ? (
                                                <button
                                                    onClick={() => handleDownloadCertificate(reg.webinarId)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all text-sm font-medium border border-blue-500/20"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download Certificate
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleGenerateCertificate(reg.webinarId, reg.id)}
                                                    disabled={generatingId === reg.id}
                                                    className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-lg transition-all text-sm font-medium border border-amber-500/20 disabled:opacity-50"
                                                >
                                                    <Award className="w-4 h-4" />
                                                    {generatingId === reg.id ? 'Generating...' : 'Generate Certificate'}
                                                </button>
                                            )}
                                            <Link to={`/student/webinars/${reg.webinarId}`} className="p-2 hover:bg-slate-700 rounded-lg text-gray-400 hover:text-white transition-colors">
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm">No past webinars found.</div>
                        )}
                    </section>

                </div>
            )}
        </div>
    );
}
