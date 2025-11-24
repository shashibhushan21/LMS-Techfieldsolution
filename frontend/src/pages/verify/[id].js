import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import apiClient from '@/utils/apiClient';
import { BRAND } from '@/config/brand';
import { FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaUser, FaBriefcase, FaAward } from 'react-icons/fa';

export default function VerifyCertificate() {
    const router = useRouter();
    const { id } = router.query;
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchId, setSearchId] = useState('');

    useEffect(() => {
        if (!id) return;

        const fetchCertificate = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await apiClient.get(`/certificates/verify/${id}`);
                setCertificate(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error('Verification error:', err);
                setError(err.response?.data?.message || 'Failed to verify certificate');
                setLoading(false);
            }
        };

        fetchCertificate();
    }, [id]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchId.trim()) {
            router.push(`/verify/${searchId.trim()}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head>
                <title>{`Verify Certificate - ${BRAND.name}`}</title>
                <meta name="description" content="Verify the authenticity of a certificate issued by TechFieldSolution" />
            </Head>

            {/* Navbar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex-shrink-0 flex items-center">
                                <span className="text-2xl font-bold text-blue-600">{BRAND.name}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl w-full space-y-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-500">Verifying certificate...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden border-t-4 border-red-500">
                            <div className="p-8 text-center">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                                    <FaTimesCircle className="h-10 w-10 text-red-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Certificate</h2>
                                <p className="text-gray-600 mb-6">{error}</p>

                                {/* Search for another certificate */}
                                <div className="max-w-md mx-auto mb-6">
                                    <form onSubmit={handleSearch} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={searchId}
                                            onChange={(e) => setSearchId(e.target.value)}
                                            placeholder="Enter certificate ID"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            Verify
                                        </button>
                                    </form>
                                </div>

                                <div className="text-sm text-gray-500 mb-4">
                                    <p>If you believe this is an error, please contact our support team.</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-center">
                                <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                    &larr; Return to Home
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden border-t-4 border-green-500">
                            <div className="p-8">
                                <div className="text-center mb-8">
                                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                                        <FaCheckCircle className="h-10 w-10 text-green-600" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900">Certificate Verified</h1>
                                    <p className="text-gray-600 mt-2">
                                        This certificate is valid and was issued to <span className="font-semibold text-gray-900">{certificate.user.firstName} {certificate.user.lastName}</span>.
                                    </p>
                                </div>

                                <div className="border-t border-gray-200 pt-8">
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                <FaUser className="h-4 w-4 mr-2" />
                                                Intern Name
                                            </dt>
                                            <dd className="mt-1 text-lg font-semibold text-gray-900">
                                                {certificate.user.firstName} {certificate.user.lastName}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                <FaBriefcase className="h-4 w-4 mr-2" />
                                                Internship Program
                                            </dt>
                                            <dd className="mt-1 text-lg font-semibold text-gray-900">
                                                {certificate.internship.title}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                <FaAward className="h-4 w-4 mr-2" />
                                                Domain
                                            </dt>
                                            <dd className="mt-1 text-lg font-semibold text-gray-900">
                                                {certificate.internship.domain}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                <FaCalendarAlt className="h-4 w-4 mr-2" />
                                                Issue Date
                                            </dt>
                                            <dd className="mt-1 text-lg font-semibold text-gray-900">
                                                {new Date(certificate.issueDate).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">Certificate ID</dt>
                                            <dd className="mt-1 text-sm font-mono text-gray-600 bg-gray-100 p-2 rounded inline-block">
                                                {certificate.certificateId}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                    Verified by {BRAND.name} Verification System
                                </span>
                                {certificate.pdfUrl && (
                                    <a
                                        href={certificate.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        View Certificate PDF
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
