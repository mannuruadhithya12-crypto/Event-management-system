import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore, useThemeStore } from '@/store';
import { Toaster } from '@/components/ui/sonner';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

// Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import HackathonsPage from '@/pages/HackathonsPage';
import HackathonDetailPage from '@/pages/HackathonDetailPage';
import EventsPage from '@/pages/EventsPage';
import EventDetailPage from '@/pages/EventDetailPage';
import ResourcesPage from '@/pages/ResourcesPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import CollegesPage from '@/pages/CollegesPage';

// Dashboard Pages
import StudentDashboard from '@/pages/dashboard/StudentDashboard';
import StudentHackathonDashboard from '@/pages/dashboard/StudentHackathonDashboard';
import StudentEventsDashboard from '@/pages/dashboard/StudentEventsDashboard';
import StudentTeamsDashboard from '@/pages/dashboard/StudentTeamsDashboard';
import StudentAnalyticsDashboard from '@/pages/dashboard/StudentAnalyticsDashboard';
import FacultyDashboard from '@/pages/dashboard/FacultyDashboard';
import FacultyEventsDashboard from '@/pages/dashboard/FacultyEventsDashboard';
import FacultyHackathonsDashboard from '@/pages/dashboard/FacultyHackathonsDashboard';
import FacultyAnalyticsDashboard from '@/pages/dashboard/FacultyAnalyticsDashboard';
import FacultyStudentManagement from '@/pages/dashboard/FacultyStudentManagement';
import CollegeAdminDashboard from '@/pages/dashboard/CollegeAdminDashboard';
import SuperAdminDashboard from '@/pages/dashboard/SuperAdminDashboard';
import JudgeDashboard from '@/pages/dashboard/JudgeDashboard';
import ClubsPage from '@/pages/dashboard/ClubsPage';
import ClubDetailPage from '@/pages/dashboard/ClubDetailPage';
import ForumPage from '@/pages/dashboard/ForumPage';
import CommunityChatPage from '@/pages/dashboard/CommunityChatPage';
import AnalyticsDashboard from '@/pages/dashboard/AnalyticsDashboard';
import CertificationCenter from '@/pages/dashboard/CertificationCenter';
import WebinarsPage from '@/pages/dashboard/WebinarsPage';
import WebinarDetailPage from '@/pages/dashboard/WebinarDetailPage';
import EventCalendarPage from '@/pages/dashboard/EventCalendarPage';
import SupportCenter from '@/pages/dashboard/SupportCenter';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Role-based Dashboard Redirect
const DashboardRedirect = () => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'super_admin':
      return <Navigate to="/dashboard/super-admin" replace />;
    case 'college_admin':
      return <Navigate to="/dashboard/college-admin" replace />;
    case 'faculty':
      return <Navigate to="/dashboard/faculty" replace />;
    case 'judge':
      return <Navigate to="/dashboard/judge" replace />;
    case 'student':
    default:
      return <Navigate to="/dashboard/student" replace />;
  }
};

function App() {
  const { theme } = useThemeStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Apply theme
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/hackathons" element={<HackathonsPage />} />
          <Route path="/hackathons/:id" element={<HackathonDetailPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/colleges" element={<CollegesPage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

        {/* Dashboard Routes */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/student/hackathons" element={<StudentHackathonDashboard />} />
          <Route path="/dashboard/student/events" element={<StudentEventsDashboard />} />
          <Route path="/dashboard/student/teams" element={<StudentTeamsDashboard />} />
          <Route path="/dashboard/student/analytics" element={<StudentAnalyticsDashboard />} />
          <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
          <Route path="/dashboard/faculty/events" element={<FacultyEventsDashboard />} />
          <Route path="/dashboard/faculty/hackathons" element={<FacultyHackathonsDashboard />} />
          <Route path="/dashboard/faculty/analytics" element={<FacultyAnalyticsDashboard />} />
          <Route path="/dashboard/faculty/students" element={<FacultyStudentManagement />} />

          <Route path="/dashboard/college-admin" element={<CollegeAdminDashboard />} />
          <Route path="/dashboard/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/dashboard/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/dashboard/judge" element={<JudgeDashboard />} />

          {/* Club Routes */}
          <Route path="/dashboard/clubs" element={<ClubsPage />} />
          <Route path="/dashboard/clubs/:id" element={<ClubDetailPage />} />

          {/* New Ecosystem Routes */}
          <Route path="/dashboard/forum" element={<ForumPage />} />
          <Route path="/dashboard/community" element={<CommunityChatPage />} />
          <Route path="/dashboard/analytics" element={<AnalyticsDashboard />} />
          <Route path="/dashboard/student/certificates" element={<CertificationCenter />} />

          {/* Webinar Routes */}
          <Route path="/dashboard/webinars" element={<WebinarsPage />} />
          <Route path="/dashboard/webinars/:id" element={<WebinarDetailPage />} />

          {/* Calendar & Support */}
          <Route path="/dashboard/calendar" element={<EventCalendarPage />} />
          <Route path="/dashboard/support" element={<SupportCenter />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </Router>
  );
}

export default App;
