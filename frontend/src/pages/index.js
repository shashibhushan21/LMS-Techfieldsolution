import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { BRAND } from '@/config/brand';
import DecorativePanel from '@/components/home/DecorativePanel';
import LoginForm from '@/components/home/LoginForm';
import MobileHeader from '@/components/home/MobileHeader';
import MobileBackground from '@/components/home/MobileBackground';
import FooterLinks from '@/components/home/FooterLinks';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (user.role === 'mentor') {
        router.push('/mentor/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleLoginSubmit = async (email, password) => {
    setLoading(true);
    setErrors({});

    const result = await login(email, password);

    if (result.success) {
      toast.success('Login successful!');
    } else {
      setErrors({ submit: result.message || 'Login failed' });
      toast.error(result.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{`Sign In - ${BRAND.name}`}</title>
        <meta name="description" content="Sign in to access your learning dashboard" />
      </Head>

      <div className="h-screen flex overflow-hidden">
        {/* Decorative Left Panel - Desktop Only */}
        <DecorativePanel brandName={BRAND.name} />

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-y-auto">
          {/* Mobile Background */}
          <MobileBackground />

          <div className="w-full max-w-md relative z-10 animate-scale-in my-8">
            {/* Mobile Header */}
            <MobileHeader brandName={BRAND.name} />

            {/* Login Form */}
            <LoginForm 
              onSubmit={handleLoginSubmit}
              loading={loading}
              errors={errors}
            />

            {/* Footer Links */}
            <FooterLinks />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in { animation: scale-in 0.4s ease-out forwards; }
      `}</style>
    </>
  );
}
