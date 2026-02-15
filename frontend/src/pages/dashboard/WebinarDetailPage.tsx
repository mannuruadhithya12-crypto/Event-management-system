import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Clock, MapPin, Users, Video,
    User, Share2, Award, MessageSquare,
    CheckCircle, AlertCircle, ArrowLeft
} from 'lucide-react';
import { webinarApi } from '@/lib/api';
import type { Webinar } from '@/types';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

export default function WebinarDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [webinar, setWebinar] = useState<Webinar | null>(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (id) {
            fetchWebinarDetails();
        }
    }, [id, user]);

    const fetchWebinarDetails = async () => {
        try {
            setLoading(true);
            if (!id) return;
            const data = await webinarApi.getById(id, user?.id);
            setWebinar(data);
        } catch (error) {
            console.error('Error fetching webinar:', error);
            toast.error('Failed to load webinar details');
            navigate('/dashboard/webinars');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!webinar || !user) return;

        try {
            setRegistering(true);
            await webinarApi.register(webinar.id, user.id);
            toast.success('Successfully registered for webinar!');
            setWebinar({ ...webinar, isRegistered: true, registeredCount: webinar.registeredCount + 1 });
        } catch (error) {
            console.error('Registration failed:', error);
            toast.error('Failed to register. Please try again.');
        } finally {
            setRegistering(false);
        }
    };

    const handleCancelRegistration = async () => {
        if (!webinar || !user) return;

        if (!window.confirm('Are you sure you want to cancel your registration?')) return;

        try {
            setRegistering(true);
            await webinarApi.unregister(webinar.id, user.id);
            toast.success('Registration cancelled successfully');
            setWebinar({ ...webinar, isRegistered: false, registeredCount: webinar.registeredCount - 1 });
        } catch (error) {
            console.error('Cancellation failed:', error);
            toast.error('Failed to cancel registration');
        } finally {
            setRegistering(false);
        }
    };

    const handleSubmitFeedback = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!webinar || !user) return;

        try {
            setRegistering(true);
            await webinarApi.submitFeedback(webinar.id, user.id, { rating, comment });
            toast.success('Feedback submitted successfully!');
            setFeedbackOpen(false);
        } catch (error) {
            console.error('Feedback failed:', error);
            toast.error('Failed to submit feedback');
        } finally {
            setRegistering(false);
        }
    };

    const handleJoin = async () => {
        if (!webinar || !user) return;
        try {
            const { url } = await webinarApi.join(webinar.id, user.id);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Failed to join:', error);
            toast.error('Failed to join webinar');
        }
    };

    const handleDownloadCertificate = async () => {
        if (!webinar || !user) return;
        try {
            toast.loading('Preparing your certificate...', { id: 'cert-download' });
            const blob = await webinarApi.generateCertificateBlob(webinar.id, user.id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Certificate_${webinar.title.replace(/\s+/g, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('Certificate downloaded successfully!', { id: 'cert-download' });
        } catch (error) {
            console.error('Certificate download failed:', error);
            toast.error('Failed to download certificate', { id: 'cert-download' });
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: webinar?.title,
                text: `Join this webinar: ${webinar?.title}`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    const handleAddToCalendar = () => {
        if (!webinar) return;
        const startDate = new Date(webinar.startDate).toISOString().replace(/-|:|\.\d+/g, '');
        const endDate = new Date(webinar.endDate || new Date(webinar.startDate).getTime() + 3600000).toISOString().replace(/-|:|\.\d+/g, '');
        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(webinar.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(webinar.description)}&location=${encodeURIComponent(webinar.mode)}`;
        window.open(calendarUrl, '_blank');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!webinar) return null;

    const isUpcoming = webinar.status === 'UPCOMING';
    const isOngoing = webinar.status === 'ONGOING';
    const isCompleted = webinar.status === 'COMPLETED';

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => navigate('/dashboard/webinars')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Webinars
            </button>

            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-800 border border-slate-700/50">
                <div className="absolute inset-0">
                    <img
                        src={webinar.bannerImage || 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800'}
                        alt={webinar.title}
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
                </div>

                <div className="relative p-8 md:p-12 space-y-6">
                    <div className="flex flex-wrap gap-3 items-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${isUpcoming ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            isOngoing ? 'bg-green-500/20 text-green-400 border-green-500/30 animate-pulse' :
                                'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            }`}>
                            {webinar.status}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            {webinar.mode}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            {webinar.hostCollege}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white max-w-4xl">
                        {webinar.title}
                    </h1>

                    <div className="flex flex-wrap gap-6 text-gray-300">
                        <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-slate-700/50">
                            <Calendar className="w-5 h-5 text-blue-400" />
                            <span>{new Date(webinar.startDate).toDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-slate-700/50">
                            <Clock className="w-5 h-5 text-blue-400" />
                            <span>{webinar.duration} Minutes</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-slate-700/50">
                            {webinar.mode === 'Online' ? <Video className="w-5 h-5 text-green-400" /> : <MapPin className="w-5 h-5 text-red-400" />}
                            <span>{webinar.mode === 'Online' ? 'Zoom / Meet' : 'Main Auditorium'}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-slate-700/50">
                            <Users className="w-5 h-5 text-yellow-400" />
                            <span>{webinar.registeredCount} / {webinar.maxParticipants} Seats</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 pt-6">
                        {webinar.isRegistered ? (
                            <>
                                <div className="flex items-center gap-2 px-6 py-3 bg-green-500/20 text-green-400 rounded-xl border border-green-500/30 font-medium">
                                    <CheckCircle className="w-5 h-5" />
                                    Registered
                                </div>

                                {isOngoing && webinar.meetingLink && (
                                    <button
                                        onClick={handleJoin}
                                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all font-medium"
                                    >
                                        <Video className="w-5 h-5" />
                                        Join Now
                                    </button>
                                )}

                                {isCompleted && (
                                    <>
                                        <button
                                            onClick={() => setFeedbackOpen(true)}
                                            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all font-medium border border-slate-600"
                                        >
                                            <MessageSquare className="w-5 h-5 text-yellow-400" />
                                            Give Feedback
                                        </button>
                                        <button
                                            onClick={handleDownloadCertificate}
                                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-500 hover:from-yellow-500 hover:to-orange-400 text-white rounded-xl shadow-lg transition-all font-medium"
                                        >
                                            < Award className="w-5 h-5 text-white" />
                                            Download Certificate
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={handleCancelRegistration}
                                    disabled={registering}
                                    className="px-6 py-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all font-medium border border-red-500/20"
                                >
                                    Cancel Registration
                                </button>
                                <button
                                    onClick={handleAddToCalendar}
                                    className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-medium border border-slate-700"
                                >
                                    <Calendar className="w-5 h-5" />
                                    Add to Calendar
                                </button>
                            </>
                        ) : (
                            isUpcoming && (
                                <button
                                    onClick={handleRegister}
                                    disabled={registering || (webinar.registeredCount >= (webinar.maxParticipants || 0))}
                                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                                >
                                    {registering ? 'Registering...' : (webinar.registeredCount >= (webinar.maxParticipants || 0) ? 'Seats Full' : 'Register for Free')}
                                </button>
                            )
                        )}

                        <button
                            onClick={handleShare}
                            className="p-3 bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white rounded-xl transition-colors border border-slate-700"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-blue-400" />
                            About this Webinar
                        </h2>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            {webinar.description}
                        </p>
                    </div>

                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Clock className="w-6 h-6 text-cyan-400" />
                            Agenda
                        </h2>
                        <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-line">
                            {webinar.agenda || "1. Introduction\n2. Key Concepts\n3. Practical Session\n4. Q&A"}
                        </div>
                    </div>

                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <User className="w-6 h-6 text-purple-400" />
                            Meet the Speaker
                        </h2>
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-700 flex-shrink-0 border-2 border-purple-500/30">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${webinar.speakerName}`}
                                    alt={webinar.speakerName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">{webinar.speakerName}</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    {webinar.speakerBio || `Expert speaker with deep knowledge in ${webinar.title}. Bringing industry insights and practical experience to help students excel.`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-white mb-4">What you'll learn</h3>
                        <ul className="space-y-3">
                            {['Industry Trends', 'Practical Skills', 'Q&A Session', 'Networking', 'Certificate of Completion'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6 rounded-2xl border border-yellow-500/20">
                        <div className="flex items-center gap-3 mb-3">
                            <Award className="w-6 h-6 text-yellow-400" />
                            <h3 className="text-lg font-bold text-yellow-100">Earn a Certificate</h3>
                        </div>
                        <p className="text-yellow-200/80 text-sm">
                            Complete this webinar and submit feedback to receive a verified certificate for your portfolio.
                        </p>
                    </div>
                </div>
            </div>

            {/* Feedback Modal */}
            <AnimatePresence>
                {feedbackOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl overflow-hidden"
                        >
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-white mb-2">Rate this Webinar</h3>
                                <p className="text-gray-400 mb-6">How was your experience with {webinar.speakerName}?</p>

                                <form onSubmit={handleSubmitFeedback} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className={`p-2 rounded-lg transition-colors ${rating >= star ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-600 bg-slate-700'}`}
                                                >
                                                    <Award className="w-6 h-6" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Comments</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 resize-none"
                                            placeholder="Share your thoughts..."
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 text-sm font-medium">
                                        <button
                                            type="button"
                                            onClick={() => setFeedbackOpen(false)}
                                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={registering}
                                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            {registering ? 'Submitting...' : 'Submit Feedback'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
