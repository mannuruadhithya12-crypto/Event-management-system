import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Search,
    Download,
    Filter,
    TrendingUp,
    Award,
    Calendar,
    BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
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
import { Badge } from '@/components/ui/badge';
import { facultyApi } from '@/lib/api';
import { toast } from 'sonner';

const FacultyStudentManagement = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [courseFilter, setCourseFilter] = useState('all');

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const response: any = await facultyApi.getStudents();
            // Handle both direct array and list wrapped in object
            const studentsList = Array.isArray(response) ? response : (response?.content || []);
            setStudents(studentsList);
        } catch (error: any) {
            console.error('Failed to load students:', error);
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const csv = [
            ['Name', 'Email', 'Department', 'Year', 'Events Attended', 'Hackathons Participated'],
            ...filteredStudents.map(student => [
                `${student.firstName} ${student.lastName}`,
                student.email,
                student.department || 'N/A',
                student.year || 'N/A',
                student.eventsAttended || 0,
                student.hackathonsParticipated || 0,
            ]),
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'students.csv';
        a.click();
        toast.success('Students exported successfully');
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch =
            searchQuery === '' ||
            `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDepartment =
            departmentFilter === 'all' ||
            student.department === departmentFilter;

        const matchesCourse =
            courseFilter === 'all' ||
            student.year === courseFilter;

        return matchesSearch && matchesDepartment && matchesCourse;
    });

    const stats = {
        totalStudents: students.length,
        activeStudents: students.filter(s => s.eventsAttended > 0 || s.hackathonsParticipated > 0).length,
        avgEventsPerStudent: students.length > 0
            ? (students.reduce((sum, s) => sum + (s.eventsAttended || 0), 0) / students.length).toFixed(1)
            : 0,
        topPerformers: students.filter(s => (s.eventsAttended || 0) + (s.hackathonsParticipated || 0) >= 5).length,
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <div className="grid gap-4 md:grid-cols-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold">Student Management</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Track and manage student participation and performance
                </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Total Students</p>
                                <p className="text-3xl font-bold mt-1">{stats.totalStudents}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Active Students</p>
                                <p className="text-3xl font-bold mt-1">{stats.activeStudents}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Avg Events/Student</p>
                                <p className="text-3xl font-bold mt-1">{stats.avgEventsPerStudent}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Top Performers</p>
                                <p className="text-3xl font-bold mt-1">{stats.topPerformers}</p>
                            </div>
                            <Award className="h-8 w-8 text-amber-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle>Students ({filteredStudents.length})</CardTitle>
                        <Button onClick={handleExport} variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" /> Export CSV
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                <SelectItem value="CSE">Computer Science</SelectItem>
                                <SelectItem value="ECE">Electronics</SelectItem>
                                <SelectItem value="MECH">Mechanical</SelectItem>
                                <SelectItem value="CIVIL">Civil</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={courseFilter} onValueChange={setCourseFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Years</SelectItem>
                                <SelectItem value="1">1st Year</SelectItem>
                                <SelectItem value="2">2nd Year</SelectItem>
                                <SelectItem value="3">3rd Year</SelectItem>
                                <SelectItem value="4">4th Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {filteredStudents.length === 0 ? (
                        <div className="py-16 text-center text-slate-500">
                            <Users className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No students found</h3>
                            <p>Try adjusting your filters</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Year</TableHead>
                                    <TableHead>Events</TableHead>
                                    <TableHead>Hackathons</TableHead>
                                    <TableHead>Performance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.map((student) => {
                                    const totalParticipation = (student.eventsAttended || 0) + (student.hackathonsParticipated || 0);
                                    const performance =
                                        totalParticipation >= 10 ? 'Excellent' :
                                            totalParticipation >= 5 ? 'Good' :
                                                totalParticipation >= 2 ? 'Average' : 'Low';

                                    const performanceColor =
                                        performance === 'Excellent' ? 'bg-green-500' :
                                            performance === 'Good' ? 'bg-blue-500' :
                                                performance === 'Average' ? 'bg-yellow-500' : 'bg-slate-500';

                                    return (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">
                                                {student.firstName} {student.lastName}
                                            </TableCell>
                                            <TableCell>{student.email}</TableCell>
                                            <TableCell>{student.department || 'N/A'}</TableCell>
                                            <TableCell>{student.year ? `Year ${student.year}` : 'N/A'}</TableCell>
                                            <TableCell>{student.eventsAttended || 0}</TableCell>
                                            <TableCell>{student.hackathonsParticipated || 0}</TableCell>
                                            <TableCell>
                                                <Badge className={performanceColor}>{performance}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default FacultyStudentManagement;
