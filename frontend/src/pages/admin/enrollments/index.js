import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/layout/AdminLayout';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';
import { FiPlus, FiSearch, FiFilter, FiUser, FiBook, FiCheckCircle, FiX } from 'react-icons/fi';

export default function EnrollmentManagement() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [interns, setInterns] = useState([]);
    const [internships, setInternships] = useState([]);
    const [selectedIntern, setSelectedIntern] = useState('');
    const [selectedInternship, setSelectedInternship] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const response = await apiClient.get('/enrollments');
            setEnrollments(response.data.data);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
            toast.error('Failed to load enrollments');
        } finally {
            setLoading(false);
        }
    };

    const fetchFormData = async () => {
        try {
            const [internsRes, internshipsRes] = await Promise.all([
                apiClient.get('/users?role=intern&limit=100'),
                apiClient.get('/internships?status=open&limit=100')
            ]);
            setInterns(internsRes.data.data);
            setInternships(internshipsRes.data.data);
        } catch (error) {
            console.error('Error fetching form data:', error);
            toast.error('Failed to load interns or internships');
        }
    };

    const handleOpenModal = () => {
        fetchFormData();
        setShowModal(true);
    };

    const handleEnroll = async (e) => {
        e.preventDefault();
        if (!selectedIntern || !selectedInternship) {
            toast.error('Please select both intern and internship');
            return;
        }

        setSubmitting(true);
        try {
            await apiClient.post('/enrollments', {
                user: selectedIntern,
                internship: selectedInternship
            });
            toast.success('Intern enrolled successfully');
            setShowModal(false);
            setSelectedIntern('');
            setSelectedInternship('');
            fetchEnrollments();
        } catch (error) {
            console.error('Error enrolling intern:', error);
            toast.error(error.response?.data?.message || 'Failed to enroll intern');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredEnrollments = enrollments.filter(enrollment => {
        const searchString = searchTerm.toLowerCase();
        const matchesSearch =
            enrollment.user?.firstName?.toLowerCase().includes(searchString) ||
            enrollment.user?.lastName?.toLowerCase().includes(searchString) ||
            enrollment.user?.email?.toLowerCase().includes(searchString) ||
            enrollment.internship?.title?.toLowerCase().includes(searchString);

        const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'dropped': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout>
            <Head>
                <title>Manage Enrollments - TechFieldSolution LMS</title>
            </Head>

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Enrollments</h1>
                        <p className="text-sm text-gray-500">Manage intern enrollments and status</p>
                    </div>
                    <button
                        onClick={handleOpenModal}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                        Enroll Intern
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by intern or internship..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="sm:w-48">
                            <select
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="dropped">Dropped</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : filteredEnrollments.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intern</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internship</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredEnrollments.map((enrollment) => (
                                    <tr key={enrollment._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <FiUser className="h-5 w-5 text-gray-500" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {enrollment.user?.firstName} {enrollment.user?.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{enrollment.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{enrollment.internship?.title}</div>
                                            <div className="text-sm text-gray-500">{enrollment.internship?.domain}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(enrollment.status)}`}>
                                                {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(enrollment.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                        <FiUser className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No enrollments found</h3>
                        <p className="mt-1 text-sm text-gray-500">Enroll interns into internship programs.</p>
                    </div>
                )}

                {/* Enroll Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-neutral-200 animate-scale-up">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
                                <h2 className="text-lg font-semibold text-neutral-900">Enroll Intern</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleEnroll} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Intern</label>
                                    <select
                                        required
                                        value={selectedIntern}
                                        onChange={(e) => setSelectedIntern(e.target.value)}
                                        className="block w-full border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                    >
                                        <option value="">Select an intern...</option>
                                        {interns.map(intern => (
                                            <option key={intern._id} value={intern._id}>
                                                {intern.firstName} {intern.lastName} ({intern.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Internship</label>
                                    <select
                                        required
                                        value={selectedInternship}
                                        onChange={(e) => setSelectedInternship(e.target.value)}
                                        className="block w-full border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                    >
                                        <option value="">Select an internship...</option>
                                        {internships.map(internship => (
                                            <option key={internship._id} value={internship._id}>
                                                {internship.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                                    >
                                        {submitting ? 'Enrolling...' : 'Enroll Intern'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
