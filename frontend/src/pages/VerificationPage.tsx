import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
    ShieldCheck,
    Award,
    ShieldAlert,
    ExternalLink,
    Calendar,
    Globe,
    Cpu,
    Zap,
    Trophy,
    CheckCircle2,
    XCircle,
    Loader2,
    ArrowRight,
    Box
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { certificateApi } from '@/lib/api';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Certificate } from '@/types';

const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

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
            <div style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }} className="h-full">
                {children}
            </div>
        </motion.div>
    );
};

const VerificationPage = () => {
    const { certificateId } = useParams<{ certificateId: string }>();
    const navigate = useNavigate();
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading');

    useEffect(() => {
        const verify = async () => {
            if (!certificateId) {
                setStatus('invalid');
                return;
            }
            try {
                const data = await certificateApi.verify(certificateId);
                if (data && data.status === 'VERIFIED') {
                    setCertificate(data);
                    setStatus('valid');
                } else {
                    setStatus('invalid');
                }
            } catch (error) {
                console.error('Verification failed:', error);
                setStatus('invalid');
            }
        };

        verify();
    }, [certificateId]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8 relative overflow-hidden selection:bg-teal-500/30">
            {/* Background Aesthetics */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-teal-500/5 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #14b8a6 1px, transparent 0)`, backgroundSize: '80px 80px' }} />
            </div>

            <div className="relative z-10 w-full max-w-2xl">
                <AnimatePresence mode="wait">
                    {status === 'loading' ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="text-center space-y-10"
                        >
                            <div className="relative inline-block">
                                <div className="h-40 w-40 border-4 border-teal-500/10 border-t-teal-500 rounded-full animate-spin transition-all" />
                                <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-teal-400 animate-bounce" />
                            </div>
                            <div className="space-y-6">
                                <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">Querying Ledger...</h1>
                                <p className="text-slate-500 font-bold uppercase tracking-[0.6em] text-[12px] animate-pulse">Authenticating Cryptographic Proof</p>
                            </div>
                        </motion.div>
                    ) : status === 'valid' && certificate ? (
                        <motion.div
                            key="valid"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-10"
                        >
                            <div className="text-center space-y-6">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                    className="h-28 w-28 bg-teal-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(20,184,166,0.6)] border-8 border-slate-950"
                                >
                                    <CheckCircle2 className="h-14 w-14 text-white" />
                                </motion.div>
                                <div className="space-y-3">
                                    <h1 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Record: <span className="text-teal-400 drop-shadow-[0_0_15px_rgba(20,184,166,0.3)]">Valid</span></h1>
                                    <p className="text-slate-600 font-bold uppercase tracking-[0.5em] text-[11px] italic">Public Credential Authority Node Verified</p>
                                </div>
                            </div>

                            <TiltCard>
                                <Card className="bg-white/5 border border-white/10 rounded-[4rem] p-14 backdrop-blur-3xl space-y-14 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[80px] rounded-full group-hover:bg-teal-500/10 transition-all duration-700" />

                                    <div className="space-y-10 relative z-10">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-3">
                                                <p className="text-[12px] font-black text-teal-500 uppercase tracking-[0.4em] italic leading-none">Protocol Recipient</p>
                                                <p className="text-4xl font-black text-white uppercase italic tracking-tight">{certificate.studentName}</p>
                                            </div>
                                            <div className="h-20 w-20 bg-white/5 rounded-3xl flex items-center justify-center shadow-inner border border-white/5">
                                                <Award className="h-10 w-10 text-teal-400 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-[12px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">Achievement Scope</p>
                                            <h3 className="text-3xl font-black text-white leading-tight uppercase underline underline-offset-[12px] decoration-teal-500/20">{certificate.eventTitle}</h3>
                                        </div>

                                        <div className="grid grid-cols-2 gap-10 pt-4">
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">Designation</p>
                                                <p className="text-base font-black text-white uppercase italic tracking-tight">{certificate.role}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">Authority Sealed</p>
                                                <p className="text-base font-black text-white uppercase italic tracking-tight">{format(new Date(certificate.issuedAt), 'dd MMMM yyyy')}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                                        <div className="flex items-center gap-6">
                                            <div className="h-16 w-16 rounded-2xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20 shadow-inner">
                                                <Globe className="h-8 w-8 text-teal-400" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] leading-none mb-1">Authenticated By</p>
                                                <p className="text-sm font-black text-white uppercase tracking-widest italic">Institutional Registry Node</p>
                                            </div>
                                        </div>
                                        <Button
                                            className="h-20 px-10 rounded-3xl bg-white text-slate-950 hover:bg-teal-500 hover:text-white transition-all duration-500 font-black uppercase tracking-[0.3em] text-[11px] gap-4 shadow-2xl group"
                                            onClick={() => window.print()}
                                        >
                                            <Download className="h-5 w-5 group-hover:-translate-y-1 transition-transform" /> PRINT RECORD
                                        </Button>
                                    </div>
                                </Card>
                            </TiltCard>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="text-center"
                            >
                                <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.6em] italic">Cryptographically sealed via SMART-EVENT-PROXY-01</p>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="invalid"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-12"
                        >
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                                className="h-32 w-32 bg-red-500 rounded-[3.5rem] flex items-center justify-center mx-auto shadow-[0_0_100px_rgba(239,68,68,0.4)] border-8 border-slate-950"
                            >
                                <ShieldAlert className="h-16 w-16 text-white" />
                            </motion.div>
                            <div className="space-y-6">
                                <h1 className="text-6xl font-black text-white uppercase italic tracking-tighter">Protocol <span className="text-red-500">Breach.</span></h1>
                                <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[12px] px-12 leading-relaxed italic">The provided intellectual property identifier could not be validated against the central network ledger. Access denied.</p>
                            </div>
                            <Button
                                onClick={() => navigate('/')}
                                variant="outline"
                                className="h-20 px-12 rounded-3xl border-white/10 bg-white/5 text-white font-black uppercase tracking-[0.4em] text-[11px] hover:bg-red-500/10 hover:border-red-500/30 transition-all gap-4"
                            >
                                SECURITY HOMEPAGE <ArrowRight className="h-5 w-5" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default VerificationPage;
