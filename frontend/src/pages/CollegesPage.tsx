import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Users,
  GraduationCap,
  Trophy,
  Calendar,
  BookOpen,
  ExternalLink,
  ArrowRight,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockColleges } from '@/data/mockData';

const CollegesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredColleges = mockColleges.filter((college) => {
    if (searchQuery && !college.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !college.location.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--navy))] to-[hsl(var(--teal))] px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="relative mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20"
          >
            <Building2 className="h-10 w-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
          >
            Partner Colleges
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-white/80"
          >
            Discover leading institutions using CollegeHub to empower their students
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-8 max-w-2xl"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search colleges by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 pr-4 text-base shadow-lg"
              />
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4"
          >
            <div className="text-center">
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-white/80">Colleges</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">150K+</p>
              <p className="text-sm text-white/80">Students</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">50+</p>
              <p className="text-sm text-white/80">States</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-sm text-white/80">Satisfaction</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Colleges Grid */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              All Colleges <span className="text-slate-400">({filteredColleges.length})</span>
            </h2>
          </div>

          {filteredColleges.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredColleges.map((college, index) => (
                <motion.div
                  key={college.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800"
                >
                  {/* Header */}
                  <div className="relative h-32 bg-gradient-to-br from-[hsl(var(--navy))] to-[hsl(var(--teal))]">
                    <div className="absolute -bottom-10 left-6">
                      <div className="flex h-20 w-20 items-center justify-center rounded-xl border-4 border-white bg-white shadow-lg dark:border-slate-800">
                        <img
                          src={college.logo}
                          alt={college.name}
                          className="h-16 w-16"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-12 pb-6 px-6">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {college.name}
                    </h3>
                    <p className="text-sm text-slate-500">{college.shortName}</p>

                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="h-4 w-4" />
                      {college.location}
                    </div>

                    {college.description && (
                      <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                        {college.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="mt-4 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 dark:border-slate-700">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-[hsl(var(--navy))] dark:text-[hsl(var(--teal))]">
                          <GraduationCap className="h-4 w-4" />
                          <span className="font-bold">{(college.studentCount || 0).toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-slate-500">Students</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-[hsl(var(--navy))] dark:text-[hsl(var(--teal))]">
                          <Users className="h-4 w-4" />
                          <span className="font-bold">{college.facultyCount}</span>
                        </div>
                        <p className="text-xs text-slate-500">Faculty</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-[hsl(var(--navy))] dark:text-[hsl(var(--teal))]">
                          <Trophy className="h-4 w-4" />
                          <span className="font-bold">{college.stats.totalHackathons}</span>
                        </div>
                        <p className="text-xs text-slate-500">Hackathons</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate(`/hackathons?college=${college.id}`)}
                      >
                        <Trophy className="mr-2 h-4 w-4" />
                        Hackathons
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate(`/events?college=${college.id}`)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Events
                      </Button>
                    </div>

                    {college.website && (
                      <a
                        href={college.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center justify-center gap-2 text-sm text-[hsl(var(--navy))] hover:underline dark:text-[hsl(var(--teal))]"
                      >
                        Visit Website
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Search className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                No colleges found
              </h3>
              <p className="mt-2 text-slate-500">
                Try adjusting your search query
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[hsl(var(--navy))] to-[hsl(var(--teal))] px-6 py-16 text-center sm:px-12">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              }} />
            </div>

            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Want to Partner with Us?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
                Join hundreds of colleges using CollegeHub to empower their students
                with opportunities and resources.
              </p>
              <Button
                size="lg"
                className="mt-8 bg-white text-[hsl(var(--navy))] hover:bg-white/90"
              >
                Become a Partner
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CollegesPage;
