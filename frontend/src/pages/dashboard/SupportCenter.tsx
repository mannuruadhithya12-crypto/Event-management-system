import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LifeBuoy,
    MessageSquare,
    Send,
    Clock,
    CheckCircle2,
    AlertCircle,
    HelpCircle,
    Plus,
    ChevronRight,
    ShieldAlert
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { complaintApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const SupportCenter = () => {
    const { user } = useAuthStore();
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showNewForm, setShowNewForm] = useState(false);

    const [newComplaint, setNewComplaint] = useState({
        type: 'MISCONDUCT',
        subject: '',
        description: ''
    });

    useEffect(() => {
        if (user) {
            fetchComplaints();
        }
    }, [user]);

    const fetchComplaints = async () => {
        try {
            const data = await complaintApi.getByUser(user!.id);
            setComplaints(data);
        } catch (error) {
            console.error("Failed to fetch complaints:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComplaint.subject || !newComplaint.description) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await complaintApi.submit({
                userId: user!.id,
                ...newComplaint
            });
            toast.success("Grievance submitted successfully. We'll review it soon.");
            setShowNewForm(false);
            setNewComplaint({ type: 'MISCONDUCT', subject: '', description: '' });
            fetchComplaints();
        } catch (error) {
            toast.error("Failed to submit grievance");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'OPEN': return <Badge className="bg-blue-500">Open</Badge>;
            case 'UNDER_REVIEW': return <Badge className="bg-amber-500">Under Review</Badge>;
            case 'RESOLVED': return <Badge className="bg-green-500">Resolved</Badge>;
            case 'CLOSED': return <Badge variant="secondary">Closed</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'OPEN': return <Clock className="h-5 w-5 text-blue-500" />;
            case 'UNDER_REVIEW': return <AlertCircle className="h-5 w-5 text-amber-500" />;
            case 'RESOLVED': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            default: return <HelpCircle className="h-5 w-5 text-slate-400" />;
        }
    };

    const faqs = [
        { q: "How long does it take to resolve a grievance?", a: "Most grievances are reviewed and resolved within 3-5 business days." },
        { q: "Can I appeal a hackathon result?", a: "Yes, use the 'RESULT_APPEAL' type when submitting your grievance." },
        { q: "Is my identity protected?", a: "Grievances are handled confidentially by authorized staff members." }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-[24px] bg-[hsl(var(--navy))] flex items-center justify-center shadow-xl shadow-blue-500/20">
                        <LifeBuoy className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Support Center</h1>
                        <p className="text-slate-500 font-medium">Have an issue? We're here to help.</p>
                    </div>
                </div>

                <Button
                    size="lg"
                    onClick={() => setShowNewForm(true)}
                    className="rounded-2xl h-14 px-8 font-bold bg-[hsl(var(--navy))] hover:scale-105 transition-transform"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    NEW GRIEVANCE
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left: Complaints List */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="bg-transparent gap-2 p-0 h-auto">
                            <TabsTrigger value="all" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all shadow-sm">
                                All Tickets
                            </TabsTrigger>
                            <TabsTrigger value="active" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all shadow-sm">
                                Active
                            </TabsTrigger>
                            <TabsTrigger value="resolved" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all shadow-sm">
                                Resolved
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="mt-8 space-y-4">
                            <AnimatePresence>
                                {complaints.length === 0 ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <Card className="border-dashed border-2 bg-slate-50/50 dark:bg-slate-900/50 py-12 text-center rounded-[32px]">
                                            <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-500 font-bold">No grievances found</p>
                                            <p className="text-slate-400 text-sm">Everything seems to be running smoothly!</p>
                                        </Card>
                                    </motion.div>
                                ) : (
                                    complaints.map((c, idx) => (
                                        <motion.div
                                            key={c.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <Card className="border-none rounded-[32px] overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 dark:shadow-none transition-all cursor-pointer bg-white dark:bg-slate-900">
                                                <CardContent className="p-6">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex items-start gap-4">
                                                            <div className={cn(
                                                                "mt-1 h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                                                                c.status === 'OPEN' ? "bg-blue-100 dark:bg-blue-900/20" :
                                                                    c.status === 'RESOLVED' ? "bg-green-100 dark:bg-green-900/20" : "bg-slate-100 dark:bg-slate-800"
                                                            )}>
                                                                {getStatusIcon(c.status)}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h3 className="font-black text-lg text-slate-900 dark:text-white">{c.subject}</h3>
                                                                    {getStatusBadge(c.status)}
                                                                </div>
                                                                <p className="text-sm text-slate-500 line-clamp-1">{c.description}</p>
                                                                <div className="flex items-center gap-3 mt-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                                    <span>{c.type}</span>
                                                                    <span>•</span>
                                                                    <span>{format(new Date(c.createdAt), 'MMM d, h:mm a')}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-900 transition-colors" />
                                                    </div>

                                                    {c.adminAction && (
                                                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-l-4 border-slate-900">
                                                            <p className="text-xs font-black uppercase text-slate-400 mb-1">Response from Admin</p>
                                                            <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{c.adminAction}"</p>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right: FAQs & Stats */}
                <div className="space-y-6">
                    <Card className="border-none bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-[40px] p-8 overflow-hidden relative">
                        <ShieldAlert className="absolute -bottom-10 -right-10 h-40 w-40 text-white/10 rotate-12" />
                        <h3 className="text-2xl font-black mb-2">Safety Policy</h3>
                        <p className="text-white/80 text-sm leading-relaxed">
                            Our ecosystem mandates a zero-tolerance policy towards misconduct. Report any violations here.
                        </p>
                        <Button variant="secondary" className="mt-6 rounded-xl font-bold w-full h-12">
                            READ CODE OF CONDUCT
                        </Button>
                    </Card>

                    <Card className="border-none rounded-[40px] bg-white dark:bg-slate-900">
                        <CardHeader>
                            <CardTitle className="text-xl font-black">Common Queries</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div key={i} className="space-y-1">
                                    <p className="font-bold text-slate-900 dark:text-white text-sm">{faq.q}</p>
                                    <p className="text-xs text-slate-500 leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* New Grievance Modal */}
            <AnimatePresence>
                {showNewForm && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowNewForm(false)}
                            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed left-1/2 top-1/2 z-[60] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-4"
                        >
                            <Card className="border-none rounded-[40px] shadow-2xl overflow-hidden">
                                <CardHeader className="bg-[hsl(var(--navy))] text-white p-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl font-black">New Grievance</CardTitle>
                                            <CardDescription className="text-blue-100 mt-1">Submit your issue for review</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-slate-500 ml-1">Issue Category</label>
                                            <Select
                                                value={newComplaint.type}
                                                onValueChange={(val) => setNewComplaint({ ...newComplaint, type: val })}
                                            >
                                                <SelectTrigger className="rounded-2xl h-12 border-slate-200">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="MISCONDUCT">Misconduct / Harassment</SelectItem>
                                                    <SelectItem value="RESULT_APPEAL">Result Appeal</SelectItem>
                                                    <SelectItem value="TECHNICAL_ISSUE">Technical Issue</SelectItem>
                                                    <SelectItem value="OTHER">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-slate-500 ml-1">Subject</label>
                                            <Input
                                                placeholder="Short summary of the issue"
                                                className="rounded-2xl h-12 border-slate-200"
                                                value={newComplaint.subject}
                                                onChange={(e) => setNewComplaint({ ...newComplaint, subject: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-slate-500 ml-1">Description</label>
                                            <Textarea
                                                placeholder="Detailed explanation of what happened..."
                                                className="rounded-[24px] min-h-[120px] border-slate-200 p-4"
                                                value={newComplaint.description}
                                                onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                                            />
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="flex-1 h-14 rounded-2xl font-bold"
                                                onClick={() => setShowNewForm(false)}
                                            >
                                                CANCEL
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="flex-1 h-14 rounded-2xl font-bold bg-[hsl(var(--navy))]"
                                                disabled={loading}
                                            >
                                                {loading ? 'SUBMITTING...' : 'SUBMIT TICKET'}
                                                <Send className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SupportCenter;
