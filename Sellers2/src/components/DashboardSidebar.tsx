import { Home, Package, Mail, Settings, HelpCircle, Bell, User, Users, Clock, TrendingUp, Activity, GraduationCap, CheckCircle, MessageSquare, Wallet, BarChart3, DollarSign, RefreshCcw, Truck, School } from 'lucide-react';
import handsHopeLogo from 'figma:asset/972a6bc015fa5c98ddeb2bc3d5985f42623eb1bb.png';

type DashboardPage = 'dashboard' | 'products' | 'inquiries' | 'notifications' | 'profile' | 'settings' | 'help' | 'students' | 'pending-approvals' | 'student-activity' | 'rankings' | 'activity-log' | 'teachers' | 'approvals' | 'teacher-activity' | 'messages' | 'withdrawals' | 'analytics' | 'sales-history' | 'buyer-messages' | 'refunds' | 'shipments' | 'assistance';

interface DashboardSidebarProps {
  currentPage: DashboardPage;
  setCurrentPage: (page: DashboardPage) => void;
  highContrast: boolean;
  userRole?: 'seller' | 'teacher' | 'student' | 'school';
}

export function DashboardSidebar({ currentPage, setCurrentPage, highContrast, userRole = 'seller' }: DashboardSidebarProps) {
  // Teacher-specific navigation
  const teacherNavItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
    { id: 'students' as const, label: 'Students', icon: Users },
    { id: 'pending-approvals' as const, label: 'Approvals', icon: Clock },
    { id: 'rankings' as const, label: 'Rankings', icon: TrendingUp },
    { id: 'activity-log' as const, label: 'Activity Log', icon: Activity },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
    { id: 'help' as const, label: 'Help', icon: HelpCircle },
  ];

  // School-specific navigation
  const schoolNavItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
    { id: 'teachers' as const, label: 'Teachers', icon: GraduationCap },
    { id: 'students' as const, label: 'Students', icon: Users },
    { id: 'approvals' as const, label: 'Approvals', icon: CheckCircle },
    { id: 'teacher-activity' as const, label: 'Teacher Activity', icon: Activity },
    { id: 'messages' as const, label: 'Messages', icon: MessageSquare },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
    { id: 'help' as const, label: 'Help', icon: HelpCircle },
  ];

  // Seller navigation (individual sellers)
  const sellerNavItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
    { id: 'products' as const, label: 'Products', icon: Package },
    { id: 'withdrawals' as const, label: 'Withdrawals', icon: Wallet },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'buyer-messages' as const, label: 'Buyer Messages', icon: MessageSquare },
    { id: 'refunds' as const, label: 'Refunds', icon: RefreshCcw },
    { id: 'shipments' as const, label: 'Shipments', icon: Truck },
    { id: 'inquiries' as const, label: 'Inquiries', icon: Mail },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
    { id: 'help' as const, label: 'Help', icon: HelpCircle },
  ];

  // Student navigation
  const studentNavItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
    { id: 'products' as const, label: 'Products', icon: Package },
    { id: 'withdrawals' as const, label: 'Withdrawals', icon: Wallet },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'buyer-messages' as const, label: 'Buyer Messages', icon: MessageSquare },
    { id: 'refunds' as const, label: 'Refunds', icon: RefreshCcw },
    { id: 'shipments' as const, label: 'Shipments', icon: Truck },
    { id: 'assistance' as const, label: 'Get Assistance', icon: School },
    { id: 'inquiries' as const, label: 'Inquiries', icon: Mail },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
    { id: 'help' as const, label: 'Help', icon: HelpCircle },
  ];

  const navItems = userRole === 'teacher' ? teacherNavItems : userRole === 'school' ? schoolNavItems : userRole === 'student' ? studentNavItems : sellerNavItems;

  return (
    <aside 
      className={`w-64 ${highContrast ? 'border-r-4 border-white bg-black' : 'bg-blue-900'} flex flex-col`}
      aria-label="Main navigation"
    >
      <div className="border-b border-blue-800 bg-white p-6">
        <h2 className="text-2xl text-blue-900">Hands and Hope</h2>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-4" role="navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                isActive
                  ? highContrast 
                    ? 'bg-white text-black' 
                    : 'bg-blue-700 text-white'
                  : highContrast
                  ? 'text-white hover:bg-gray-900'
                  : 'text-blue-100 hover:bg-blue-800'
              }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}