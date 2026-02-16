import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users,
    UserPlus,
    UserCheck,
    UserX,
    Crown,
    Shield,
    Mail,
    Calendar,
    Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const ClubMemberManagementPage = () => {
    const { clubId } = useParams<{ clubId: string }>();
    const [members, setMembers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [formData, setFormData] = useState({
        userId: '',
        role: 'MEMBER',
        bio: '',
    });

    useEffect(() => {
        loadMembers();
    }, [clubId]);

    const loadMembers = async () => {
        try {
            // TODO: Implement API call
            // const data = await clubApi.getMembers(clubId);
            // setMembers(data);

            // Mock data
            setMembers([
                {
                    id: '1',
                    user: { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '' },
                    role: 'PRESIDENT',
                    status: 'ACTIVE',
                    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
                    bio: 'Leading the club with passion',
                },
                {
                    id: '2',
                    user: { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '' },
                    role: 'VICE_PRESIDENT',
                    status: 'ACTIVE',
                    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 300),
                },
                {
                    id: '3',
                    user: { id: '3', name: 'Bob Wilson', email: 'bob@example.com', avatar: '' },
                    role: 'MEMBER',
                    status: 'PENDING',
                    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
                },
            ]);
        } catch (error) {
            toast.error('Failed to load members');
        }
    };

    const handleAddMember = async () => {
        try {
            // TODO: Implement API call
            toast.success('Member added successfully');
            setIsAddMemberOpen(false);
            loadMembers();
        } catch (error) {
            toast.error('Failed to add member');
        }
    };

    const handleApprove = async (memberId: string) => {
        try {
            // TODO: Implement API call
            toast.success('Member approved');
            loadMembers();
        } catch (error) {
            toast.error('Failed to approve member');
        }
    };

    const handleReject = async (memberId: string) => {
        if (!confirm('Are you sure you want to reject this member?')) return;

        try {
            // TODO: Implement API call
            toast.success('Member rejected');
            loadMembers();
        } catch (error) {
            toast.error('Failed to reject member');
        }
    };

    const handleRemove = async (memberId: string) => {
        if (!confirm('Are you sure you want to remove this member?')) return;

        try {
            // TODO: Implement API call
            toast.success('Member removed');
            loadMembers();
        } catch (error) {
            toast.error('Failed to remove member');
        }
    };

    const handleUpdateRole = async (memberId: string, newRole: string) => {
        try {
            // TODO: Implement API call
            toast.success('Role updated');
            loadMembers();
        } catch (error) {
            toast.error('Failed to update role');
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'PRESIDENT':
                return <Crown className="h-4 w-4 text-yellow-500" />;
            case 'VICE_PRESIDENT':
            case 'SECRETARY':
            case 'TREASURER':
                return <Shield className="h-4 w-4 text-blue-500" />;
            default:
                return <Users className="h-4 w-4 text-slate-500" />;
        }
    };

    const filteredMembers = members.filter((member) => {
        const matchesSearch = member.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
        const matchesRole = roleFilter === 'all' || member.role === roleFilter;
        return matchesSearch && matchesStatus && matchesRole;
    });

    const stats = {
        total: members.length,
        active: members.filter(m => m.status === 'ACTIVE').length,
        pending: members.filter(m => m.status === 'PENDING').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold">Member Management</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Manage club members, roles, and permissions
                </p>
            </motion.div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Total Members</p>
                                <p className="text-3xl font-bold mt-1">{stats.total}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Active Members</p>
                                <p className="text-3xl font-bold mt-1">{stats.active}</p>
                            </div>
                            <UserCheck className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Pending Approval</p>
                                <p className="text-3xl font-bold mt-1">{stats.pending}</p>
                            </div>
                            <UserPlus className="h-8 w-8 text-amber-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters & Actions */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Members</CardTitle>
                        <Button onClick={() => setIsAddMemberOpen(true)}>
                            <UserPlus className="mr-2 h-4 w-4" /> Add Member
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search members..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="PRESIDENT">President</SelectItem>
                                <SelectItem value="VICE_PRESIDENT">Vice President</SelectItem>
                                <SelectItem value="SECRETARY">Secretary</SelectItem>
                                <SelectItem value="MEMBER">Member</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Members Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Member</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMembers.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={member.user.avatar} />
                                                <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{member.user.name}</p>
                                                <p className="text-sm text-slate-500">{member.user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getRoleIcon(member.role)}
                                            <span>{member.role.replace('_', ' ')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={member.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                            {member.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(member.joinedAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {member.status === 'PENDING' && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleApprove(member.id)}
                                                    >
                                                        <UserCheck className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleReject(member.id)}
                                                    >
                                                        <UserX className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                            {member.status === 'ACTIVE' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleRemove(member.id)}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add Member Dialog */}
            <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                <DialogContent className="sm:max-w-md flex items-center justify-center">
                    <div className="w-full">
                        <DialogHeader>
                            <DialogTitle>Add New Member</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="userId">User Email or ID</Label>
                                <Input
                                    id="userId"
                                    value={formData.userId}
                                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                    placeholder="Enter user email or ID"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MEMBER">Member</SelectItem>
                                        <SelectItem value="CORE_MEMBER">Core Member</SelectItem>
                                        <SelectItem value="SECRETARY">Secretary</SelectItem>
                                        <SelectItem value="TREASURER">Treasurer</SelectItem>
                                        <SelectItem value="VICE_PRESIDENT">Vice President</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio (Optional)</Label>
                                <Textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Brief description"
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setIsAddMemberOpen(false)} className="flex-1">
                                    Cancel
                                </Button>
                                <Button onClick={handleAddMember} className="flex-1">
                                    Add Member
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ClubMemberManagementPage;
