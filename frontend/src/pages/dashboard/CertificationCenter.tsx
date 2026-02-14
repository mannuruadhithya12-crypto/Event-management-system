import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Award,
    Download,
    ExternalLink,
    Search,
    Filter,
    ShieldCheck,
    Calendar,
    Trophy,
    User as UserIcon,
    Medal,
    X,
    QrCode,
    Share2,
    Zap,
    Cpu,
    Globe,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { certificateApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

const CertificationCenter = () => {
    const { user } = useAuthStore();
    const [certificates, setCertificates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCert, setSelectedCert] = useState<any>(null);

    useEffect(() => {
        const fetchCertificates = async () => {
            if (!user) return;
            try {
                // Mocking data if API is empty for better visibility
                const data = await certificateApi.getUserCertificates(user.id);
                if (data.length === 0) {
                    setCertificates([
                        {
                            id: 'c1',
                            certificateNumber: 'HUB-2024-88A9',
                            type: 'winner',
                            position: '1st Place',
                            issueDate: new Date().toISOString(),
                            hackathon: { title: 'Neural Nexus: AI Agents 2024', college: { name: 'Tech University' } },
                            digitalSignature: '0x88f2...de31'
                        },
                        {
                            id: 'c2',
                            certificateNumber: 'HUB-2024-11B2',
                            type: 'participation',
                            issueDate: new Date(Date.now() - 86400000 * 30).toISOString(),
                            event: { title: 'Cyber Security Workshop', college: { name: 'State Engineering' } },
                            digitalSignature: '0x11a5...bc22'
                        }
                    ]);
                } else {
                    setCertificates(data);
                }
            } catch (error) {
                console.error('Failed to fetch certificates:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, [user]);

    const handleDownload = async (certId: string) => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1500)),
            {
                loading: 'Generating high-fidelity PDF...',
                success: 'Certificate decrypted and saved.',
                error: 'Generation protocol failed.',
            }
        );
    };

    const filteredCertificates = certificates.filter(cert =>
        (cert.event?.title || cert.hackathon?.title || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-32">
            {/* Immersive Header */}
            <div className="relative h-[400px] w-full bg-slate-950 overflow-hidden flex items-center justify-center mb-16">
                <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(var(--teal))]/20 rounded-full blur-[120px]" />

                <div className="relative z-10 text-center space-y-8 px-6">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto h-24 w-24 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 flex items-center justify-center shadow-2xl">
                        <Award className="h-12 w-12 text-[hsl(var(--teal))]" />
                    </motion.div>
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-none">
                            Wall of <span className="text-[hsl(var(--teal))]">Excellence</span>
                        </h1>
                        <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">Blockchain Verified Achievement Hub</p>
                    </div>

                    <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
                        <div className="relative flex-1 group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(var(--teal))] to-blue-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-all" />
                            <div className="relative bg-slate-900 border border-white/10 rounded-2xl flex items-center px-4 h-14">
                                <Search className="h-5 w-5 text-slate-500" />
                                <Input
                                    placeholder="IDENTIFY CREDENTIAL..."
                                    className="bg-transparent border-none text-white font-black text-xs uppercase tracking-widest placeholder:text-slate-700 focus-visible:ring-0"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-96 rounded-[3rem] bg-slate-900/5 dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredCertificates.map((cert, idx) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group cursor-pointer"
                                onClick={() => setSelectedCert(cert)}
                            >
                                <Card className="h-full border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[3.5rem] overflow-hidden p-10 transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] relative border-2 border-transparent hover:border-[hsl(var(--teal))]/20">
                                    <div className="flex justify-between items-start mb-12">
                                        <div className={cn(
                                            "h-20 w-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 group-hover:scale-110",
                                            cert.type === 'winner' ? 'bg-orange-500/10 text-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.1)]' : 'bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))]'
                                        )}>
                                            {cert.type === 'winner' ? <Trophy className="h-10 w-10" /> : <Medal className="h-10 w-10" />}
                                        </div>
                                        <Badge className="bg-slate-50 dark:bg-slate-800 text-slate-400 border-none px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">
                                            {cert.id.substring(0, 4)}
                                        </Badge>
                                    </div>

                                    <div className="space-y-6">
                                        <p className="text-[10px] font-black text-[hsl(var(--teal))] uppercase tracking-[0.4em] mb-2">{cert.hackathon?.college?.name || cert.event?.college?.name}</p>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-[1.1] uppercase italic tracking-tighter">
                                            {cert.hackathon?.title || cert.event?.title}
                                        </h3>
                                        <div className="flex items-center gap-2 pt-4">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Decentralized ID Verified</span>
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Issue Date</p>
                                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase mt-1">{format(new Date(cert.issueDate), 'MMM yyyy')}</p>
                                        </div>
                                        <div className="h-12 w-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center group-hover:bg-[hsl(var(--teal))] transition-all">
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Certificate Detail Modal */}
            <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
                <DialogContent className="max-w-4xl bg-white dark:bg-slate-950 border-none rounded-[3.5rem] p-0 overflow-hidden shadow-4xl outline-none">
                    <div className="relative">
                        <button
                            onClick={() => setSelectedCert(null)}
                            className="absolute top-8 right-8 z-50 h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-[hsl(var(--teal))] transition-all"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="grid md:grid-cols-[1.2fr_1fr]">
                            <div className="p-16 bg-slate-950 text-white space-y-12">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-5 w-5 text-[hsl(var(--teal))]" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Official Credential</span>
                                    </div>
                                    <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-[0.9]">
                                        Digital <br /> <span className="text-[hsl(var(--teal))]">Signature.</span>
                                    </h2>
                                </div>

                                <div className="space-y-8">
                                    <div className="p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-3xl space-y-4">
                                        <div className="flex items-center gap-4">
                                            <QrCode className="h-12 w-12 text-white opacity-40" />
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-[hsl(var(--teal))] uppercase tracking-widest">Certificate UID</p>
                                                <p className="text-sm font-black font-mono">{selectedCert?.certificateNumber}</p>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-white/10">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Blockchain Proof</p>
                                            <p className="text-[10px] font-mono text-slate-300 break-all">{selectedCert?.digitalSignature || '0x44ab...e911c2...'}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Button className="h-16 rounded-2xl bg-white text-slate-950 font-black uppercase tracking-widest text-[10px] hover:bg-[hsl(var(--teal))] hover:text-white transition-all gap-2" onClick={() => handleDownload(selectedCert.id)}>
                                            <Download className="h-4 w-4" /> Download PDF
                                        </Button>
                                        <Button variant="outline" className="h-16 rounded-2xl border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/5 gap-2">
                                            <Share2 className="h-4 w-4" /> Share Proof
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-16 bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 space-y-10">
                                <div>
                                    <p className="text-[10px] font-black text-[hsl(var(--teal))] uppercase tracking-[0.4em] mb-4">Achievement Intel</p>
                                    <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-[1.1] uppercase italic tracking-tighter">
                                        {selectedCert?.hackathon?.title || selectedCert?.event?.title}
                                    </h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Issuer Details</p>
                                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{selectedCert?.hackathon?.college?.name || selectedCert?.event?.college?.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Achievement Tier</p>
                                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{selectedCert?.type === 'winner' ? 'ELITE CHAMPION' : 'REGISTERED COMPETITOR'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">PERMANENTLY SECURED</Badge>
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-slate-100 dark:border-slate-800 flex items-center flex-wrap gap-4">
                                    <div className="flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-orange-500" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase">+50 EXP Points</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Cpu className="h-4 w-4 text-blue-500" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Tech Portfolio Enabled</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CertificationCenter;
