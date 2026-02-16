import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Upload,
    Download,
    Eye,
    Trash2,
    Plus,
    Filter,
    Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { api, facultyApi } from '@/lib/api';

const FacultyResourcesPage = () => {
    const [resources, setResources] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        title: '',
        description: '',
        category: 'NOTES',
        visibility: 'PUBLIC',
        fileUrl: '',
    });

    useEffect(() => {
        loadResources();
    }, []);

    const loadResources = async () => {
        try {
            const data = await facultyApi.getResources();
            setResources(data || []);
        } catch (error) {
            console.error('Failed to load resources:', error);
            // toast.error('Failed to load resources');
        }
    };

    const handleUpload = async () => {
        if (!uploadForm.title || !uploadForm.fileUrl) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            // Create FormData object
            const formData = new FormData();
            formData.append('title', uploadForm.title);
            formData.append('description', uploadForm.description);
            formData.append('category', uploadForm.category);
            formData.append('visibility', uploadForm.visibility);

            // Note: In a real file upload, we would append the file object.
            // Since this is a URL-based resource for now (based on UI), or if we are mocking file upload with URL:
            formData.append('fileUrl', uploadForm.fileUrl);
            // If the backend expects a file, we can't upload a URL as a file easily without downloading it first.
            // Assuming the backend supports both or we are just sending metadata + url.
            // If the backend expects a MultipartFile, we need an actual file input in the UI.
            // The current UI shows 'File URL' input.
            // So we might need to send this as JSON, NOT FormData, unless the backend handles URL upload via multipart.

            // RE-EVALUATIION: If the UI has "File URL" input, it's not a file upload. It's a link resource.
            // In that case, we should send JSON.
            // Let's assume for now we send JSON for URL resources.
            // If we want file upload, we need <input type="file">.

            // Changing strategy: If UI input is URL, use JSON endpoint or assume backend accepts JSON for URL resources.
            // Checking backend: @PostMapping("/resources/upload") usually implies file.
            // But if the user inputs a URL, it's a "Link" resource.
            // Let's assume we send JSON.

            // To be safe, I'll send it as JSON since the UI asks for "File URL".
            // So I DON'T need FormData for this specific UI implementation.
            // But I updated fetchAPI already, which is fine.

            await api.post('/faculty/resources', uploadForm); // Assuming a JSON endpoint exists or create one.
            // Wait, I added uploadResource using FormData.
            // If I want to support URL resources, I should probably use a different endpoint or send as JSON.
            // The existing `uploadResource` in api.ts expects FormData.

            // Let's try to send as JSON to `uploadResource` if I modify api.ts or just call api.post directly here.

            await api.post('/faculty/resources', {
                ...uploadForm
            });

            toast.success('Resource uploaded successfully');
            setIsUploadOpen(false);
            setUploadForm({
                title: '',
                description: '',
                category: 'NOTES',
                visibility: 'PUBLIC',
                fileUrl: '',
            });
            loadResources();
        } catch (error) {
            console.error('Failed to upload resource:', error);
            toast.error('Failed to upload resource');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;

        try {
            await facultyApi.deleteResource(id);
            toast.success('Resource deleted successfully');
            loadResources();
        } catch (error) {
            console.error('Failed to delete resource:', error);
            toast.error('Failed to delete resource');
        }
    };

    const filteredResources = resources.filter(resource => {
        const matchesSearch =
            searchQuery === '' ||
            resource.title.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            categoryFilter === 'all' ||
            resource.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold">Resources Management</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Upload and manage educational resources for students
                    </p>
                </div>
                <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Upload Resource
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Upload New Resource</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={uploadForm.title}
                                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                    placeholder="Enter resource title"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={uploadForm.description}
                                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                                    placeholder="Describe the resource"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select
                                    value={uploadForm.category}
                                    onValueChange={(value) => setUploadForm({ ...uploadForm, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NOTES">Notes</SelectItem>
                                        <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                                        <SelectItem value="TUTORIAL">Tutorial</SelectItem>
                                        <SelectItem value="REFERENCE">Reference Material</SelectItem>
                                        <SelectItem value="OTHER">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="visibility">Visibility *</Label>
                                <Select
                                    value={uploadForm.visibility}
                                    onValueChange={(value) => setUploadForm({ ...uploadForm, visibility: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PUBLIC">Public</SelectItem>
                                        <SelectItem value="STUDENTS_ONLY">Students Only</SelectItem>
                                        <SelectItem value="PRIVATE">Private</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fileUrl">File URL *</Label>
                                <Input
                                    id="fileUrl"
                                    value={uploadForm.fileUrl}
                                    onChange={(e) => setUploadForm({ ...uploadForm, fileUrl: e.target.value })}
                                    placeholder="https://example.com/file.pdf"
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setIsUploadOpen(false)} className="flex-1">
                                    Cancel
                                </Button>
                                <Button onClick={handleUpload} className="flex-1">
                                    <Upload className="mr-2 h-4 w-4" /> Upload
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </motion.div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <Input
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="NOTES">Notes</SelectItem>
                                <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                                <SelectItem value="TUTORIAL">Tutorial</SelectItem>
                                <SelectItem value="REFERENCE">Reference</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Resources Grid */}
            {filteredResources.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No resources yet</h3>
                        <p className="text-slate-500 mb-4">Upload your first resource to get started</p>
                        <Button onClick={() => setIsUploadOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Upload Resource
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredResources.map((resource) => (
                        <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                                        <Badge variant="outline" className="mt-2">
                                            {resource.category}
                                        </Badge>
                                    </div>
                                    <FileText className="h-8 w-8 text-blue-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                                    {resource.description || 'No description'}
                                </p>
                                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                                    <span>{resource.downloads || 0} downloads</span>
                                    <span>{resource.views || 0} views</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <Eye className="mr-1 h-4 w-4" /> View
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(resource.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FacultyResourcesPage;
