import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import 'nprogress/nprogress.css';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import { ToastContainer } from 'react-toastify';
import NProgress from 'nprogress';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import apiClient from '@/utils/apiClient';

// Maintenance Mode Checker Component
function MaintenanceChecker({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [checkingMaintenance, setCheckingMaintenance] = useState(true);

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const res = await apiClient.get('/system/maintenance-status');
        setMaintenanceMode(res.data.data.maintenanceMode);
      } catch (error) {
        console.error('Failed to check maintenance mode:', error);
      } finally {
        setCheckingMaintenance(false);
      }
    };

    checkMaintenanceMode();
  }, []);

  useEffect(() => {
    // Don't redirect if still loading or checking
    if (loading || checkingMaintenance) return;

    // Don't redirect if on maintenance page
    if (router.pathname === '/maintenance') return;

    // Redirect non-admin users to maintenance page if maintenance mode is on
    if (maintenanceMode && user?.role !== 'admin') {
      router.push('/maintenance');
    }

    // Redirect admins away from maintenance page if maintenance mode is off
    if (!maintenanceMode && router.pathname === '/maintenance') {
      router.push('/');
    }
  }, [maintenanceMode, user, loading, checkingMaintenance, router]);

  // Show loading while checking
  if (checkingMaintenance || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return children;
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => NProgress.start();
    const handleComplete = () => NProgress.done();

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2196f3" />
      </Head>
      <AuthProvider>
        <SocketProvider>
          <MaintenanceChecker>
            <Component {...pageProps} />
          </MaintenanceChecker>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </SocketProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
