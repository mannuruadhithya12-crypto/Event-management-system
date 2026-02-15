import React, { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
    Award,
    Download,
    Search,
    ShieldCheck,
    Trophy,
    Medal,
    ArrowRight,
    Inbox,
    RefreshCw
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { certificateApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Certificate } from '@/types';

const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
            className={cn("relative group", className)}
        >
            <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }} className="h-full">
                {children}
            </div>
        </motion.div>
    );
};

const MeshGradient = () => (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-teal-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '4s' }} />
    </div>
);

const CertificationCenter = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
    const [filter, setFilter] = useState<'all' | 'hackathon' | 'webinar' | 'winner'>('all');
    const [error, setError] = useState(false);

    const fetchCertificates = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(false);
        try {
            const data = await certificateApi.getUserCertificates(user.id);
            setCertificates(data);
        } catch (error) {
            console.error('Failed to fetch certificates:', error);
            setError(true);
            toast.error('Achievement extraction failed. Re-sync recommended.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCertificates();
    }, [fetchCertificates]);

    const handleDownload = async (certId: string, certName: string) => {
        if (!user) return;
        const toastId = toast.loading('Initiating secure vault export...');
        try {
            const blob = await certificateApi.download(certId, user.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `CERT_${certName.toUpperCase().replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success('Certificate Decrypted & Downloaded', { id: toastId });
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Encrypted stream interrupted', { id: toastId });
        }
    };

    const filteredCertificates = certificates.filter(cert => {
        const matchesSearch = (cert.eventTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.certificateId.toLowerCase().includes(searchQuery.toLowerCase());

        if (filter === 'all') return matchesSearch;
        if (filter === 'winner') return matchesSearch && cert.role.toLowerCase().includes('winner');
        return matchesSearch && cert.category.toLowerCase() === filter;
    });

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-32 selection:bg-teal-500/30">
            {/* Premium Immersive Header */}
            <div className="relative h-[500px] w-full bg-slate-950 overflow-hidden flex items-center justify-center mb-16">
                <MeshGradient />
                <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                <div className="relative z-10 text-center space-y-12 px-6 max-w-5xl">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
                        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="mx-auto h-32 w-32 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(20,184,166,0.3)] relative group"
                    >
                        <Award className="h-16 w-16 text-teal-400 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
                        <div className="absolute -inset-2 bg-teal-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>

                    <div className="space-y-6">
                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter italic leading-none"
                        >
                            Digital <span className="text-teal-400 drop-shadow-[0_0_20px_rgba(45,212,191,0.5)]">Archive</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-slate-400 font-black uppercase tracking-[0.6em] text-[12px]"
                        >
                            Verified Intellectual Property & Achievement Ledger
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-2xl mx-auto"
                    >
                        <div className="relative flex-1 group w-full">
                            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition-all duration-500" />
                            <div className="relative bg-slate-900 border border-white/10 rounded-2xl flex items-center px-6 h-18 shadow-2xl">
                                <Search className="h-6 w-6 text-teal-500" />
                                <Input
                                    placeholder="SCANNING REPOSITORY..."
                                    className="bg-transparent border-none text-white font-black text-base uppercase tracking-widest placeholder:text-slate-700 focus-visible:ring-0 h-full"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        {(['all', 'hackathon', 'webinar', 'winner'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-300 border backdrop-blur-md",
                                    filter === f
                                        ? "bg-teal-500 border-teal-500 text-white shadow-[0_10px_30px_rgba(20,184,166,0.4)] scale-105"
                                        : "bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </motion.div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[500px] rounded-[4rem] bg-slate-900/5 dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-40 bg-red-500/5 rounded-[4rem] border-2 border-red-500/20 max-w-2xl mx-auto">
                        <RefreshCw className="h-16 w-16 text-red-500 mx-auto mb-8 animate-spin-slow" />
                        <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Uplink Interrupted</h3>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs px-12 mb-8">Unable to establish connection with the central achievement database.</p>
                        <Button
                            onClick={fetchCertificates}
                            className="h-16 px-10 rounded-2xl bg-white text-slate-950 font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all shadow-2xl"
                        >
                            RE-ESTABLISH LINK
                        </Button>
                    </div>
                ) : filteredCertificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                        {filteredCertificates.map((cert, idx) => (
                            <TiltCard key={cert.id}>
                                <Card className="h-full border-none shadow-[0_30px_80px_-20px_rgba(0,0,0,0.2)] bg-white dark:bg-slate-900 rounded-[4rem] overflow-hidden p-14 transition-all duration-700 hover:shadow-[0_50px_100px_-20px_rgba(20,184,166,0.15)] relative border-2 border-transparent hover:border-teal-500/20 flex flex-col justify-between">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/5 blur-[60px] rounded-full pointer-events-none" />

                                    <div className="flex justify-between items-start mb-16 relative z-10">
                                        <div className={cn(
                                            "h-28 w-28 rounded-[3rem] flex items-center justify-center transition-all duration-700 group-hover:scale-110 bg-white dark:bg-slate-800 shadow-2xl",
                                            cert.role.includes('WINNER') ? 'text-amber-500' : 'text-teal-500'
                                        )}>
                                            {cert.role.includes('WINNER') ? <Trophy className="h-14 w-14" /> : <Medal className="h-14 w-14" />}
                                        </div>
                                        <Badge className="bg-slate-50 dark:bg-slate-800 text-slate-500 border-none px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-sm">
                                            {cert.certificateId}
                                        </Badge>
                                    </div>

                                    <div className="space-y-8 flex-1 relative z-10">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-1 w-8 bg-teal-500 rounded-full" />
                                                <p className="text-[12px] font-black text-teal-500 uppercase tracking-[0.5em]">{cert.category}</p>
                                            </div>
                                            <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-[1] uppercase italic tracking-tighter">
                                                {cert.eventTitle}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-4 py-3 bg-slate-50 dark:bg-white/5 rounded-2xl px-6 w-fit">
                                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                                            <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest italic">Immutable Proof Generated</span>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">DESIGNATION / RANK</p>
                                            <p className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">{cert.role}</p>
                                        </div>
                                    </div>

                                    <div className="mt-16 pt-12 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between relative z-10">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TIMESTAMP</p>
                                            <p className="text-base font-black text-slate-900 dark:text-white mt-1">{format(new Date(cert.issuedAt), 'MMMM yyyy')}</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-16 w-16 rounded-3xl border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 shadow-xl transition-all"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDownload(cert.id, cert.eventTitle || 'Certificate');
                                                }}
                                            >
                                                <Download className="h-7 w-7" />
                                            </Button>
                                            <Button
                                                className="h-16 w-16 rounded-3xl bg-slate-950 text-white hover:bg-teal-500 transition-all duration-500 shadow-2xl group shadow-slate-950/20"
                                                onClick={() => setSelectedCert(cert)}
                                            >
                                                <ArrowRight className="h-7 w-7 group-hover:translate-x-2 transition-transform" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </TiltCard>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-48 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[5rem] border-2 border-dashed border-slate-200 dark:border-slate-800/50 max-w-4xl mx-auto shadow-2xl"
                    >
                        <div className="max-w-md mx-auto space-y-10">
                            <div className="h-32 w-32 bg-slate-100 dark:bg-white/5 rounded-[3rem] flex items-center justify-center mx-auto shadow-inner">
                                <Inbox className="h-14 w-14 text-slate-400 group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Vault Empty</h3>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs px-12 leading-relaxed">Your digital achievement record is currently dormant. Initiate participation protocols to earn verified credentials.</p>
                            </div>
                            <Button
                                onClick={() => navigate('/dashboard/events')}
                                className="h-20 px-12 rounded-3xl bg-teal-500 text-white font-black uppercase tracking-[0.3em] text-[11px] hover:bg-teal-600 shadow-[0_20px_40px_rgba(20,184,166,0.3)] transition-all hover:-translate-y-2"
                            >
                                EXPLORE OPPORTUNITIES
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>

            <Dialog open={!!selectedCert} onOpenChange={(open) => !open && setSelectedCert(null)}>
                <DialogContent className="max-w-4xl bg-slate-950/95 backdrop-blur-3xl border-slate-800 p-0 overflow-hidden rounded-[2rem]">
                    <DialogHeader className="p-8 border-b border-white/10">
                        <DialogTitle className="text-2xl font-black text-white uppercase italic tracking-tighter">
                            Certificate Preview
                        </DialogTitle>
                    </DialogHeader>
                    {selectedCert && (
                        <div className="flex flex-col md:flex-row h-[600px]">
                            <div className="flex-1 bg-slate-900/50 p-8 flex items-center justify-center border-r border-white/5 relative">
                                {selectedCert.pdfUrl ? (
                                    <iframe src={selectedCert.pdfUrl} className="w-full h-full rounded-xl shadow-2xl" title="Certificate Preview" />
                                ) : (
                                    <div className="text-center space-y-4">
                                        <Award className="h-24 w-24 text-slate-700 mx-auto" />
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Preview Not Available</p>
                                    </div>
                                )}
                            </div>
                            <div className="w-full md:w-80 bg-slate-950 p-8 space-y-8 overflow-y-auto">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Event</p>
                                    <h4 className="text-lg font-bold text-white leading-tight">{selectedCert.eventTitle}</h4>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Issue Date</p>
                                    <p className="text-slate-200 font-mono">{format(new Date(selectedCert.issuedAt), 'dd MMM yyyy')}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Verification ID</p>
                                    <p className="text-teal-400 font-mono text-sm">{selectedCert.certificateId}</p>
                                </div>

                                <div className="pt-8 space-y-4">
                                    <Button
                                        onClick={() => handleDownload(selectedCert.id, selectedCert.eventTitle || 'Certificate')}
                                        className="w-full h-14 rounded-xl bg-teal-500 text-white font-bold uppercase tracking-widest text-xs hover:bg-teal-600"
                                    >
                                        <Download className="mr-2 h-4 w-4" /> Download PDF
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate(`/verify/${selectedCert.certificateId}`)}
                                        className="w-full h-14 rounded-xl border-white/10 text-white hover:bg-white/5 font-bold uppercase tracking-widest text-xs"
                                    >
                                        <ShieldCheck className="mr-2 h-4 w-4" /> Verify Publicly
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <style>{`
                @keyframes shimmer {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(100%); }
                }
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default CertificationCenter;
