import Head from 'next/head';
import Link from 'next/link';
import { BRAND } from '@/config/brand';
import { FiHome } from 'react-icons/fi';

export default function Custom404() {
    return (
        <>
            <Head>
                <title>404 - Page Not Found | {BRAND.name}</title>
                <meta name="description" content="The page you're looking for doesn't exist." />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl w-full text-center">
                    {/* Logo */}
                    <Link href="/" className="inline-block mb-8">
                        <span className="text-3xl font-bold">
                            <span className="text-primary-600">{BRAND.name.replace('LMS', '')}</span>
                            <span className="text-gray-900">LMS</span>
                        </span>
                    </Link>

                    {/* 404 Illustration */}
                    <div className="mb-8">
                        <h1 className="text-9xl font-extrabold text-primary-600 opacity-20">404</h1>
                        <div className="-mt-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                            <p className="text-lg text-gray-600 max-w-md mx-auto">
                                Oops! The page you're looking for seems to have wandered off. Let's get you back on track.
                            </p>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
                        >
                            <FiHome className="w-5 h-5 mr-2" />
                            Go Home
                        </Link>
                    </div>

                    {/* Footer */}
                    <p className="text-sm text-gray-500">
                        If you believe this is an error, please{' '}
                        <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
                            contact support
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </>
    );
}
