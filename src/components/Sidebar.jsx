
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { 
  LayoutDashboard, Users, CalendarDays, ClipboardCheck, 
  LogOut, ChevronLeft, ChevronRight, Clock, FileText 
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const NavItem = ({ to, icon: Icon, label, adminOnly = false }) => {
    const isActive = location.pathname === to;
    
    if (adminOnly && !isAdmin()) return null;
    
    return (
      <Link
        to={to}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-sidebar-accent",
          isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground",
          { "justify-center": collapsed }
        )}
      >
        <Icon className="h-5 w-5" />
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  };

  return (
    <div
      className={cn(
        "flex h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 fixed left-0 top-0 z-30",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center px-4 border-b border-sidebar-border">
        {!collapsed ? (
          <h2 className="text-sidebar-foreground font-semibold text-lg">AttendEase</h2>
        ) : (
          <span className="text-sidebar-foreground font-bold mx-auto">AE</span>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-2">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/attendance" icon={Clock} label="Attendance" />
          <NavItem to="/absences" icon={ClipboardCheck} label="Absences" />
          <NavItem to="/leaves" icon={CalendarDays} label="Leave Requests" />
          <NavItem to="/reports" icon={FileText} label="Reports" />
          <NavItem to="/employees" icon={Users} label="Employees" adminOnly={true} />
        </nav>
      </div>

      <div className="p-3 mt-auto border-t border-sidebar-border">
        {!collapsed ? (
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-sidebar-foreground">{user?.name}</span>
              <span className="text-xs text-sidebar-foreground/60">{user?.position}</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-3">
            <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        )}
        
        <button
          onClick={logout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
            { "justify-center": collapsed }
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute -right-4 top-20 flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-md hover:bg-sidebar-primary/90 focus:outline-none"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};

export default Sidebar;
