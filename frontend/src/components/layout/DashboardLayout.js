import { useState } from 'react';
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
  FiSettings,
  FiX,
  FiMenu,
  FiCheckCircle
} from 'react-icons/fi';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      { href: '/notifications', icon: FiBell, label: 'Notifications' },
    ];


    if (user.role === 'admin') {
      return [
        { href: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
        { href: '/admin/users', icon: FiUsers, label: 'Users' },
        { href: '/admin/internships', icon: FiBookOpen, label: 'Internships' },
        { href: '/admin/enrollments', icon: FiCheckCircle, label: 'Enrollments' },
        { href: '/admin/submissions', icon: FiFileText, label: 'Submissions' },
        { href: '/admin/certificates', icon: FiAward, label: 'Certificates' },
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

  const SidebarContent = ({ onItemClick = () => { } }) => (
    <nav className="flex-1 p-4 space-y-1">
      {navItems.map((item) => {
        const isActive = router.pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
              ? 'bg-primary-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-600'}`} />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-72 bg-white border-r border-gray-200 sticky top-16 h-[calc(100vh-64px)] shadow-sm">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
            <div
              className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col animate-slide-in-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent onItemClick={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
        >
          <FiMenu className="w-6 h-6" />
        </button>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
