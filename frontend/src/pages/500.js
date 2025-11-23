import Head from 'next/head';
import Link from 'next/link';
import { BRAND } from '@/config/brand';
import { FiHome, FiRefreshCw, FiMail, FiAlertTriangle } from 'react-icons/fi';

export default function Custom500() {
    const errorId = `ERR-${Date.now()}`;

    return (
        <>
            <Head>
                <title>500 - Server Error | {BRAND.name}</title>
                <meta name="description" content="An unexpected error occurred on our server." />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl w-full text-center">
                    {/* Logo */}
                    <Link href="/" className="inline-block mb-8">
                        <span className="text-3xl font-bold">
                            <span className="text-primary-600">{BRAND.name.replace('LMS', '')}</span>
                            <span className="text-gray-900">LMS</span>
                        </span>
                    </Link>

                    {/* Error Icon */}
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6">
                            <FiAlertTriangle className="w-12 h-12 text-red-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Something Went Wrong</h1>
                        <p className="text-lg text-gray-600 max-w-md mx-auto mb-4">
                            We're experiencing technical difficulties. Our team has been notified and is working to fix the issue.
                        </p>
                        <div className="inline-block bg-gray-100 rounded-lg px-4 py-2">
                            <p className="text-xs text-gray-500">
                                Error ID: <span className="font-mono font-semibold text-gray-700">{errorId}</span>
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
                        >
                            <FiRefreshCw className="w-5 h-5 mr-2" />
                            Try Again
                        </button>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <FiHome className="w-5 h-5 mr-2" />
                            Go Home
                        </Link>
                    </div>

                    {/* Support Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                            Need Help?
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            If this problem persists, please contact our support team with the error ID above.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                            <FiMail className="w-4 h-4 mr-2" />
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
