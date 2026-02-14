import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Search,
    Filter,
    MapPin,
    Globe,
    Code,
    Trophy,
    X
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface FilterSidebarProps {
    filters: any;
    setFilters: (filters: any) => void;
    className?: string;
}

const FilterSidebar = ({ filters, setFilters, className }: FilterSidebarProps) => {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearchCheck = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setFilters({ ...filters, search });
        }
    };

    const toggleTag = (tag: string) => {
        const newTags = filters.tags?.includes(tag)
            ? filters.tags.filter((t: string) => t !== tag)
            : [...(filters.tags || []), tag];
        setFilters({ ...filters, tags: newTags });
    };

    return (
        <div className={`space-y-8 ${className}`}>
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-lg border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-6">
                    <Filter className="h-5 w-5 text-[hsl(var(--teal))]" />
                    <h3 className="font-bold text-lg">Filters</h3>
                    {Object.keys(filters).length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto text-xs text-red-500 hover:bg-red-50 hover:text-red-600 h-8"
                            onClick={() => {
                                setFilters({});
                                setSearch('');
                            }}
                        >
                            Reset <X className="ml-1 h-3 w-3" />
                        </Button>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Search */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search hackathons..."
                                className="pl-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearchCheck}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Mode */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Globe className="h-4 w-4" /> Mode
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Online', 'Offline', 'Hybrid'].map((mode) => (
                                <div
                                    key={mode}
                                    onClick={() => setFilters({ ...filters, mode: filters.mode === mode ? '' : mode })}
                                    className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-bold text-center transition-all ${filters.mode === mode
                                            ? 'bg-[hsl(var(--teal))] text-white shadow-md transform scale-105'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                        }`}
                                >
                                    {mode}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Country */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Country
                        </label>
                        <Input
                            placeholder="e.g. India"
                            className="rounded-xl bg-slate-50 dark:bg-slate-800 border-none"
                            value={filters.country || ''}
                            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                        />
                    </div>

                    <Separator />

                    {/* Status */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Trophy className="h-4 w-4" /> Status
                        </label>
                        <div className="space-y-2">
                            {['OPEN', 'ONGOING', 'CLOSED'].map((status) => (
                                <div key={status} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={status}
                                        checked={filters.status === status}
                                        onCheckedChange={() => setFilters({ ...filters, status: filters.status === status ? '' : status })}
                                    />
                                    <label
                                        htmlFor={status}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {status}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Tags */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Code className="h-4 w-4" /> Tech Stack
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {['AI', 'Blockchain', 'Web3', 'Cloud', 'FinTech', 'Health', 'IoT', 'Mobile'].map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="outline"
                                    className={`cursor-pointer px-3 py-1 rounded-lg transition-all ${filters.tags?.includes(tag)
                                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent'
                                            : 'hover:bg-slate-100 hover:border-slate-300'
                                        }`}
                                    onClick={() => toggleTag(tag)}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
