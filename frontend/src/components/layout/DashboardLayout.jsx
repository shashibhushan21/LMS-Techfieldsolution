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
      { href: '/dashboard/notifications', icon: FiBell, label: 'Notifications' },
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
        { href: '/dashboard/notifications', icon: FiBell, label: 'Notifications' },
        { href: '/dashboard/profile', icon: FiSettings, label: 'Settings' },
      ];
    }

    // Intern items (commonItems + Profile)
    return [
      ...commonItems,
      { href: '/dashboard/profile', icon: FiSettings, label: 'Profile' }
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-72 bg-slate-900 text-white sticky top-16 h-[calc(100vh-64px)] shadow-xl overflow-y-auto">
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                <span className="font-bold text-white text-xl">
                  {user.role === 'mentor' ? 'M' : user.role === 'admin' ? 'A' : 'I'}
                </span>
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight">
                  {user.role === 'mentor' ? 'Mentor Portal' : user.role === 'admin' ? 'Admin Portal' : 'Dashboard'}
                </h1>
                <p className="text-xs text-slate-400">
                  {user.role === 'mentor' ? 'Manage your students' : user.role === 'admin' ? 'Manage platform' : 'Track your progress'}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">Menu</p>
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium ${isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-900/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                {user.firstName?.[0] || 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <FiSettings className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
            <div
              className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 text-white shadow-2xl flex flex-col animate-slide-in-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                    <span className="font-bold text-white">
                      {user.role === 'mentor' ? 'M' : user.role === 'admin' ? 'A' : 'I'}
                    </span>
                  </div>
                  <span className="font-bold text-lg">
                    {user.role === 'mentor' ? 'Mentor' : user.role === 'admin' ? 'Admin' : 'Dashboard'}
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = router.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-slate-800">
                <button
                  onClick={() => { logout(); setSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                  <FiSettings className="w-5 h-5" /> Sign Out
                </button>
              </div>
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
