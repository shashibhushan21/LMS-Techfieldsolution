import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BRAND } from '@/config/brand';
import { FiShield, FiHome, FiArrowLeft, FiLogIn } from 'react-icons/fi';

export default function Custom403() {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>403 - Access Denied | {BRAND.name}</title>
                <meta name="description" content="You don't have permission to access this resource." />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl w-full text-center">
                    {/* Logo */}
                    <Link href="/" className="inline-block mb-8">
                        <span className="text-3xl font-bold">
                            <span className="text-primary-600">{BRAND.name.replace('LMS', '')}</span>
                            <span className="text-gray-900">LMS</span>
                        </span>
                    </Link>

                    {/* Access Denied Icon */}
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-100 mb-6">
                            <FiShield className="w-12 h-12 text-amber-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
                        <p className="text-lg text-gray-600 max-w-md mx-auto">
                            You don't have permission to access this page. This area may require special privileges or a different account role.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
                        >
                            <FiArrowLeft className="w-5 h-5 mr-2" />
                            Go Back
                        </button>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <FiHome className="w-5 h-5 mr-2" />
                            Go Home
                        </Link>
                    </div>

                    {/* Info Box */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                            Common Reasons
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-2 text-left max-w-md mx-auto">
                            <li className="flex items-start">
                                <span className="text-amber-600 mr-2">•</span>
                                <span>You need to be logged in with a different account role</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-amber-600 mr-2">•</span>
                                <span>This page requires admin or mentor privileges</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-amber-600 mr-2">•</span>
                                <span>Your session may have expired</span>
                            </li>
                        </ul>
                        <div className="mt-6">
                            <Link
                                href="/login"
                                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                            >
                                <FiLogIn className="w-4 h-4 mr-2" />
                                Login as Different User
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
