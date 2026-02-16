import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Award,
    Download,
    Eye,
    FileCheck,
    Plus,
    Search,
    Trash2,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { facultyApi } from '@/lib/api';

const FacultyCertificatesPage = () => {
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isGenerateOpen, setIsGenerateOpen] = useState(false);
    const [generateForm, setGenerateForm] = useState({
        eventId: '',
        recipientType: 'PARTICIPANTS',
        template: 'DEFAULT',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [certsData, eventsData] = await Promise.all([
                facultyApi.getCertificates(),
                facultyApi.getEvents(0, 50)
            ]);
            setCertificates(certsData?.content || certsData || []);
            setEvents(eventsData?.content || eventsData || []);
        } catch (error) {
            console.error('Failed to load data:', error);
            // toast.error('Failed to load certificates');
        }
    };

    const handleGenerate = async () => {
        if (!generateForm.eventId) {
            toast.error('Please select an event');
            return;
        }

        try {
            // Logic to determine recipients
            let userIds: string[] = [];

            if (generateForm.recipientType === 'PARTICIPANTS' || generateForm.recipientType === 'ATTENDEES') {
                // Fetch registrations for the event
                const registrations = await facultyApi.getEventRegistrations(generateForm.eventId);

                if (generateForm.recipientType === 'ATTENDEES') {
                    userIds = registrations.filter((r: any) => r.attended).map((r: any) => r.userId);
                } else {
                    userIds = registrations.map((r: any) => r.userId);
                }
            }

            if (userIds.length === 0) {
                toast.error('No eligible recipients found for the selected criteria');
                return;
            }

            await facultyApi.generateCertificates(generateForm.eventId, userIds);
            toast.success('Certificates generated successfully');
            setIsGenerateOpen(false);
            setGenerateForm({
                eventId: '',
                recipientType: 'PARTICIPANTS',
                template: 'DEFAULT',
            });
            loadData();
        } catch (error) {
            console.error('Failed to generate certificates:', error);
            toast.error('Failed to generate certificates');
        }
    };

    const handleRevoke = async (id: string) => {
        if (!confirm('Are you sure you want to revoke this certificate?')) return;

        try {
            await facultyApi.revokeCertificate(id);
            toast.success('Certificate revoked successfully');
            loadData();
        } catch (error) {
            console.error('Failed to revoke certificate:', error);
            toast.error('Failed to revoke certificate');
        }
    };

    const filteredCertificates = certificates.filter(cert => {
        const matchesSearch =
            searchQuery === '' ||
            cert.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.certificateId?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            cert.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: certificates.length,
        issued: certificates.filter(c => c.status === 'ISSUED').length,
        pending: certificates.filter(c => c.status === 'PENDING').length,
        revoked: certificates.filter(c => c.status === 'REVOKED').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold">Certificate Management</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Generate and manage certificates for events and hackathons
                    </p>
                </div>
                <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Generate Certificates
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Generate Certificates</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="eventId">Event/Hackathon *</Label>
                                <Select
                                    value={generateForm.eventId}
                                    onValueChange={(value) => setGenerateForm({ ...generateForm, eventId: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select event" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {events.map((event: any) => (
                                            <SelectItem key={event.id} value={event.id}>
                                                {event.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="recipientType">Recipients *</Label>
                                <Select
                                    value={generateForm.recipientType}
                                    onValueChange={(value) => setGenerateForm({ ...generateForm, recipientType: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PARTICIPANTS">All Participants</SelectItem>
                                        <SelectItem value="ATTENDEES">Attendees Only</SelectItem>
                                        <SelectItem value="WINNERS">Winners Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="template">Template *</Label>
                                <Select
                                    value={generateForm.template}
                                    onValueChange={(value) => setGenerateForm({ ...generateForm, template: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DEFAULT">Default Template</SelectItem>
                                        <SelectItem value="PREMIUM">Premium Template</SelectItem>
                                        <SelectItem value="CUSTOM">Custom Template</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setIsGenerateOpen(false)} className="flex-1">
                                    Cancel
                                </Button>
                                <Button onClick={handleGenerate} className="flex-1">
                                    <Award className="mr-2 h-4 w-4" /> Generate
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </motion.div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Total Issued</p>
                                <p className="text-3xl font-bold mt-1">{stats.total}</p>
                            </div>
                            <Award className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Active</p>
                                <p className="text-3xl font-bold mt-1">{stats.issued}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Pending</p>
                                <p className="text-3xl font-bold mt-1">{stats.pending}</p>
                            </div>
                            <FileCheck className="h-8 w-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Revoked</p>
                                <p className="text-3xl font-bold mt-1">{stats.revoked}</p>
                            </div>
                            <XCircle className="h-8 w-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters & Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle>Certificates ({filteredCertificates.length})</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <Input
                                placeholder="Search by name or certificate ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="ISSUED">Issued</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="REVOKED">Revoked</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {filteredCertificates.length === 0 ? (
                        <div className="py-16 text-center text-slate-500">
                            <Award className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No certificates yet</h3>
                            <p className="mb-4">Generate certificates for your events</p>
                            <Button onClick={() => setIsGenerateOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" /> Generate Certificates
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Certificate ID</TableHead>
                                    <TableHead>Recipient</TableHead>
                                    <TableHead>Event</TableHead>
                                    <TableHead>Issued Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCertificates.map((cert) => (
                                    <TableRow key={cert.id}>
                                        <TableCell className="font-mono text-sm">
                                            {cert.certificateId}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {cert.recipientName}
                                        </TableCell>
                                        <TableCell>{cert.eventName}</TableCell>
                                        <TableCell>
                                            {cert.issuedDate ? new Date(cert.issuedDate).toLocaleDateString() : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    cert.status === 'ISSUED' ? 'default' :
                                                        cert.status === 'PENDING' ? 'secondary' : 'destructive'
                                                }
                                            >
                                                {cert.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                {cert.status === 'ISSUED' && (
                                                    <Button variant="ghost" size="sm" onClick={() => handleRevoke(cert.id)}>
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default FacultyCertificatesPage;
