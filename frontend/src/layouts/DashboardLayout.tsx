import { Outlet } from 'react-router-dom';
import { useAuthStore, useUIStore } from '@/store';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { cn } from '@/lib/utils';

const DashboardLayout = () => {
  const { user } = useAuthStore();
  const { sidebarOpen } = useUIStore();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardSidebar />
      
      <main 
        className={cn(
          "pt-16 transition-all duration-300",
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        )}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
