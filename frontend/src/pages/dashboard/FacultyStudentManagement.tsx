import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Check, X } from 'lucide-react';
import { useAuthStore } from '@/store';
import { api } from '@/lib/api';

interface Student {
    id: number;
    name: string;
    email: string;
    status: string;
    cgpa: number;
}

const FacultyStudentManagement = () => {
    const { user } = useAuthStore();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        // Mock data fetch
        setStudents([
            { id: 1, name: 'Alice Johnson', email: 'alice@college.edu', status: 'Active', cgpa: 3.8 },
            { id: 2, name: 'Bob Smith', email: 'bob@college.edu', status: 'Pending Approval', cgpa: 3.5 },
            { id: 3, name: 'Charlie Brown', email: 'charlie@college.edu', status: 'Active', cgpa: 3.9 },
        ]);
        setLoading(false);
    }, []);

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
            <p className="text-muted-foreground">Manage approvals and view student performance.</p>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search students..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="outline">Import CSV</Button>
            </div>

            <div className="rounded-md border">
                <div className="p-4">
                    <table className="w-full text-sm item-center">
                        <thead>
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">CGPA</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{student.name}</td>
                                    <td className="p-4 align-middle">{student.email}</td>
                                    <td className="p-4 align-middle">
                                        <span className={`px-2 py-1 rounded text-xs ${student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle">{student.cgpa}</td>
                                    <td className="p-4 align-middle text-right">
                                        {student.status === 'Pending Approval' ? (
                                            <div className="flex justify-end space-x-2">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600">
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button variant="link" size="sm">View Details</Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FacultyStudentManagement;
