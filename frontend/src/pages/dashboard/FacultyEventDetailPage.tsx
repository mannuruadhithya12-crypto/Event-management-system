import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Users,
    Clock,
    Edit,
    Trash2,
    Download,
    Award,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { eventApi, facultyApi } from '@/lib/api';
import { toast } from 'sonner';

const FacultyEventDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<any>(null);
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAttendees, setSelectedAttendees] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadEventDetails();
    }, [id]);

    const loadEventDetails = async () => {
        try {
            setLoading(true);
            const [eventData, regData] = await Promise.all([
                facultyApi.getEvent(id!),
                facultyApi.getEventRegistrations(id!),
            ]);
            setEvent(eventData);
            setRegistrations(regData || []);
        } catch (error: any) {
            console.error('Failed to load event details:', error);
            toast.error('Failed to load event details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            await facultyApi.deleteEvent(id!);
            toast.success('Event deleted successfully');
            navigate('/dashboard/faculty/events');
        } catch (error: any) {
            console.error('Failed to delete event:', error);
            toast.error('Failed to delete event');
        }
    };

    const handleMarkAttendance = async () => {
        if (selectedAttendees.size === 0) {
            toast.error('Please select at least one attendee');
            return;
        }

        try {
            await facultyApi.markAttendance(id!, Array.from(selectedAttendees));
            toast.success(`Marked ${selectedAttendees.size} attendees as present`);
            setSelectedAttendees(new Set());
            // Reload registrations to show updated status
            const regData = await facultyApi.getEventRegistrations(id!);
            setRegistrations(regData || []);
        } catch (error: any) {
            console.error('Failed to mark attendance:', error);
            toast.error('Failed to mark attendance');
        }
    };

    const handleGenerateCertificates = async () => {
        try {
            // Get all attended users
            const attendedUserIds = registrations.filter(r => r.attended).map(r => r.userId);

            if (attendedUserIds.length === 0) {
                toast.error('No attendees eligible for certificates (mark attendance first)');
                return;
            }

            await facultyApi.generateCertificates(id!, attendedUserIds);
            toast.success('Certificates generated successfully');
        } catch (error: any) {
            console.error('Failed to generate certificates:', error);
            toast.error('Failed to generate certificates');
        }
    };

    const handleExportParticipants = () => {
        // Simple CSV export
        const csv = [
            ['Name', 'Email', 'Registration Date', 'Status'],
            ...registrations.map(reg => [
                reg.userName || 'N/A',
                reg.userEmail || 'N/A',
                reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : 'N/A',
                reg.status || 'CONFIRMED',
            ]),
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${event?.title || 'event'}_participants.csv`;
        a.click();
        toast.success('Participants exported successfully');
    };

    const toggleAttendee = (userId: string) => {
        const newSelected = new Set(selectedAttendees);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedAttendees(newSelected);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!event) {
        return (
            <Card>
                <CardContent className="py-16 text-center">
                    <h3 className="text-lg font-semibold mb-2">Event not found</h3>
                    <Button onClick={() => navigate('/dashboard/faculty/events')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/dashboard/faculty/events')}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{event.title}</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Event Details & Management
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/dashboard/faculty/events/${id}/edit`)}
                    >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>
            </motion.div>

            {/* Event Info Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Event Information</CardTitle>
                        <Badge variant={event.status === 'APPROVED' ? 'default' : 'secondary'}>
                            {event.status?.replace('_', ' ')}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-slate-500" />
                                <div>
                                    <p className="text-sm text-slate-500">Date & Time</p>
                                    <p className="font-medium">
                                        {event.startDate ? new Date(event.startDate).toLocaleString() : 'TBD'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-slate-500" />
                                <div>
                                    <p className="text-sm text-slate-500">Location</p>
                                    <p className="font-medium">{event.location || 'Online'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-slate-500" />
                                <div>
                                    <p className="text-sm text-slate-500">Registrations</p>
                                    <p className="font-medium">
                                        {registrations.length} / {event.maxParticipants || '∞'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-slate-500" />
                                <div>
                                    <p className="text-sm text-slate-500">Duration</p>
                                    <p className="font-medium">{event.duration || 'N/A'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-2">Description</p>
                                <p className="text-sm">{event.description || 'No description provided'}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs for Registrations, Attendance, etc. */}
            <Tabs defaultValue="registrations">
                <TabsList>
                    <TabsTrigger value="registrations">Registrations ({registrations.length})</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    <TabsTrigger value="certificates">Certificates</TabsTrigger>
                </TabsList>

                <TabsContent value="registrations" className="mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Registered Participants</CardTitle>
                                <Button variant="outline" size="sm" onClick={handleExportParticipants}>
                                    <Download className="mr-2 h-4 w-4" /> Export CSV
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {registrations.length === 0 ? (
                                <div className="py-8 text-center text-slate-500">
                                    No registrations yet
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Registration Date</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {registrations.map((reg) => (
                                            <TableRow key={reg.id}>
                                                <TableCell className="font-medium">
                                                    {reg.userName || 'N/A'}
                                                </TableCell>
                                                <TableCell>{reg.userEmail || 'N/A'}</TableCell>
                                                <TableCell>
                                                    {reg.createdAt
                                                        ? new Date(reg.createdAt).toLocaleDateString()
                                                        : 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{reg.status || 'CONFIRMED'}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="attendance" className="mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Mark Attendance</CardTitle>
                                <Button
                                    onClick={handleMarkAttendance}
                                    disabled={selectedAttendees.size === 0}
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark {selectedAttendees.size} as Present
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {registrations.length === 0 ? (
                                <div className="py-8 text-center text-slate-500">
                                    No registrations to mark attendance
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">
                                                <Checkbox
                                                    checked={selectedAttendees.size === registrations.length}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedAttendees(new Set(registrations.map(r => r.userId)));
                                                        } else {
                                                            setSelectedAttendees(new Set());
                                                        }
                                                    }}
                                                />
                                            </TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Attendance</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {registrations.map((reg) => (
                                            <TableRow key={reg.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedAttendees.has(reg.userId)}
                                                        onCheckedChange={() => toggleAttendee(reg.userId)}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {reg.userName || 'N/A'}
                                                </TableCell>
                                                <TableCell>{reg.userEmail || 'N/A'}</TableCell>
                                                <TableCell>
                                                    {reg.attended ? (
                                                        <Badge variant="default">
                                                            <CheckCircle className="mr-1 h-3 w-3" /> Present
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary">
                                                            <XCircle className="mr-1 h-3 w-3" /> Absent
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="certificates" className="mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Certificate Generation</CardTitle>
                                <Button onClick={handleGenerateCertificates}>
                                    <Award className="mr-2 h-4 w-4" /> Generate Certificates
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="py-8 text-center">
                                <Award className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Certificate Generation</h3>
                                <p className="text-slate-500 mb-4">
                                    Generate certificates for all attendees who marked as present
                                </p>
                                <p className="text-sm text-slate-600">
                                    {registrations.filter(r => r.attended).length} participants eligible for certificates
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default FacultyEventDetailPage;
