import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
    Award,
    Download,
    Share2,
    ShieldCheck,
    Globe,
    QrCode,
    ArrowLeft,
    ExternalLink,
    Zap,
    Cpu,
    Calendar,
    User as UserIcon,
    Box
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { certificateApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Certificate } from '@/types';

const TiltPreview = ({ children }: { children: React.ReactNode }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

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
            className="w-full h-full"
        >
            <div style={{ transform: "translateZ(100px)", transformStyle: "preserve-3d" }} className="h-full">
                {children}
            </div>
        </motion.div>
    );
};

const CertificateDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertificate = async () => {
            if (!id || !user) return;
            try {
                const data = await certificateApi.getById(id, user.id);
                setCertificate(data);
            } catch (error) {
                console.error('Failed to fetch certificate detail:', error);
                toast.error('Achievement record inaccessible');
                navigate('/dashboard/certificates');
            } finally {
                setLoading(false);
            }
        };

        fetchCertificate();
    }, [id, user, navigate]);

    const handleDownload = async () => {
        if (!certificate || !user) return;
        const toastId = toast.loading('Synchronizing with institutional records...');
        try {
            const blob = await certificateApi.download(certificate.id, user.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `CERT_${certificate.eventTitle?.toUpperCase().replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success('Document Exported Successfully', { id: toastId });
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Secure export protocol failed', { id: toastId });
        }
    };

    const shareToLinkedIn = () => {
        const url = `${window.location.origin}/verify/${certificate?.certificateId}`;
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(linkedinUrl, '_blank');
        toast.info('Registry link prepared for transmission');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.1),transparent)] animate-pulse" />
                <div className="relative">
                    <div className="h-40 w-40 border-4 border-teal-500/10 border-t-teal-500 rounded-full animate-spin transition-all" />
                    <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-teal-400 animate-bounce" />
                </div>
                <p className="mt-12 text-slate-500 font-black uppercase tracking-[0.8em] text-[12px] animate-pulse">Decrypting Security Layers...</p>
            </div>
        );
    }

    if (!certificate) return null;

    return (
        <div className="min-h-screen bg-slate-950 pb-40 pt-16 px-8 relative overflow-hidden selection:bg-teal-500/30">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="max-w-[1400px] mx-auto space-y-16 relative z-10">
                {/* Back Link */}
                <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    onClick={() => navigate('/dashboard/certificates')}
                    className="flex items-center gap-6 text-slate-500 hover:text-white transition-all group w-fit"
                >
                    <div className="h-14 w-14 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all shadow-xl group-hover:scale-110">
                        <ArrowLeft className="h-6 w-6" />
                    </div>
                    <span className="font-black uppercase tracking-[0.4em] text-[11px] italic">Return to achievement vault</span>
                </motion.button>

                <div className="grid lg:grid-cols-[1.3fr_1fr] gap-20 items-start">
                    {/* Visual Preview Section */}
                    <div className="space-y-12">
                        <TiltPreview>
                            <Card className="aspect-[1.414/1] bg-white rounded-[4rem] overflow-hidden shadow-[0_80px_150px_-30px_rgba(0,0,0,0.6)] border-none relative">
                                <div className="absolute inset-0 border-[32px] border-slate-50 m-6 rounded-[3rem] box-border" />

                                <div className="h-full w-full p-24 flex flex-col items-center justify-between text-center relative z-10">
                                    <div className="space-y-6">
                                        <div className="h-24 w-24 bg-teal-500/10 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-inner">
                                            <Award className="h-14 w-14 text-teal-600" />
                                        </div>
                                        <h2 className="text-5xl font-serif text-slate-900 italic tracking-tight">Certification of Achievement</h2>
                                        <div className="h-1 w-20 bg-teal-500 mx-auto rounded-full" />
                                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[11px]">This rigorous honor is bestowed upon</p>
                                    </div>

                                    <div className="space-y-6">
                                        <p className="text-7xl font-black text-slate-900 underline underline-offset-[16px] decoration-teal-500/20">{certificate.studentName}</p>
                                        <p className="text-slate-500 font-bold text-xl max-w-lg mx-auto leading-relaxed">
                                            for exceptional demonstration of skill as a <br />
                                            <span className="text-teal-600 font-black uppercase text-2xl tracking-tighter italic">{certificate.role}</span>
                                        </p>
                                        <p className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">{certificate.eventTitle}</p>
                                    </div>

                                    <div className="w-full flex justify-between items-end pt-12">
                                        <div className="text-left space-y-3">
                                            <div className="h-px w-40 bg-slate-200" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registrar Signature</p>
                                            <p className="text-sm font-black text-slate-700 italic">Institutional Hub Authority</p>
                                        </div>

                                        <div className="h-28 w-28 bg-white p-3 rounded-2xl border border-slate-100 shadow-xl flex items-center justify-center">
                                            {certificate.qrCodeUrl ? (
                                                <img src={certificate.qrCodeUrl} alt="Validation" className="h-full w-full opacity-60 hover:opacity-100 transition-opacity" />
                                            ) : (
                                                <QrCode className="h-14 w-14 text-slate-100" />
                                            )}
                                        </div>

                                        <div className="text-right space-y-3">
                                            <div className="h-px w-40 bg-slate-200" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Key</p>
                                            <p className="text-[10px] font-mono text-teal-600 font-bold">{certificate.certificateId}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </TiltPreview>

                        <div className="grid grid-cols-2 gap-8">
                            <motion.button
                                whileHover={{ scale: 1.02, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleDownload}
                                className="h-24 rounded-[2rem] bg-white text-slate-950 hover:bg-teal-500 hover:text-white transition-all duration-500 font-black uppercase tracking-[0.3em] text-[11px] gap-6 flex items-center justify-center shadow-[0_30px_60px_-15px_rgba(255,255,255,0.15)] group"
                            >
                                <Download className="h-7 w-7 transition-transform group-hover:-translate-y-1" /> EXPORT PDF LEDGER
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={shareToLinkedIn}
                                className="h-24 rounded-[2rem] border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all font-black uppercase tracking-[0.3em] text-[11px] gap-6 flex items-center justify-center backdrop-blur-3xl"
                            >
                                <Share2 className="h-7 w-7" /> TRANSMIT TO PROFILE
                            </motion.button>
                        </div>
                    </div>

                    {/* Meta Data Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-12"
                    >
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <span className="h-3 w-3 rounded-full bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,1)] animate-pulse" />
                                <span className="text-[12px] font-black text-teal-500 uppercase tracking-[0.6em]">System Verification Pulse</span>
                            </div>
                            <h1 className="text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
                                Proven <br /> <span className="text-slate-800 dark:text-slate-700">Protocol.</span>
                            </h1>
                            <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-sm">
                                This achievement is cryptographically sealed and permanently indexed in the global verification registry.
                            </p>
                        </div>

                        <div className="space-y-10">
                            <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 space-y-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-teal-500/20 transition-all" />

                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3 italic">
                                            <Calendar className="h-4 w-4 text-teal-500" /> Timestamp
                                        </p>
                                        <p className="text-lg font-black text-white uppercase tracking-tight">{format(new Date(certificate.issuedAt), 'dd MMMM yyyy')}</p>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3 italic">
                                            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Status
                                        </p>
                                        <Badge className="bg-emerald-500/20 text-emerald-400 border-none px-4 py-1 h-7 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(16,185,129,0.2)]">AUTHENTICATED</Badge>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3 italic">
                                            <Globe className="h-4 w-4 text-blue-500" /> Jurisdiction
                                        </p>
                                        <p className="text-lg font-black text-white uppercase tracking-tight truncate">{certificate.category} Nexus</p>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3 italic">
                                            <UserIcon className="h-4 w-4 text-purple-500" /> Entity
                                        </p>
                                        <p className="text-lg font-black text-white uppercase tracking-tight truncate">{certificate.studentName}</p>
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-white/5 space-y-6">
                                    <div>
                                        <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4 italic">Public Registry Identifier</p>
                                        <div className="p-6 bg-slate-900/80 rounded-2xl border border-white/5 font-mono text-[13px] text-teal-400 flex items-center justify-between group shadow-inner">
                                            <span className="tracking-tighter">{certificate.certificateId}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-10 w-10 p-0 hover:bg-white/10 rounded-xl"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(certificate.certificateId);
                                                    toast.success('Key cloned to clipboard');
                                                }}
                                            >
                                                <ExternalLink className="h-5 w-5 text-slate-600 group-hover:text-teal-400 transition-colors" />
                                            </Button>
                                        </div>
                                    </div>

                                    <Button
                                        variant="link"
                                        className="p-0 text-slate-500 hover:text-teal-400 text-[11px] font-black uppercase tracking-[0.4em] italic transition-colors"
                                        onClick={() => navigate(`/verify/${certificate.certificateId}`)}
                                    >
                                        ACCESS PUBLIC REGISTRY ENTRY →
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-[3rem] bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/10 space-y-5 shadow-2xl"
                                >
                                    <Zap className="h-10 w-10 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]" />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">XP ACQUIRED</p>
                                        <p className="text-3xl font-black text-white tracking-tighter">+120 UNITS</p>
                                    </div>
                                </motion.div>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-[3rem] bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/10 space-y-5 shadow-2xl"
                                >
                                    <Cpu className="h-10 w-10 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">VALIDATIONS</p>
                                        <p className="text-3xl font-black text-white tracking-tighter">NODE-004</p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CertificateDetailPage;
