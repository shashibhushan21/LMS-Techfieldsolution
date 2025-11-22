import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { FiMenu, FiX, FiHome, FiUsers, FiBookOpen, FiBarChart2, FiSettings, FiBell, FiClipboard, FiLogOut, FiFileText, FiAward } from 'react-icons/fi';

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
  { href: '/admin/users', label: 'Users', icon: FiUsers },
  { href: '/admin/internships', label: 'Internships', icon: FiBookOpen },
  { href: '/admin/enrollments', label: 'Enrollments', icon: FiClipboard },
  { href: '/admin/submissions', label: 'Submissions', icon: FiFileText },
  { href: '/admin/certificates', label: 'Certificates', icon: FiAward },
  { href: '/admin/announcements', label: 'Announcements', icon: FiBell },
  { href: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
  { href: '/admin/settings', label: 'Settings', icon: FiSettings },
];

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Show a loading state while auth context resolves to prevent blank pages
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  // Non-admin users get redirected (client-side) and see a brief message fallback
  if (!user || user.role !== 'admin') {
    if (typeof window !== 'undefined') {
      router.replace('/dashboard');
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6 text-center">
        <div>
          <p className="text-sm text-neutral-600">Redirecting… You need admin privileges to view this area.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-200 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(true)} aria-label="Open navigation" className="text-neutral-700 p-1 rounded hover:bg-gray-100">
            <FiMenu className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg text-gray-900">Admin Panel</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
            {user.firstName[0]}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-72 bg-slate-900 text-white sticky top-0 h-screen overflow-y-auto shadow-xl z-10">
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                <span className="font-bold text-white text-xl">A</span>
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight">Admin Portal</h1>
                <p className="text-xs text-slate-400">Manage your platform</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">Menu</p>
            {nav.map(item => {
              const active = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${active
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-900/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <item.icon className={`w-5 h-5 transition-colors ${active ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                {user.firstName[0]}
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
              <FiLogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50/50">
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 text-white shadow-2xl flex flex-col transform transition-transform animate-slide-in-left">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                  <span className="font-bold text-white">A</span>
                </div>
                <span className="font-bold text-lg">Admin Portal</span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close navigation" className="text-slate-400 hover:text-white">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {nav.map(item => {
                const active = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active
                      ? 'bg-primary-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                  >
                    <item.icon className="w-5 h-5" /> {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <FiLogOut className="w-5 h-5" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
