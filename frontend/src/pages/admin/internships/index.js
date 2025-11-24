import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layout/AdminLayout';
import apiClient from '@/utils/apiClient';
import {
    Button,
    SectionHeader,
    Card,
    CardContent,
    LoadingSpinner,
    FormInput,
    FormSelect,
    Badge
} from '@/components/ui';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiUsers, FiBookOpen, FiCalendar, FiMoreVertical } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useApiCall } from '@/hooks/useCommon';

export default function InternshipList() {
    const [internships, setInternships] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const router = useRouter();

    const { loading, execute: fetchInternships } = useApiCall(
        () => apiClient.get('/internships'),
        {
            onSuccess: (response) => setInternships(response.data),
            errorMessage: 'Failed to load internships',
            showErrorToast: true
        }
    );

    useEffect(() => {
        fetchInternships();
    }, []);

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
            internship.domain?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || internship.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusVariant = (status) => {
        switch (status) {
            case 'open': return 'success';
            case 'closed': return 'error';
            case 'draft': return 'default';
            case 'archived': return 'warning';
            default: return 'default';
        }
    };

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'open', label: 'Open' },
        { value: 'closed', label: 'Closed' },
        { value: 'draft', label: 'Draft' },
        { value: 'archived', label: 'Archived' }
    ];

    return (
        <AdminLayout>
            <Head>
                <title>Manage Internships - TechFieldSolution LMS</title>
            </Head>

            <div className="space-y-6">
                {/* Header */}
                <div className="flex-between flex-col sm:flex-row gap-4">
                    <SectionHeader
                        title="Internships"
                        subtitle="Manage internship programs and curriculum"
                    />
                    <Link href="/admin/internships/create">
                        <Button>
                            <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                            Create Internship
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <FormInput
                                name="search"
                                placeholder="Search internships..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={FiSearch}
                                className="flex-1"
                            />
                            <FormSelect
                                name="status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                options={statusOptions}
                                className="sm:w-48"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* List */}
                {loading ? (
                    <div className="flex-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : filteredInternships.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredInternships.map((internship) => (
                            <Card key={internship._id} className="card-hover overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex-between items-start mb-4">
                                        <Badge variant={getStatusVariant(internship.status)}>
                                            {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
                                        </Badge>
                                        <div className="relative group">
                                            <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                                                <FiMoreVertical className="h-5 w-5" />
                                            </button>
                                            <div className="absolute right-0 top-full pt-1 w-48 hidden group-hover:block z-10">
                                                <div className="bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                                                    <Link
                                                        href={`/admin/internships/${internship._id}`}
                                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                    >
                                                        <FiEdit2 className="mr-2 h-4 w-4" /> Edit Details
                                                    </Link>
                                                    <Link
                                                        href={`/admin/internships/${internship._id}/curriculum`}
                                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                    >
                                                        <FiBookOpen className="mr-2 h-4 w-4" /> Manage Curriculum
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(internship._id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                                    >
                                                        <FiTrash2 className="mr-2 h-4 w-4" /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-2 truncate-2">
                                        {internship.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4 truncate-3">
                                        {internship.description}
                                    </p>

                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <FiUsers className="mr-2 h-4 w-4 text-gray-400" />
                                            <span>{internship.currentEnrollments || 0} Enrolled</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FiCalendar className="mr-2 h-4 w-4 text-gray-400" />
                                            <span className="text-xs">
                                                {new Date(internship.startDate).toLocaleDateString()} - {new Date(internship.endDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                    <Link
                                        href={`/admin/internships/${internship._id}/curriculum`}
                                        className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                                    >
                                        Manage Modules & Tasks →
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                        <FiBookOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No internships found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your filters.'
                                : 'Get started by creating a new internship program.'}
                        </p>
                        {!searchTerm && statusFilter === 'all' && (
                            <div className="mt-6">
                                <Link href="/admin/internships/create">
                                    <Button>
                                        <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                                        Create Internship
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
