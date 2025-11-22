import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layout/AdminLayout';
import apiClient from '@/utils/apiClient';
import { FiPlus, FiSearch, FiFilter, FiMoreVertical, FiEdit2, FiTrash2, FiUsers, FiBookOpen, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function InternshipList() {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const router = useRouter();

    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        try {
            const response = await apiClient.get('/internships');
            setInternships(response.data.data);
        } catch (error) {
            console.error('Error fetching internships:', error);
            toast.error('Failed to load internships');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this internship? This action cannot be undone.')) {
            try {
                await apiClient.delete(`/internships/${id}`);
                setInternships(internships.filter(i => i._id !== id));
                toast.success('Internship deleted successfully');
            } catch (error) {
                console.error('Error deleting internship:', error);
                toast.error('Failed to delete internship');
            }
        }
    };

    const filteredInternships = internships.filter(internship => {
        const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            internship.domain.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || internship.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-green-100 text-green-800';
            case 'closed': return 'bg-red-100 text-red-800';
            case 'draft': return 'bg-gray-100 text-gray-800';
            case 'archived': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout>
            <Head>
                <title>Manage Internships - TechFieldSolution LMS</title>
            </Head>

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Internships</h1>
                        <p className="text-sm text-gray-500">Manage internship programs and curriculum</p>
                    </div>
                    <Link
                        href="/admin/internships/create"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                        Create Internship
                    </Link>
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
                                placeholder="Search internships..."
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
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : filteredInternships.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredInternships.map((internship) => (
                            <div key={internship._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(internship.status)}`}>
                                            {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
                                        </span>
                                        <div className="relative group">
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <FiMoreVertical className="h-5 w-5" />
                                            </button>
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 hidden group-hover:block z-10">
                                                <Link
                                                    href={`/admin/internships/${internship._id}`}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                >
                                                    <FiEdit2 className="mr-2 h-4 w-4" /> Edit Details
                                                </Link>
                                                <Link
                                                    href={`/admin/internships/${internship._id}/curriculum`}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                >
                                                    <FiBookOpen className="mr-2 h-4 w-4" /> Manage Curriculum
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(internship._id)}
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                                >
                                                    <FiTrash2 className="mr-2 h-4 w-4" /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{internship.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{internship.description}</p>

                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <FiUsers className="mr-2 h-4 w-4 text-gray-400" />
                                            <span>{internship.currentEnrollments || 0} Enrolled</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FiCalendar className="mr-2 h-4 w-4 text-gray-400" />
                                            <span>{new Date(internship.startDate).toLocaleDateString()} - {new Date(internship.endDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                    <Link
                                        href={`/admin/internships/${internship._id}/curriculum`}
                                        className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                                    >
                                        Manage Modules & Tasks &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                        <FiBookOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No internships found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new internship program.</p>
                        <div className="mt-6">
                            <Link
                                href="/admin/internships/create"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                                Create Internship
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
