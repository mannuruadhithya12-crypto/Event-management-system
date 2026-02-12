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
    ArrowUpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { forumApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const ForumPage = () => {
    const { user } = useAuthStore();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await forumApi.getPosts();
            setPosts(data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            toast.error('Failed to load forum posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleUpvote = async (postId: string) => {
        try {
            await forumApi.upvotePost(postId);
            setPosts(posts.map(p => p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p));
            toast.success('Post upvoted!');
        } catch (error) {
            toast.error('Failed to upvote');
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                        <Button size="lg" className="gap-2 bg-white text-[hsl(var(--navy))] hover:bg-white/90 shadow-lg rounded-2xl group transition-all hover:pr-8">
                            <Plus className="h-5 w-5" />
                            Create Discussion
                            <ChevronRight className="h-4 w-4 absolute right-4 opacity-0 group-hover:opacity-100 transition-all" />
                        </Button>
                    </motion.div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[hsl(var(--teal))]/20 blur-3xl" />
            </div>

            <div className="grid gap-8 lg:grid-cols-4">
                {/* Fixed Search and Filter Bar for Desktop */}
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
                            <Button variant="ghost" className="gap-2 h-10 rounded-xl">
                                <Filter className="h-4 w-4" />
                                All Categories
                            </Button>
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
                            <Card className="border-dashed border-2 py-20 flex flex-col items-center justify-center text-center">
                                <MessageSquare className="h-16 w-16 text-slate-200 mb-4" />
                                <h3 className="text-xl font-bold">No discussions found</h3>
                                <p className="text-slate-500 max-w-sm mt-1">Try adjusting your search or be the first to start a conversation in this category.</p>
                                <Button variant="outline" className="mt-6 rounded-xl" onClick={() => setSearchQuery('')}>
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
                                            <Card className="group hover:shadow-xl transition-all duration-300 border-slate-100 dark:border-slate-800 hover:border-[hsl(var(--teal))]/30 overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                                                <div className="flex gap-4 p-6">
                                                    {/* Voting Side */}
                                                    <div className="flex flex-col items-center gap-2 pr-4 border-r border-slate-100 dark:border-slate-800">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-10 w-10 rounded-xl hover:bg-[hsl(var(--teal))]/10 hover:text-[hsl(var(--teal))]"
                                                            onClick={() => handleUpvote(post.id)}
                                                        >
                                                            <ArrowUpCircle className="h-6 w-6" />
                                                        </Button>
                                                        <span className="font-bold text-lg text-slate-700 dark:text-slate-300">
                                                            {post.upvotes}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-10 w-10 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 opacity-50"
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

                                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-[hsl(var(--teal))] transition-colors cursor-pointer leading-tight">
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
                                                                <div className="flex items-center -space-x-2">
                                                                    {[1, 2, 3].map(i => (
                                                                        <Avatar key={i} className="h-6 w-6 border-2 border-white dark:border-slate-900 shadow-sm">
                                                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + post.id}`} />
                                                                        </Avatar>
                                                                    ))}
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
                    <Card className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden rounded-2xl">
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
                            <Button variant="ghost" className="w-full text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40">
                                Read Full Rules
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Pro Banner */}
                    <div className="group relative rounded-2xl bg-[hsl(var(--navy))] p-1 p-1">
                        <div className="rounded-xl bg-[hsl(var(--navy))] p-6 text-white overflow-hidden relative">
                            <h4 className="text-lg font-bold">Top Contributors</h4>
                            <p className="text-xs text-white/70 mt-1">Get rewarded for your help.</p>
                            <div className="mt-6 flex flex-col gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="relative">
                                            <Avatar className="h-8 w-8 border border-white/20">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=avatar${i}`} />
                                            </Avatar>
                                            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-400 flex items-center justify-center text-[8px] font-bold text-[hsl(var(--navy))]">
                                                {i}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${100 - (i * 20)}%` }}
                                                    className="h-full bg-[hsl(var(--teal))]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Glow */}
                            <div className="absolute top-0 right-0 h-20 w-20 bg-[hsl(var(--teal))]/20 blur-2xl group-hover:bg-[hsl(var(--teal))]/40 transition-all" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForumPage;
