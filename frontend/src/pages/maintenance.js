import Head from 'next/head';
import Link from 'next/link';
import { BRAND } from '@/config/brand';
import { FiTool, FiClock, FiMail, FiTwitter, FiLinkedin } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import apiClient from '@/utils/apiClient';

export default function Maintenance() {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await apiClient.get('/system/maintenance-status');
                setSettings(res.data.data);
            } catch (error) {
                console.error('Failed to fetch maintenance settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const getEstimatedDowntime = () => {
        if (!settings?.maintenanceStartTime || !settings?.maintenanceEndTime) {
            return '30 minutes';
        }

        const start = new Date(settings.maintenanceStartTime);
        const end = new Date(settings.maintenanceEndTime);
        const diffMs = end - start;
        const diffMins = Math.round(diffMs / 60000);
        const diffHours = Math.round(diffMins / 60);

        if (diffMins < 60) {
            return `${diffMins} minutes`;
        } else {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
        }
    };

    const getStartTime = () => {
        if (!settings?.maintenanceStartTime) {
            return new Date().toLocaleTimeString();
        }
        return new Date(settings.maintenanceStartTime).toLocaleString();
    };

    return (
        <>
            <Head>
                <title>Under Maintenance | {BRAND.name}</title>
                <meta name="description" content="We're currently performing scheduled maintenance." />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl w-full text-center">
                    {/* Logo */}
                    <div className="mb-8">
                        <span className="text-4xl font-bold">
                            <span className="text-primary-600">{BRAND.name.replace('LMS', '')}</span>
                            <span className="text-gray-900">LMS</span>
                        </span>
                    </div>

                    {/* Maintenance Icon */}
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-6 animate-pulse">
                            <FiTool className="w-12 h-12 text-blue-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">We'll Be Right Back</h1>
                        <p className="text-lg text-gray-600 max-w-md mx-auto">
                            {settings?.maintenanceMessage || "We're currently performing scheduled maintenance to improve your experience. We'll be back online shortly."}
                        </p>
                    </div>

                    {/* Estimated Time */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                        <div className="flex items-center justify-center text-gray-700 mb-2">
                            <FiClock className="w-5 h-5 mr-2 text-blue-600" />
                            <span className="font-semibold">Estimated Downtime</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{getEstimatedDowntime()}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Started at {getStartTime()}
                        </p>
                    </div>

                    {/* Updates Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                            Stay Updated
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Follow us on social media for real-time updates on our maintenance status.
                        </p>
                        <div className="flex justify-center gap-4">
                            <a
                                href="#"
                                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                aria-label="Twitter"
                            >
                                <FiTwitter className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                aria-label="LinkedIn"
                            >
                                <FiLinkedin className="w-5 h-5" />
                            </a>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                aria-label="Email"
                            >
                                <FiMail className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
