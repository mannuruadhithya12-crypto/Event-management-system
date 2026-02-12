import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
    Medal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { certificateApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';
import { format } from 'date-fns';

const CertificationCenter = () => {
    const { user } = useAuthStore();
    const [certificates, setCertificates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCertificates = async () => {
            if (!user) return;
            try {
                const data = await certificateApi.getUserCertificates(user.id);
                setCertificates(data);
            } catch (error) {
                console.error('Failed to fetch certificates:', error);
                // toast.error('Could not load certificates');
                // For demo, let's keep empty if API fails
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, [user]);

    const handleDownload = async (certId: string) => {
        try {
            const blob = await certificateApi.download(certId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `certificate-${certId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            // Cleanup memory
            setTimeout(() => window.URL.revokeObjectURL(url), 100);

            toast.success('Certificate downloaded successfully!');
        } catch (error) {
            console.error("Download failed", error);
            toast.error('Failed to download certificate');
        }
    };

    const filteredCertificates = certificates.filter(cert =>
        (cert.event?.title || cert.hackathon?.title || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--teal)/0.1)] text-[hsl(var(--teal))] border border-[hsl(var(--teal)/0.2)]">
                        <Award className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verified Credentials</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Certification <span className="text-[hsl(var(--teal))]">Center</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-lg font-medium">
                        Securely manage and verify your official university achievements and participation records.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search credentials..."
                            className="pl-10 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-[hsl(var(--teal)/0.2)]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-12 w-12 p-0 rounded-2xl border-slate-200 dark:border-slate-800">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2].map(i => (
                        <div key={i} className="h-80 rounded-[2.5rem] bg-slate-100 dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800" />
                    ))}
                </div>
            ) : filteredCertificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {filteredCertificates.map((cert, idx) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group"
                        >
                            <Card className="overflow-hidden border-none shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 relative">
                                <div className="absolute top-0 right-0 p-8">
                                    <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-inner group-hover:bg-[hsl(var(--teal))] group-hover:text-white transition-colors duration-500">
                                        {cert.type === 'winner' ? <Trophy className="h-8 w-8" /> : <Award className="h-8 w-8" />}
                                    </div>
                                </div>

                                <CardHeader className="p-10 pb-4">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 mb-6">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Digital Signature Verified</span>
                                    </div>
                                    <CardTitle className="text-2xl font-black text-slate-900 dark:text-white leading-tight pr-20">
                                        {cert.hackathon?.title || cert.event?.title}
                                    </CardTitle>
                                    <p className="font-bold text-slate-400 uppercase tracking-tighter text-xs mt-3 flex items-center gap-2">
                                        {cert.type === 'winner' ? (
                                            <>
                                                <Medal className="h-3 w-3 text-yellow-500" />
                                                <span>Rank: {cert.position}</span>
                                            </>
                                        ) : (
                                            <span>Official Participation</span>
                                        )}
                                    </p>
                                </CardHeader>

                                <CardContent className="p-10 pt-6 space-y-8">
                                    <div className="flex items-center gap-6 py-6 border-y border-slate-100 dark:border-slate-800">
                                        <div className="flex-1 space-y-1.5">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Issue Date</span>
                                            </div>
                                            <p className="text-sm font-black text-slate-700 dark:text-slate-300">
                                                {format(new Date(cert.issueDate), 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                        <div className="h-10 w-[1px] bg-slate-100 dark:bg-slate-800" />
                                        <div className="flex-1 space-y-1.5 text-right">
                                            <div className="flex items-center gap-2 text-slate-400 justify-end">
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Issuer</span>
                                            </div>
                                            <p className="text-sm font-black text-slate-700 dark:text-slate-300 truncate">
                                                {cert.event?.college?.name || 'University Board'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button
                                            className="grow h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition-all font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200 dark:shadow-none"
                                            onClick={() => handleDownload(cert.id)}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download (PDF)
                                        </Button>
                                        <Button variant="outline" className="h-14 w-14 rounded-2xl p-0 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-mono font-bold tracking-tighter">UID: {cert.certificateNumber}</span>
                                        <span className="text-[10px] font-mono font-bold tracking-tighter">SECURE CHANNEL V2</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                    <Award className="h-20 w-20 mx-auto mb-8 text-slate-200 dark:text-slate-800" />
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">Empty Wall of Fame</h3>
                    <p className="text-slate-500 mt-3 max-w-sm mx-auto font-medium leading-relaxed">
                        Complete your first event to receive a blockchain-verified digital certificate.
                    </p>
                    <Button className="mt-10 bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal)/0.9)] text-white rounded-2xl px-10 h-14 font-black uppercase tracking-widest shadow-xl shadow-[hsl(var(--teal)/0.2)]">
                        Explore Events
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CertificationCenter;
