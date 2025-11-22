import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';
import {
    FiAward, FiUser, FiCalendar, FiDownload, FiPlus, FiX, FiCheckCircle, FiXCircle, FiAlertTriangle
} from 'react-icons/fi';

export default function AdminCertificates() {
    const { user } = useAuth();
    const router = useRouter();
    const [certificates, setCertificates] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [interns, setInterns] = useState([]);
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [generationMode, setGenerationMode] = useState('auto');
    const [selectedEnrollment, setSelectedEnrollment] = useState('');
    const [selectedIntern, setSelectedIntern] = useState('');
    const [selectedInternship, setSelectedInternship] = useState('');
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        if (user && user.role !== 'admin' && user.role !== 'mentor') {
            router.push('/dashboard');
            return;
        }
        fetchCertificates();
        fetchCompletedEnrollments();
        fetchInterns();
        fetchInternships();
    }, [user]);

    const fetchCertificates = async () => {
        try {
            const response = await apiClient.get('/certificates');
            setCertificates(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch certificates:', error);
            toast.error('Failed to load certificates');
        } finally {
            setLoading(false);
        }
    };

    const fetchCompletedEnrollments = async () => {
        try {
            const response = await apiClient.get('/enrollments?status=completed');
            setEnrollments(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch enrollments:', error);
        }
    };

    const fetchInterns = async () => {
        try {
            const response = await apiClient.get('/users?role=intern');
            setInterns(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch interns:', error);
        }
    };

    const fetchInternships = async () => {
        try {
            const response = await apiClient.get('/internships');
            setInternships(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch internships:', error);
        }
    };

    const handleGenerateCertificate = async (e) => {
        e.preventDefault();

        if (generationMode === 'auto') {
            if (!selectedEnrollment) {
                toast.error('Please select an enrollment');
                return;
            }
        } else {
            if (!selectedIntern || !selectedInternship) {
                toast.error('Please select both intern and internship');
                return;
            }
        }

        setGenerating(true);
        try {
            if (generationMode === 'auto') {
                await apiClient.post('/certificates/generate', {
                    enrollmentId: selectedEnrollment
                });
            } else {
                await apiClient.post('/certificates/generate-manual', {
                    userId: selectedIntern,
                    internshipId: selectedInternship
                });
            }
            toast.success('Certificate generated successfully!');
            setShowGenerateModal(false);
            setSelectedEnrollment('');
            setSelectedIntern('');
            setSelectedInternship('');
            setGenerationMode('auto');
            fetchCertificates();
        } catch (error) {
            console.error('Failed to generate certificate:', error);
            toast.error(error.response?.data?.message || 'Failed to generate certificate');
        } finally {
            setGenerating(false);
        }
    };

    const handleDownload = (pdfUrl) => {
        if (pdfUrl) {
            window.open(pdfUrl, '_blank');
        } else {
            toast.error('Certificate PDF not available');
        }
    };

    const handleRevoke = async (certificateId) => {
        if (!confirm('Are you sure you want to revoke this certificate?')) {
            return;
        }

        try {
            await apiClient.put(`/certificates/${certificateId}/revoke`);
            toast.success('Certificate revoked successfully');
            fetchCertificates();
        } catch (error) {
            console.error('Failed to revoke certificate:', error);
            toast.error('Failed to revoke certificate');
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <>
            <Head>
                <title>Certificates - Admin Panel</title>
            </Head>

            <AdminLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">Certificates</h1>
                                <p className="text-primary-100">Manage and generate certificates</p>
                            </div>
                            <button
                                onClick={() => setShowGenerateModal(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
                            >
                                <FiPlus className="w-5 h-5" />
                                Generate Certificate
                            </button>
                        </div>
                    </div>

                    {/* Certificates List */}
                    {certificates.length > 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Certificate ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Student
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Internship
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Issued Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {certificates.map((certificate) => (
                                            <tr key={certificate._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{certificate.certificateId}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                            <FiUser className="w-5 h-5 text-primary-600" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {certificate.user?.firstName} {certificate.user?.lastName}
                                                            </div>
                                                            <div className="text-sm text-gray-500">{certificate.user?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{certificate.internship?.title}</div>
                                                    <div className="text-sm text-gray-500">{certificate.internship?.domain}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <FiCalendar className="w-4 h-4 mr-2" />
                                                        {new Date(certificate.issuedDate).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {certificate.isRevoked ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            <FiXCircle className="w-3.5 h-3.5" />
                                                            Revoked
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <FiCheckCircle className="w-3.5 h-3.5" />
                                                            Active
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleDownload(certificate.pdfUrl)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                                        >
                                                            <FiDownload className="w-4 h-4" />
                                                            Download
                                                        </button>
                                                        {!certificate.isRevoked && (
                                                            <button
                                                                onClick={() => handleRevoke(certificate._id)}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                            >
                                                                <FiXCircle className="w-4 h-4" />
                                                                Revoke
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                            <FiAward className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
                            <p className="text-gray-500 mb-4">Generate certificates for completed internships</p>
                            <button
                                onClick={() => setShowGenerateModal(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                <FiPlus className="w-5 h-5" />
                                Generate Certificate
                            </button>
                        </div>
                    )}
                </div>

                {/* Generate Certificate Modal */}
                {showGenerateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
                                <h2 className="text-xl font-bold text-gray-900">Generate Certificate</h2>
                                <button
                                    onClick={() => {
                                        setShowGenerateModal(false);
                                        setGenerationMode('auto');
                                        setSelectedEnrollment('');
                                        setSelectedIntern('');
                                        setSelectedInternship('');
                                    }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                {/* Tabs */}
                                <div className="flex gap-2 mb-6 border-b border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setGenerationMode('auto')}
                                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${generationMode === 'auto'
                                            ? 'border-primary-600 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Completed Enrollments
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setGenerationMode('manual')}
                                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${generationMode === 'manual'
                                            ? 'border-primary-600 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Manual Override
                                    </button>
                                </div>

                                <form onSubmit={handleGenerateCertificate} className="space-y-4">
                                    {generationMode === 'auto' ? (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Select Completed Enrollment
                                            </label>
                                            <select
                                                value={selectedEnrollment}
                                                onChange={(e) => setSelectedEnrollment(e.target.value)}
                                                className="block w-full border-2 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 px-3 py-2"
                                                required
                                            >
                                                <option value="">Choose an enrollment...</option>
                                                {enrollments.map((enrollment) => (
                                                    <option key={enrollment._id} value={enrollment._id}>
                                                        {enrollment.user?.firstName} {enrollment.user?.lastName} - {enrollment.internship?.title}
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="mt-2 text-xs text-gray-500">
                                                Only completed enrollments are shown
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                                <div className="flex gap-2">
                                                    <FiAlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                                    <p className="text-xs text-yellow-800">
                                                        <strong>Warning:</strong> Manual generation bypasses completion validation. Use only for special cases.
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Select Intern
                                                </label>
                                                <select
                                                    value={selectedIntern}
                                                    onChange={(e) => setSelectedIntern(e.target.value)}
                                                    className="block w-full border-2 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 px-3 py-2"
                                                    required
                                                >
                                                    <option value="">Choose an intern...</option>
                                                    {interns.map((intern) => (
                                                        <option key={intern._id} value={intern._id}>
                                                            {intern.firstName} {intern.lastName} ({intern.email})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Select Internship
                                                </label>
                                                <select
                                                    value={selectedInternship}
                                                    onChange={(e) => setSelectedInternship(e.target.value)}
                                                    className="block w-full border-2 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 px-3 py-2"
                                                    required
                                                >
                                                    <option value="">Choose an internship...</option>
                                                    {internships.map((internship) => (
                                                        <option key={internship._id} value={internship._id}>
                                                            {internship.title} ({internship.domain})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </>
                                    )}

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowGenerateModal(false);
                                                setGenerationMode('auto');
                                                setSelectedEnrollment('');
                                                setSelectedIntern('');
                                                setSelectedInternship('');
                                            }}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={generating}
                                            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                                        >
                                            {generating ? 'Generating...' : 'Generate Certificate'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </AdminLayout>
        </>
    );
}
