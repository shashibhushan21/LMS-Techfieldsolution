import { useAuth } from '@/context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  FiHome, 
  FiBookOpen, 
  FiFileText, 
  FiAward, 
  FiMessageSquare, 
  FiBell,
  FiUsers,
  FiBarChart2,
  FiSettings
} from 'react-icons/fi';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    return null;
  }

  const getNavItems = () => {
    const commonItems = [
      { href: '/dashboard', icon: FiHome, label: 'Dashboard' },
      { href: '/dashboard/internships', icon: FiBookOpen, label: 'My Internships' },
      { href: '/dashboard/assignments', icon: FiFileText, label: 'Assignments' },
      { href: '/dashboard/certificates', icon: FiAward, label: 'Certificates' },
      { href: '/dashboard/messages', icon: FiMessageSquare, label: 'Messages' },
      { href: '/dashboard/notifications', icon: FiBell, label: 'Notifications' },
    ];

    if (user.role === 'admin') {
      return [
        { href: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
        { href: '/admin/users', icon: FiUsers, label: 'Users' },
        { href: '/admin/internships', icon: FiBookOpen, label: 'Internships' },
        { href: '/admin/analytics', icon: FiBarChart2, label: 'Analytics' },
        { href: '/admin/settings', icon: FiSettings, label: 'Settings' },
      ];
    }

    if (user.role === 'mentor') {
      return [
        { href: '/mentor/dashboard', icon: FiHome, label: 'Dashboard' },
        { href: '/mentor/internships', icon: FiBookOpen, label: 'My Internships' },
        { href: '/mentor/submissions', icon: FiFileText, label: 'Submissions' },
        { href: '/mentor/students', icon: FiUsers, label: 'Students' },
        { href: '/dashboard/messages', icon: FiMessageSquare, label: 'Messages' },
      ];
    }

    return commonItems;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
