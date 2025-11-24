import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/layout/AdminLayout';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';
import { FiPlus, FiSearch, FiUser, FiX } from 'react-icons/fi';
import {
    SectionHeader,
    Button,
    Card,
    CardContent,
    LoadingSpinner,
    Modal,
    FormSelect,
    ResponsiveTable,
    Badge,
    Avatar
} from '@/components/ui';
import { useApiCall } from '@/hooks/useCommon';

export default function EnrollmentManagement() {
    const [enrollments, setEnrollments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [interns, setInterns] = useState([]);
    const [internships, setInternships] = useState([]);
    const [selectedIntern, setSelectedIntern] = useState('');
    const [selectedInternship, setSelectedInternship] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { loading, execute: fetchEnrollments } = useApiCall(
        () => apiClient.get('/enrollments'),
        {
            onSuccess: (response) => setEnrollments(response.data.data || []),
            errorMessage: 'Failed to load enrollments'
        }
    );

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchFormData = async () => {
        try {
            const [internsRes, internshipsRes] = await Promise.all([
                apiClient.get('/users?role=intern&limit=100'),
                apiClient.get('/internships?status=open&limit=100')
            ]);
            setInterns(internsRes.data.data || []);
            setInternships(internshipsRes.data.data || []);
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

    const getStatusVariant = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'completed': return 'info';
            case 'pending': return 'warning';
            case 'dropped': return 'error';
            default: return 'default';
        }
    };

    const columns = [
        {
            header: 'Intern',
            accessor: 'user',
            render: (enrollment) => (
                <div className="flex items-center">
                    <Avatar
                        name={`${enrollment.user?.firstName} ${enrollment.user?.lastName}`}
                        size="sm"
                        className="mr-3"
                    />
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {enrollment.user?.firstName} {enrollment.user?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{enrollment.user?.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Internship',
            accessor: 'internship',
            render: (enrollment) => (
                <div>
                    <div className="text-sm text-gray-900">{enrollment.internship?.title}</div>
                    <div className="text-sm text-gray-500">{enrollment.internship?.domain}</div>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (enrollment) => (
                <Badge variant={getStatusVariant(enrollment.status)}>
                    {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                </Badge>
            )
        },
        {
            header: 'Date',
            accessor: 'createdAt',
            render: (enrollment) => new Date(enrollment.createdAt).toLocaleDateString()
        }
    ];

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' },
        { value: 'dropped', label: 'Dropped' }
    ];

    const internOptions = [
        { value: '', label: 'Select an intern...' },
        ...interns.map(intern => ({
            value: intern._id,
            label: `${intern.firstName} ${intern.lastName} (${intern.email})`
        }))
    ];

    const internshipOptions = [
        { value: '', label: 'Select an internship...' },
        ...internships.map(internship => ({
            value: internship._id,
            label: internship.title
        }))
    ];

    return (
        <AdminLayout>
            <Head>
                <title>Manage Enrollments - TechFieldSolution LMS</title>
            </Head>

            <div className="space-y-6">
                <div className="flex-between">
                    <SectionHeader
                        title="Enrollments"
                        subtitle="Manage intern enrollments and status"
                    />
                    <Button onClick={handleOpenModal}>
                        <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                        Enroll Intern
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by intern or internship..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="sm:w-48">
                                <FormSelect
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    options={statusOptions}
                                    className="mb-0"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {loading ? (
                    <div className="flex-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : filteredEnrollments.length > 0 ? (
                    <ResponsiveTable
                        columns={columns}
                        data={filteredEnrollments}
                    />
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <FiUser className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No enrollments found</h3>
                            <p className="mt-1 text-sm text-gray-500">Enroll interns into internship programs.</p>
                        </CardContent>
                    </Card>
                )}

                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title="Enroll Intern"
                >
                    <form onSubmit={handleEnroll} className="space-y-4">
                        <FormSelect
                            label="Select Intern"
                            value={selectedIntern}
                            onChange={(e) => setSelectedIntern(e.target.value)}
                            options={internOptions}
                            required
                        />

                        <FormSelect
                            label="Select Internship"
                            value={selectedInternship}
                            onChange={(e) => setSelectedInternship(e.target.value)}
                            options={internshipOptions}
                            required
                        />

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting ? 'Enrolling...' : 'Enroll Intern'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </AdminLayout>
    );
}
