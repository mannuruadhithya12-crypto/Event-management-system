import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  Share2,
  Bookmark,
  CheckCircle,
  User,
  Mic,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { mockEvents } from '@/data/mockData';
import { useAuthStore } from '@/store';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { feedbackApi } from '@/lib/api';
import { format } from 'date-fns';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchFeedback();
    }
  }, [id]);

  const fetchFeedback = async () => {
    try {
      const data = await feedbackApi.getByEvent(id!);
      setFeedbacks(data);
    } catch (e) {
      console.error("Failed to fetch feedback", e);
    }
  };

  const handlePostFeedback = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to post feedback");
      return;
    }
    if (!comment) {
      toast.error("Please add a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      await feedbackApi.submit(id!, {
        userId: user!.id,
        rating,
        comment
      });
      toast.success("Feedback posted!");
      setComment('');
      fetchFeedback();
    } catch (e) {
      toast.error("Failed to post feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Event not found</h1>
          <Button className="mt-4" onClick={() => navigate('/events')}>
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  const handleRegister = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to register');
      navigate('/login');
      return;
    }
    toast.success('Registration successful!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const isFull = event.registeredCount >= (event.capacity || Infinity);
  const daysUntilEvent = Math.ceil(
    (new Date(event.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <Button variant="ghost" onClick={() => navigate('/events')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-[hsl(var(--teal))] text-white capitalize">
                  {event.eventType.replace('_', ' ')}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white capitalize">
                  {event.mode}
                </Badge>
              </div>

              <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                {event.title}
              </h1>

              <p className="mt-2 text-lg text-white/80">
                by {event.collegeName}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(event.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span className="capitalize">{event.mode}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="about">About</TabsTrigger>
                {event.agenda && event.agenda.length > 0 && <TabsTrigger value="agenda">Agenda</TabsTrigger>}
                {event.speakers && event.speakers.length > 0 && <TabsTrigger value="speakers">Speakers</TabsTrigger>}
                {event.status === 'completed' && <TabsTrigger value="feedback">Feedback</TabsTrigger>}
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <div className="prose max-w-none dark:prose-invert">
                  <h3 className="text-xl font-semibold">About this Event</h3>
                  <p className="text-slate-600 dark:text-slate-400">{event.description}</p>

                  {event.requirements && (
                    <>
                      <h3 className="mt-6 text-xl font-semibold">Requirements</h3>
                      <p className="text-slate-600 dark:text-slate-400">{event.requirements}</p>
                    </>
                  )}

                  <h3 className="mt-6 text-xl font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {event.agenda && event.agenda.length > 0 && (
                <TabsContent value="agenda" className="mt-6">
                  <div className="space-y-4">
                    {event.agenda.map((item) => (
                      <div key={item.id} className="flex gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--navy))]/10 text-[hsl(var(--navy))] dark:bg-[hsl(var(--teal))]/10 dark:text-[hsl(var(--teal))]">
                          <Clock className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-medium">{item.time}</p>
                          <h4 className="text-lg font-semibold">{item.title}</h4>
                          {item.description && (
                            <p className="mt-1 text-slate-600 dark:text-slate-400">{item.description}</p>
                          )}
                          {item.speaker && (
                            <p className="mt-2 text-sm text-slate-500">Speaker: {item.speaker}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}

              {event.speakers && event.speakers.length > 0 && (
                <TabsContent value="speakers" className="mt-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {event.speakers.map((speaker) => (
                      <div key={speaker.id} className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                        <img
                          src={speaker.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${speaker.name}`}
                          alt={speaker.name}
                          className="h-16 w-16 rounded-full"
                        />
                        <div>
                          <h4 className="font-semibold">{speaker.name}</h4>
                          <p className="text-sm text-slate-500">{speaker.designation}</p>
                          {speaker.company && (
                            <p className="text-sm text-slate-500">{speaker.company}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}

              <TabsContent value="feedback" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submit Your Feedback</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            variant="ghost"
                            size="icon"
                            className={cn("transition-all", rating >= star ? "text-amber-400" : "text-slate-200")}
                            onClick={() => setRating(star)}
                          >
                            <Star className={cn("h-8 w-8", rating >= star && "fill-current")} />
                          </Button>
                        ))}
                      </div>
                      <Textarea
                        placeholder="Share your experience and suggestions..."
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="rounded-2xl border-slate-200"
                      />
                      <Button
                        onClick={handlePostFeedback}
                        disabled={isSubmitting}
                        className="bg-[hsl(var(--teal))] text-white h-12 rounded-xl font-bold px-8"
                      >
                        {isSubmitting ? 'Posting...' : 'Post Feedback'}
                      </Button>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      Recent Reviews
                      <Badge variant="outline">{feedbacks.length}</Badge>
                    </h4>
                    {feedbacks.map((f, i) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={f.id}
                        className="flex gap-4 p-5 rounded-[24px] border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50"
                      >
                        <img
                          src={f.student?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.student?.firstName}`}
                          alt="avatar"
                          className="h-12 w-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-black text-sm">{f.student?.firstName} {f.student?.lastName}</p>
                            <span className="text-xs text-slate-400 font-medium">{format(new Date(f.submittedAt), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex gap-0.5 my-1.5">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star key={j} className={cn("h-3 w-3", j < f.rating ? "text-amber-400 fill-current" : "text-slate-200")} />
                            ))}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">"{f.comment}"</p>
                        </div>
                      </motion.div>
                    ))}
                    {feedbacks.length === 0 && (
                      <p className="text-center text-slate-400 py-8 italic">No feedback yet. Be the first to share your experience!</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <div className="text-center">
                <Calendar className="mx-auto h-12 w-12 text-[hsl(var(--teal))]" />
                <p className="mt-2 text-2xl font-bold">
                  {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <p className="text-sm text-slate-500">
                  {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Capacity</span>
                  <span className="font-medium">{event.capacity} people</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Registered</span>
                  <span className="font-medium">{event.registeredCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Spots Left</span>
                  <span className="font-medium">{event.capacity ? event.capacity - event.registeredCount : 'Unlimited'}</span>
                </div>
              </div>

              {daysUntilEvent > 0 && (
                <div className="mt-4 rounded-lg bg-[hsl(var(--teal))]/10 p-3 text-center">
                  <p className="text-sm text-[hsl(var(--teal))]">
                    {daysUntilEvent} days until event
                  </p>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <Button
                  className="btn-primary flex-1"
                  onClick={handleRegister}
                  disabled={isFull}
                >
                  {isFull ? 'Event Full' : 'Register Now'}
                </Button>
                <Button variant="outline" size="icon" onClick={() => setIsBookmarked(!isBookmarked)}>
                  <Bookmark className={cn("h-5 w-5", isBookmarked && "fill-current")} />
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {event.requiresApproval && (
                <p className="mt-3 text-center text-xs text-slate-500">
                  Registration requires approval from organizer
                </p>
              )}
            </div>

            {/* Organizer Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-semibold">Organizer</h3>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--navy))]">
                  <span className="text-lg font-bold text-white">
                    {event.organizerName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{event.organizerName}</p>
                  <p className="text-sm text-slate-500">{event.collegeName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
