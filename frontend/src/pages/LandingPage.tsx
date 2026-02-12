import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Trophy,
  Calendar,
  BookOpen,
  Users,
  Zap,
  Shield,
  Globe,
  CheckCircle,
  Star,
  TrendingUp,
  Award,
  Code2,
  Lightbulb,
  Target,
  Crown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store';
import { mockHackathons, mockEvents, mockLeaderboard, mockColleges } from '@/data/mockData';

const features = [
  {
    icon: Trophy,
    title: 'Hackathon Network',
    description: 'Participate in nationwide hackathons, compete with the best, and win amazing prizes.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Calendar,
    title: 'Event Management',
    description: 'Discover and register for workshops, seminars, and networking events.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BookOpen,
    title: 'Resource Hub',
    description: 'Access study materials, project reports, and club documents from your college.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Users,
    title: 'Team Building',
    description: 'Form teams, invite members, and collaborate on projects seamlessly.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Zap,
    title: 'AI Recommendations',
    description: 'Get personalized suggestions for events, hackathons, and learning resources.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Enterprise-grade security with role-based access control and data protection.',
    color: 'from-slate-500 to-slate-700',
  },
];

const stats = [
  { label: 'Active Colleges', value: '500+', icon: Globe },
  { label: 'Students', value: '150K+', icon: Users },
  { label: 'Hackathons', value: '1,200+', icon: Trophy },
  { label: 'Events', value: '5,000+', icon: Calendar },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Computer Science Student',
    college: 'Tech University',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content: 'CollegeHub transformed my college experience. I found my dream team at a hackathon and won first place!',
    rating: 5,
  },
  {
    name: 'Michael Roberts',
    role: 'Faculty Organizer',
    college: 'State College of Engineering',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    content: 'Managing events and tracking student participation has never been easier. The analytics are incredible.',
    rating: 5,
  },
  {
    name: 'Emma Wilson',
    role: 'Student Participant',
    college: 'Innovation Institute',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    content: 'The AI recommendations helped me discover events I would have never found otherwise. Highly recommend!',
    rating: 5,
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        {/* Background Pattern */}
        <motion.div 
          style={{ y }}
          className="absolute inset-0 opacity-30"
        >
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--navy)) 1px, transparent 0)`,
            backgroundSize: '60px 60px',
          }} />
        </motion.div>

        {/* Gradient Orbs */}
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[hsl(var(--navy))] opacity-20 blur-3xl" />
        <div className="absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-[hsl(var(--teal))] opacity-20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--orange))] opacity-10 blur-3xl" />

        <motion.div 
          style={{ opacity }}
          className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--navy))]/20 bg-white/50 px-4 py-2 backdrop-blur-sm dark:bg-slate-800/50"
          >
            <span className="flex h-2 w-2 rounded-full bg-[hsl(var(--teal))]" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Now serving 500+ colleges nationwide
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Connect.{' '}
            <span className="gradient-text">Collaborate.</span>{' '}
            Create.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400 sm:text-xl"
          >
            The ultimate platform for college students to discover hackathons, 
            manage events, access resources, and build their future.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="btn-primary text-base"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="btn-outline text-base"
              onClick={() => navigate('/hackathons')}
            >
              Explore Hackathons
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center">
                  <stat.icon className="h-6 w-6 text-[hsl(var(--teal))]" />
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-slate-400 p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-slate-400"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Everything You Need to{' '}
              <span className="gradient-text">Succeed</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
              A complete platform designed to help students discover opportunities, 
              build skills, and connect with like-minded individuals.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800"
              >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100 ${feature.color}" style={{
                  background: `linear-gradient(135deg, ${feature.color.includes('amber') ? '#f59e0b, #f97316' : feature.color.includes('blue') ? '#3b82f6, #06b6d4' : feature.color.includes('emerald') ? '#10b981, #14b8a6' : feature.color.includes('violet') ? '#8b5cf6, #a855f7' : feature.color.includes('pink') ? '#ec4899, #f43f5e' : '#64748b, #334155'})`,
                  padding: '2px',
                }} />
                <div className="relative h-full rounded-xl bg-white p-6 dark:bg-slate-800">
                  <div className={`inline-flex rounded-xl bg-gradient-to-r p-3 ${feature.color}`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hackathons Section */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                Featured <span className="gradient-text">Hackathons</span>
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Join these exciting hackathons and showcase your skills
              </p>
            </div>
            <Button
              variant="outline"
              className="hidden sm:flex"
              onClick={() => navigate('/hackathons')}
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockHackathons.slice(0, 3).map((hackathon, index) => (
              <motion.div
                key={hackathon.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800"
                onClick={() => navigate(`/hackathons/${hackathon.id}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={hackathon.bannerImage}
                    alt={hackathon.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-flex items-center rounded-full bg-[hsl(var(--teal))] px-2.5 py-0.5 text-xs font-medium text-white">
                      {hackathon.mode}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {hackathon.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                    {hackathon.shortDescription}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Trophy className="h-4 w-4 text-[hsl(var(--orange))]" />
                      <span>${hackathon.prizePool.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Users className="h-4 w-4" />
                      <span>{hackathon.registeredTeams} teams</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Button
            variant="outline"
            className="mt-8 w-full sm:hidden"
            onClick={() => navigate('/hackathons')}
          >
            View All Hackathons
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="section-padding bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                Upcoming <span className="gradient-text">Events</span>
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Workshops, seminars, and networking opportunities
              </p>
            </div>
            <Button
              variant="outline"
              className="hidden sm:flex"
              onClick={() => navigate('/events')}
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mockEvents.slice(0, 4).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={event.bannerImage}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-slate-900">
                      {event.eventType}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-1 text-base font-semibold text-slate-900 dark:text-white">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(event.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <Users className="h-4 w-4" />
                    <span>{event.registeredCount}/{event.capacity}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Top <span className="gradient-text">Performers</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
              Recognizing the most active and accomplished students on our platform
            </p>
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-8 lg:flex-row">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="order-2 flex flex-col items-center lg:order-1"
            >
              <div className="relative">
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-slate-300 dark:border-slate-600">
                  <img
                    src={mockLeaderboard[1]?.avatar}
                    alt={mockLeaderboard[1]?.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-slate-400 text-sm font-bold text-white">
                  2
                </div>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{mockLeaderboard[1]?.name}</h3>
              <p className="text-sm text-slate-500">{mockLeaderboard[1]?.collegeName}</p>
              <p className="mt-1 text-xl font-bold text-[hsl(var(--navy))]">
                {mockLeaderboard[1]?.points.toLocaleString()} pts
              </p>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="order-1 flex flex-col items-center lg:order-2"
            >
              <div className="relative">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-[hsl(var(--orange))]">
                  <img
                    src={mockLeaderboard[0]?.avatar}
                    alt={mockLeaderboard[0]?.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-[hsl(var(--orange))] text-lg font-bold text-white">
                  <Crown className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold">{mockLeaderboard[0]?.name}</h3>
              <p className="text-sm text-slate-500">{mockLeaderboard[0]?.collegeName}</p>
              <p className="mt-1 text-2xl font-bold text-[hsl(var(--orange))]">
                {mockLeaderboard[0]?.points.toLocaleString()} pts
              </p>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="order-3 flex flex-col items-center"
            >
              <div className="relative">
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-amber-600">
                  <img
                    src={mockLeaderboard[2]?.avatar}
                    alt={mockLeaderboard[2]?.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-amber-600 text-sm font-bold text-white">
                  3
                </div>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{mockLeaderboard[2]?.name}</h3>
              <p className="text-sm text-slate-500">{mockLeaderboard[2]?.collegeName}</p>
              <p className="mt-1 text-xl font-bold text-amber-600">
                {mockLeaderboard[2]?.points.toLocaleString()} pts
              </p>
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              onClick={() => navigate('/leaderboard')}
            >
              View Full Leaderboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Loved by <span className="gradient-text">Students</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
              See what students and faculty are saying about CollegeHub
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-800"
              >
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-4 text-slate-600 dark:text-slate-400">
                  "{testimonial.content}"
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {testimonial.role} at {testimonial.college}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[hsl(var(--navy))] to-[hsl(var(--teal))] px-6 py-16 text-center sm:px-12 lg:py-24">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              }} />
            </div>

            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Ready to Start Your Journey?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
                Join thousands of students discovering opportunities, building skills, 
                and creating their future with CollegeHub.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-white text-[hsl(var(--navy))] hover:bg-white/90"
                  onClick={() => navigate('/register')}
                >
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/hackathons')}
                >
                  Explore Hackathons
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
