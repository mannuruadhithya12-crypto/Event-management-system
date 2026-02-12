import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Calendar,
  MapPin,
  Users,
  Clock,
  Filter,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { mockEvents, mockColleges } from '@/data/mockData';
import type { EventFilters } from '@/types';

const eventTypes = [
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'competition', label: 'Competition' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'sports', label: 'Sports' },
  { value: 'tech_talk', label: 'Tech Talk' },
  { value: 'networking', label: 'Networking' },
];

const EventsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<EventFilters>({});

  const filteredEvents = mockEvents.filter((event) => {
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.eventType && filters.eventType.length > 0 && !filters.eventType.includes(event.eventType)) {
      return false;
    }
    if (filters.mode && filters.mode.length > 0 && !filters.mode.includes(event.mode)) {
      return false;
    }
    if (filters.college && event.collegeId !== filters.college) {
      return false;
    }
    return true;
  });

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const activeFiltersCount = Object.values(filters).filter(v => 
    v && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--teal))] to-[hsl(var(--navy))] px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>
        
        <div className="relative mx-auto max-w-7xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
          >
            Discover Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-white/80"
          >
            Workshops, seminars, competitions, and more happening near you
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-8 max-w-2xl"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search events by name, type, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 pr-4 text-base shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          {/* Filters Bar */}
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 rounded-full bg-[hsl(var(--navy))] px-2 py-0.5 text-xs text-white">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <FilterContent filters={filters} setFilters={setFilters} />
                </div>
              </SheetContent>
            </Sheet>

            <div className="hidden flex-wrap items-center gap-3 lg:flex">
              <Select
                value={filters.eventType?.[0] || ''}
                onValueChange={(value) => setFilters({ ...filters, eventType: value ? [value] : undefined })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.mode?.[0] || ''}
                onValueChange={(value) => setFilters({ ...filters, mode: value ? [value as 'online' | 'offline' | 'hybrid'] : undefined })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.college || ''}
                onValueChange={(value) => setFilters({ ...filters, college: value || undefined })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="College" />
                </SelectTrigger>
                <SelectContent>
                  {mockColleges.map((college) => (
                    <SelectItem key={college.id} value={college.id}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="mr-1 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>

            <div className="ml-auto text-sm text-slate-500">
              Showing {filteredEvents.length} events
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
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
                    <div className="absolute left-4 top-4">
                      <Badge className="bg-white/90 text-slate-900 capitalize">
                        {event.eventType.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-sm text-white/80">{event.collegeName}</p>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-1 text-base font-semibold text-slate-900 dark:text-white">
                      {event.title}
                    </h3>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="h-4 w-4" />
                        <span className="capitalize">{event.mode}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700">
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Users className="h-4 w-4" />
                        <span>{event.registeredCount}{event.capacity ? `/${event.capacity}` : ''}</span>
                      </div>
                      <Badge variant={event.capacity && event.registeredCount >= event.capacity ? 'destructive' : 'default'}>
                        {event.capacity && event.registeredCount >= event.capacity ? 'Full' : 'Open'}
                      </Badge>
                    </div>
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
                No events found
              </h3>
              <p className="mt-2 text-slate-500">
                Try adjusting your filters or search query
              </p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const FilterContent = ({ 
  filters, 
  setFilters 
}: { 
  filters: EventFilters; 
  setFilters: (filters: EventFilters) => void;
}) => {
  return (
    <>
      <div>
        <label className="text-sm font-medium">Event Type</label>
        <div className="mt-2 space-y-2">
          {eventTypes.map((type) => (
            <label key={type.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.eventType?.includes(type.value)}
                onChange={(e) => {
                  const currentTypes = filters.eventType || [];
                  if (e.target.checked) {
                    setFilters({ ...filters, eventType: [...currentTypes, type.value] });
                  } else {
                    setFilters({ ...filters, eventType: currentTypes.filter((t) => t !== type.value) });
                  }
                }}
                className="rounded border-slate-300"
              />
              <span>{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Mode</label>
        <div className="mt-2 space-y-2">
          {['online', 'offline', 'hybrid'].map((mode) => (
            <label key={mode} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.mode?.includes(mode as 'online' | 'offline' | 'hybrid')}
                onChange={(e) => {
                  const currentModes = filters.mode || [];
                  if (e.target.checked) {
                    setFilters({ ...filters, mode: [...currentModes, mode as 'online' | 'offline' | 'hybrid'] });
                  } else {
                    setFilters({ ...filters, mode: currentModes.filter((m) => m !== mode) });
                  }
                }}
                className="rounded border-slate-300"
              />
              <span className="capitalize">{mode}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">College</label>
        <Select
          value={filters.college || ''}
          onValueChange={(value) => setFilters({ ...filters, college: value || undefined })}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select college" />
          </SelectTrigger>
          <SelectContent>
            {mockColleges.map((college) => (
              <SelectItem key={college.id} value={college.id}>
                {college.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default EventsPage;
