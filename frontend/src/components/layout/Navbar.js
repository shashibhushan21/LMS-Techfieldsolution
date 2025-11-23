import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { FiMenu, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import { useState, useMemo, useEffect } from 'react';
import { BRAND } from '@/config/brand';
import Avatar from '@/components/ui/Avatar';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      // Assuming GET /notifications?status=unread returns unread notifications
      // Or we can fetch all and filter. Let's try fetching unread specifically if API supports it, 
      // otherwise fetch all. Based on notifications.js, it supports status filter.
      // However, to be lightweight, maybe we just need a count endpoint? 
      // For now, let's use the existing endpoint.
      const res = await import('@/utils/apiClient').then(mod => mod.default.get('/notifications/unread-count'));
      if (res.data && res.data.data) {
        setUnreadCount(res.data.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch notification count', error);
    }
  };

  const handleLogout = () => logout();

  const links = useMemo(
    () => {
      const allLinks = [
        { href: '/internships', label: 'Internships' },
        { href: '/about', label: 'About' },
      ];

      // Hide internships for interns as they have their own dashboard
      if (user?.role === 'intern') {
        return allLinks.filter(l => l.href !== '/internships');
      }

      return allLinks;
    },
    [user]
  );

  const isActive = (href) => router.pathname === href || router.pathname.startsWith(href + '/');

  return (
    <header className="sticky top-0 z-40">
      <a href="#main" className="sr-only focus:not-sr-only focus:block bg-primary-600 text-white px-4 py-2">Skip to content</a>
      <nav aria-label="Primary" className="backdrop-blur supports-[backdrop-filter]:bg-white/80 bg-white border-b border-neutral-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center group" aria-label={`${BRAND.name} Home`}>
              <span className="text-2xl font-heading font-extrabold tracking-tight">
                <span className="text-primary-700 transition-colors">{BRAND.name.replace('LMS', '')}</span>
                <span className="text-neutral-900">LMS</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative font-medium transition-colors ${isActive(l.href)
                    ? 'text-primary-700 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:bg-primary-600'
                    : 'text-neutral-700 hover:text-primary-700'
                    }`}
                >
                  {l.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link href={BRAND.urls.dashboard} className={`font-medium ${isActive('/dashboard') ? 'text-primary-700' : 'text-neutral-700 hover:text-primary-700'}`}>
                    Dashboard
                  </Link>
                  <Link href="/dashboard/notifications" className="relative text-neutral-700 hover:text-primary-700" aria-label="Notifications">
                    <FiBell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 grid place-items-center border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  <div className="relative" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                    <button className="flex items-center gap-2 text-neutral-700 hover:text-primary-700 py-2" aria-haspopup="menu" aria-expanded={dropdownOpen}>
                      <Avatar src={user?.avatar} name={`${user?.firstName} ${user?.lastName}`} size="sm" />
                      <span className="font-medium hidden lg:inline">{user?.firstName}</span>
                    </button>
                    {dropdownOpen && (
                      <div className="absolute right-0 top-full pt-2 w-48">
                        <div className="bg-white rounded-lg shadow-lg py-2 border border-neutral-200 animate-fade-in">
                          <Link href="/profile" className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100 transition-colors">
                            <FiUser className="inline mr-2" /> Profile
                          </Link>
                          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-neutral-700 hover:bg-neutral-100 transition-colors">
                            <FiLogOut className="inline mr-2" /> Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href={BRAND.urls.login} className="font-medium text-neutral-700 hover:text-primary-700">Login</Link>
                  <Link href={BRAND.urls.register} className="btn btn-primary">Get Started</Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden text-neutral-700" onClick={() => setMobileMenuOpen((s) => !s)} aria-expanded={mobileMenuOpen} aria-label="Toggle menu">
              <FiMenu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 space-y-1 animate-slide-up">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className={`block py-2 ${isActive(l.href) ? 'text-primary-700' : 'text-neutral-700 hover:text-primary-700'}`}> {l.label} </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link href={BRAND.urls.dashboard} className={`block py-2 ${isActive('/dashboard') ? 'text-primary-700' : 'text-neutral-700 hover:text-primary-700'}`}>Dashboard</Link>
                  <Link href="/profile" className="block py-2 text-neutral-700 hover:text-primary-700">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left py-2 text-neutral-700 hover:text-primary-700">Logout</button>
                </>
              ) : (
                <>
                  <Link href={BRAND.urls.login} className="block py-2 text-neutral-700 hover:text-primary-700">Login</Link>
                  <Link href={BRAND.urls.register} className="block py-2 text-neutral-700 hover:text-primary-700">Get Started</Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
