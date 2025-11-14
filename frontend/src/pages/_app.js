import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import 'nprogress/nprogress.css';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import { ToastContainer } from 'react-toastify';
import NProgress from 'nprogress';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';

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
          <Component {...pageProps} />
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
