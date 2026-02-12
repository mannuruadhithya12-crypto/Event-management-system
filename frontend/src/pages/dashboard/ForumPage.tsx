import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    TrendingUp,
    Filter,
    Plus,
    MessageCircle,
    ThumbsUp,
    ThumbsDown,
    Search,
    Clock,
    User as UserIcon,
    ChevronRight,
    ArrowUpCircle,
    X,
    Send,
    MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { forumApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface ForumComment {
    id: string;
    content: string;
    author: {
        id: string;
        name: string;
        avatar?: string;
        collegeName?: string;
    };
    createdAt: string;
}

interface ForumPost {
    id: string;
    title: string;
    content: string;
    category: string;
    author: {
        id: string;
        name: string;
        avatar?: string;
        collegeName?: string;
    };
    upvotes: number;
    downvotes: number;
    createdAt: string;
    comments: ForumComment[];
}

const CATEGORIES = [
    "General",
    "Hackathons",
    "Events",
    "Technology",
    "Career",
    "Campus Life",
    "Projects"
];

const ForumPage = () => {
    const { user } = useAuthStore();
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', category: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Detailed View State
    const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
    const [newComment, setNewComment] = useState('');
    const [commenting, setCommenting] = useState(false);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await forumApi.getPosts();
            setPosts(data);
        } catch (error: any) {
            console.error('Failed to fetch posts:', error);
            if (error.message && error.message.includes("401")) {
                toast.error("Unauthenticated. Please login again.");
            } else {
                toast.error('Failed to load forum posts. Is backend running?');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleCreatePost = async () => {
        if (!user) {
            toast.error("You must be logged in to post.");
            return;
        }
        if (!newPost.title || !newPost.content || !newPost.category) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setIsSubmitting(true);
            const created = await forumApi.createPost(user.id, newPost.title, newPost.content, newPost.category);
            setPosts([created, ...posts]);
            setNewPost({ title: '', content: '', category: '' });
            setIsCreateOpen(false);
            toast.success('Discussion started successfully!');
        } catch (error: any) {
            console.error(error);
            if (error.message && error.message.includes("401")) {
                toast.error("Session expired. Please login again.");
            } else if (error.message && error.message.includes("500")) {
                toast.error("Server error. User ID might be invalid. Try relogin.");
            } else {
                toast.error('Failed to create post');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpvote = async (postId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await forumApi.upvotePost(postId);
            setPosts(posts.map(p => p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p));
            if (selectedPost?.id === postId) {
                setSelectedPost(prev => prev ? { ...prev, upvotes: prev.upvotes + 1 } : null);
            }
            toast.success('Upvoted!');
        } catch (error) {
            toast.error('Failed to upvote');
        }
    };

    const handleDownvote = async (postId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await forumApi.downvotePost(postId);
            // Typically downvotes might reduce score or be tracked separately. 
            // Assuming we just increment downvotes count.
            setPosts(posts.map(p => p.id === postId ? { ...p, downvotes: p.downvotes + 1 } : p));
            if (selectedPost?.id === postId) {
                setSelectedPost(prev => prev ? { ...prev, downvotes: prev.downvotes + 1 } : null);
            }
            toast.success('Downvoted');
        } catch (error) {
            toast.error('Failed to downvote');
        }
    };

    const handleAddComment = async () => {
        if (!user || !selectedPost || !newComment.trim()) return;

        try {
            setCommenting(true);
            const comment = await forumApi.addComment(selectedPost.id, user.id, newComment);

            // Update selected post
            const updatedPost = {
                ...selectedPost,
                comments: [...(selectedPost.comments || []), comment]
            };
            setSelectedPost(updatedPost);

            // Update posts list
            setPosts(posts.map(p => p.id === selectedPost.id ? updatedPost : p));

            setNewComment('');
            toast.success('Comment added!');
        } catch (error) {
            toast.error('Failed to add comment');
        } finally {
            setCommenting(false);
        }
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(var(--navy))] via-[hsl(var(--navy))]/90 to-[hsl(var(--teal))] p-8 text-white shadow-2xl">
                <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-extrabold tracking-tight"
                        >
                            Community Forum
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-2 text-lg text-white/80 max-w-xl"
                        >
                            The heartbeat of our university. Share ideas, solve problems, and grow together in our digital nexus.
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="gap-2 bg-white text-[hsl(var(--navy))] hover:bg-white/90 shadow-lg rounded-2xl group transition-all hover:pr-8">
                                    <Plus className="h-5 w-5" />
                                    Create Discussion
                                    <ChevronRight className="h-4 w-4 absolute right-4 opacity-0 group-hover:opacity-100 transition-all" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Start a Discussion</DialogTitle>
                                    <DialogDescription>
                                        Share your thoughts, ask questions, or start a debate.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <label htmlFor="title" className="text-sm font-medium">Title</label>
                                        <Input
                                            id="title"
                                            placeholder="What's this discussion about?"
                                            value={newPost.title}
                                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="category" className="text-sm font-medium">Category</label>
                                        <Select
                                            value={newPost.category}
                                            onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CATEGORIES.map(cat => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="content" className="text-sm font-medium">Content</label>
                                        <Textarea
                                            id="content"
                                            placeholder="Elaborate on your topic..."
                                            value={newPost.content}
                                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                            rows={5}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                    <Button onClick={handleCreatePost} disabled={isSubmitting}>
                                        {isSubmitting ? 'Posting...' : 'Post Discussion'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </motion.div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[hsl(var(--teal))]/20 blur-3xl" />
            </div>

            <div className="grid gap-8 lg:grid-cols-4">
                {/* Search and Filters */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Search discussions by title or category..."
                                className="pl-12 h-12 bg-transparent border-none focus-visible:ring-0 text-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto px-2">
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-[180px] h-10 rounded-xl border-none bg-slate-50 dark:bg-slate-800">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Categories</SelectItem>
                                    {CATEGORIES.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
                            <Button variant="ghost" className="gap-2 h-10 rounded-xl">
                                <Clock className="h-4 w-4" />
                                Recent
                            </Button>
                        </div>
                    </div>

                    {/* Main Feed */}
                    <div className="space-y-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--teal))]" />
                                <p className="mt-4 text-slate-500 font-medium">Curating discussions...</p>
                            </div>
                        ) : filteredPosts.length === 0 ? (
                            <Card className="border-dashed border-2 py-20 flex flex-col items-center justify-center text-center bg-transparent">
                                <MessageSquare className="h-16 w-16 text-slate-200 mb-4" />
                                <h3 className="text-xl font-bold">No discussions found</h3>
                                <p className="text-slate-500 max-w-sm mt-1">Try adjusting your search or be the first to start a conversation in this category.</p>
                                <Button variant="outline" className="mt-6 rounded-xl" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                                    Clear Search
                                </Button>
                            </Card>
                        ) : (
                            <div className="grid gap-6">
                                <AnimatePresence mode='popLayout'>
                                    {filteredPosts.map((post, idx) => (
                                        <motion.div
                                            key={post.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            layout
                                        >
                                            <Card
                                                className="group hover:shadow-xl transition-all duration-300 border-slate-100 dark:border-slate-800 hover:border-[hsl(var(--teal))]/30 overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm cursor-pointer"
                                                onClick={() => setSelectedPost(post)}
                                            >
                                                <div className="flex gap-4 p-6">
                                                    {/* Voting Side */}
                                                    <div className="flex flex-col items-center gap-2 pr-4 border-r border-slate-100 dark:border-slate-800">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-10 w-10 rounded-xl hover:bg-[hsl(var(--teal))]/10 hover:text-[hsl(var(--teal))]"
                                                            onClick={(e) => handleUpvote(post.id, e)}
                                                        >
                                                            <ArrowUpCircle className="h-6 w-6" />
                                                        </Button>
                                                        <span className="font-bold text-lg text-slate-700 dark:text-slate-300">
                                                            {post.upvotes}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-10 w-10 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 opacity-50 hover:opacity-100"
                                                            onClick={(e) => handleDownvote(post.id, e)}
                                                        >
                                                            <ThumbsDown className="h-5 w-5" />
                                                        </Button>
                                                    </div>

                                                    <div className="flex-1 space-y-3">
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="secondary" className="rounded-lg bg-[hsl(var(--navy))]/5 text-[hsl(var(--navy))] dark:bg-[hsl(var(--teal))]/10 dark:text-[hsl(var(--teal))] border-none font-bold px-3 py-1">
                                                                    {post.category}
                                                                </Badge>
                                                                <span className="flex items-center gap-1 text-xs text-slate-400">
                                                                    <Clock className="h-3 w-3" />
                                                                    {formatDistanceToNow(new Date(post.createdAt))} ago
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-[hsl(var(--teal))] transition-colors leading-tight">
                                                            {post.title}
                                                        </h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                            {post.content}
                                                        </p>

                                                        <div className="flex items-center justify-between pt-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex items-center gap-1.5 text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full text-xs font-bold">
                                                                    <MessageCircle className="h-4 w-4" />
                                                                    {post.comments?.length || 0} Comments
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="text-right">
                                                                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                                                                        {post.author?.name || 'Anonymous User'}
                                                                    </p>
                                                                    <p className="text-[10px] text-slate-500">
                                                                        {post.author?.collegeName || 'Contributor'}
                                                                    </p>
                                                                </div>
                                                                <Avatar className="h-9 w-9 border-2 border-[hsl(var(--teal))]/20 shadow-sm">
                                                                    <AvatarImage src={post.author?.avatar} />
                                                                    <AvatarFallback>
                                                                        <UserIcon className="h-4 w-4" />
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Stats Card */}
                    <Card className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden rounded-2xl sticky top-4">
                        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <CardTitle className="text-base flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-[hsl(var(--orange))]" />
                                Trending Topics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {['#Hackathon2024', '#CodingTips', '#CampusLife', '#PlacementPrep', '#UIUXDesign'].map((tag, idx) => (
                                    <div key={tag} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/10 cursor-pointer transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-slate-300 group-hover:text-[hsl(var(--teal))]">0{idx + 1}</span>
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{tag}</span>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] font-bold border-slate-200">
                                            {Math.floor(Math.random() * 50) + 10}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Community Guidelines */}
                    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-100 dark:border-amber-900/30 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2 text-amber-900 dark:text-amber-200">
                                <Badge className="bg-amber-500">Rules</Badge>
                                Forum Guidelines
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="text-xs space-y-2 text-amber-800/80 dark:text-amber-200/60 font-medium">
                                <li className="flex gap-2">
                                    <div className="h-1 w-1 rounded-full bg-amber-400 mt-1.5" />
                                    Be respectful to all members
                                </li>
                                <li className="flex gap-2">
                                    <div className="h-1 w-1 rounded-full bg-amber-400 mt-1.5" />
                                    No spamming or self-promotion
                                </li>
                                <li className="flex gap-2">
                                    <div className="h-1 w-1 rounded-full bg-amber-400 mt-1.5" />
                                    Keep discussions on-topic
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Post Detail Dialog */}
            <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
                    <div className="flex-1 overflow-y-auto">
                        {selectedPost && (
                            <>
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Badge>{selectedPost.category}</Badge>
                                        <span className="text-xs text-slate-500">{formatDistanceToNow(new Date(selectedPost.createdAt))} ago</span>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-4">{selectedPost.title}</h2>
                                    <div className="flex items-center gap-3 mb-6">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={selectedPost.author?.avatar} />
                                            <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
                                        </Avatar>
                                        <div className="text-sm">
                                            <p className="font-semibold">{selectedPost.author?.name}</p>
                                            <p className="text-slate-500 text-xs">{selectedPost.author?.collegeName}</p>
                                        </div>
                                    </div>
                                    <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                                        <p className="whitespace-pre-wrap">{selectedPost.content}</p>
                                    </div>
                                </div>

                                <div className="p-6 bg-white dark:bg-slate-950">
                                    <h3 className="font-bold flex items-center gap-2 mb-6">
                                        <MessageCircle className="h-5 w-5" />
                                        Comments ({selectedPost.comments?.length || 0})
                                    </h3>

                                    <div className="space-y-6 mb-8">
                                        {selectedPost.comments?.length > 0 ? (
                                            selectedPost.comments.map((comment) => (
                                                <div key={comment.id} className="flex gap-4">
                                                    <Avatar className="h-8 w-8 mt-1">
                                                        <AvatarImage src={comment.author?.avatar} />
                                                        <AvatarFallback><UserIcon className="h-3 w-3" /></AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl rounded-tl-none">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-semibold text-sm">{comment.author?.name}</span>
                                                            <span className="text-xs text-slate-400">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                                                        </div>
                                                        <p className="text-sm text-slate-600 dark:text-slate-300">{comment.content}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-slate-500">
                                                <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                                <p>No comments yet. Be the first to share your thoughts!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                        <div className="flex gap-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <div className="flex-1 relative">
                                <Textarea
                                    placeholder="Write a comment..."
                                    className="min-h-[80px] pr-12 resize-none"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <Button
                                    size="icon"
                                    className="absolute bottom-2 right-2 h-8 w-8 hover:bg-[hsl(var(--teal))]"
                                    disabled={!newComment.trim() || commenting}
                                    onClick={handleAddComment}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ForumPage;
