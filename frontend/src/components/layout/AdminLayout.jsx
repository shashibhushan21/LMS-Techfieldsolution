import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { FiMenu, FiX, FiHome, FiUsers, FiBookOpen, FiBarChart2, FiSettings, FiBell, FiClipboard } from 'react-icons/fi';

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
  { href: '/admin/users', label: 'Users', icon: FiUsers },
  { href: '/admin/internships', label: 'Internships', icon: FiBookOpen },
  { href: '/admin/enrollments', label: 'Enrollments', icon: FiClipboard },
  { href: '/admin/announcements', label: 'Announcements', icon: FiBell },
  { href: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
  { href: '/admin/settings', label: 'Settings', icon: FiSettings },
];

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
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
      <Navbar />
      
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-neutral-200 sticky top-0 h-screen overflow-y-auto">
          <nav className="p-4 space-y-1">
            {nav.map(item => {
              const active = router.pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-50'}`}>
                  <item.icon className="w-5 h-5" /> {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Mobile bar */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-200 sticky top-0 z-10">
            <button onClick={() => setOpen(true)} aria-label="Open navigation" className="text-neutral-700"><FiMenu className="w-6 h-6" /></button>
            <span className="text-sm text-neutral-600">Admin Panel</span>
          </div>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">{children}</div>
          </main>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 h-14 border-b border-neutral-200">
              <span className="font-semibold">Admin Navigation</span>
              <button onClick={() => setOpen(false)} aria-label="Close navigation"><FiX className="w-5 h-5" /></button>
            </div>
            <nav className="p-4 space-y-1 overflow-y-auto">
              {nav.map(item => {
                const active = router.pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-50'}`}>
                    <item.icon className="w-5 h-5" /> {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
