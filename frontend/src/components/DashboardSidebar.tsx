import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Trophy,
  Calendar,
  BookOpen,
  Users,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Building2,
  GraduationCap,
  Gavel,
  Crown,
  FolderOpen,
  Bell,
  Award,
  MessageSquare,
  Globe,
  Video,
} from 'lucide-react';
import { useAuthStore, useUIStore } from '@/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const getMenuItems = (role: string) => {
  const commonItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Hackathons', href: '/hackathons', icon: Trophy },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Resources', href: '/resources', icon: BookOpen },
  ];

  switch (role) {
    case 'super_admin':
      return [
        { name: 'Overview', href: '/dashboard/super-admin', icon: LayoutDashboard },
        { name: 'Colleges', href: '/dashboard/super-admin/colleges', icon: Building2 },
        { name: 'Users', href: '/dashboard/super-admin/users', icon: Users },
        { name: 'Analytics', href: '/dashboard/super-admin/analytics', icon: BarChart3 },
        { name: 'Reports', href: '/dashboard/super-admin/reports', icon: FileText },
        { name: 'Settings', href: '/dashboard/super-admin/settings', icon: Settings },
      ];
    case 'college_admin':
      return [
        { name: 'Overview', href: '/dashboard/college-admin', icon: LayoutDashboard },
        { name: 'Students', href: '/dashboard/college-admin/students', icon: GraduationCap },
        { name: 'Faculty', href: '/dashboard/college-admin/faculty', icon: Users },
        { name: 'Events', href: '/dashboard/college-admin/events', icon: Calendar },
        { name: 'Hackathons', href: '/dashboard/college-admin/hackathons', icon: Trophy },
        { name: 'Content', href: '/dashboard/college-admin/content', icon: FolderOpen },
        { name: 'Analytics', href: '/dashboard/college-admin/analytics', icon: BarChart3 },
      ];
    case 'faculty':
      return [
        { name: 'Overview', href: '/dashboard/faculty', icon: LayoutDashboard },
        { name: 'My Events', href: '/dashboard/faculty/events', icon: Calendar },
        { name: 'My Hackathons', href: '/dashboard/faculty/hackathons', icon: Trophy },
        { name: 'Content', href: '/dashboard/faculty/content', icon: FolderOpen },
        { name: 'Students', href: '/dashboard/faculty/students', icon: GraduationCap },
        { name: 'Analytics', href: '/dashboard/faculty/analytics', icon: BarChart3 },
      ];
    case 'judge':
      return [
        { name: 'Overview', href: '/dashboard/judge', icon: LayoutDashboard },
        { name: 'My Hackathons', href: '/dashboard/judge/hackathons', icon: Trophy },
        { name: 'Submissions', href: '/dashboard/judge/submissions', icon: FileText },
        { name: 'Leaderboard', href: '/dashboard/judge/leaderboard', icon: Award },
      ];
    case 'student':
    default:
      return [
        { name: 'Overview', href: '/dashboard/student', icon: LayoutDashboard },
        { name: 'Clubs', href: '/dashboard/clubs', icon: Users },
        { name: 'Forum', href: '/dashboard/forum', icon: Globe },
        { name: 'Community', href: '/dashboard/community', icon: MessageSquare },
        { name: 'My Hackathons', href: '/dashboard/student/hackathons', icon: Trophy },
        { name: 'My Events', href: '/dashboard/student/events', icon: Calendar },
        { name: 'My Teams', href: '/dashboard/student/teams', icon: Users },
        { name: 'Resources', href: '/dashboard/student/resources', icon: BookOpen },
        { name: 'Webinars', href: '/dashboard/webinars', icon: Video },
        { name: 'Certificates', href: '/dashboard/student/certificates', icon: Award },
        { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
        { name: 'Support', href: '/dashboard/support', icon: HelpCircle },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
      ];
  }
};

const DashboardSidebar = () => {
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();

  if (!user) return null;

  const menuItems = getMenuItems(user.role);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-700 dark:bg-slate-900 lg:block",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="absolute -right-3 top-4 h-6 w-6 rounded-full border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>

        <div className="flex h-full flex-col">
          {/* User Info */}
          <div className={cn(
            "border-b border-slate-200 p-4 dark:border-slate-700",
            !sidebarOpen && "px-2"
          )}>
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`}
                alt={user.firstName}
                className="h-10 w-10 rounded-full"
              />
              {sidebarOpen && (
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{user.firstName} {user.lastName}</p>
                  <p className="truncate text-xs text-slate-500 capitalize">{user.role.replace('_', ' ')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      location.pathname === item.href
                        ? "bg-[hsl(var(--navy))] text-white dark:bg-[hsl(var(--teal))]"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
                      !sidebarOpen && "justify-center px-2"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className={cn(
            "border-t border-slate-200 p-3 dark:border-slate-700",
            !sidebarOpen && "px-2"
          )}>
            <Link
              to="/help"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
                !sidebarOpen && "justify-center px-2"
              )}
            >
              <HelpCircle className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>Help & Support</span>}
            </Link>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        {/* Mobile sidebar implementation would go here */}
      </div>
    </>
  );
};

export default DashboardSidebar;
