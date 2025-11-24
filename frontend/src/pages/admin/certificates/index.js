import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';
import {
    FiAward, FiUser, FiCalendar, FiDownload, FiPlus, FiCheckCircle, FiXCircle, FiAlertTriangle
} from 'react-icons/fi';
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
    Avatar,
    Alert
} from '@/components/ui';
import { useApiCall } from '@/hooks/useCommon';

export default function AdminCertificates() {
    const { user } = useAuth();
    const router = useRouter();
    const [certificates, setCertificates] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [interns, setInterns] = useState([]);
    const [internships, setInternships] = useState([]);

    // Modal State
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [generationMode, setGenerationMode] = useState('auto');
    const [selectedEnrollment, setSelectedEnrollment] = useState('');
    const [selectedIntern, setSelectedIntern] = useState('');
    const [selectedInternship, setSelectedInternship] = useState('');
    const [generating, setGenerating] = useState(false);

    const { loading, execute: fetchCertificates } = useApiCall(
        () => apiClient.get('/certificates'),
        {
            onSuccess: (data) => {
                const certificatesArray = Array.isArray(data) ? data : (data?.data || []);
                setCertificates(certificatesArray);
            },
            errorMessage: 'Failed to load certificates'
        }
    );

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

    const columns = [
        {
            header: 'Certificate ID',
            accessor: 'certificateId',
            render: (cert) => <span className="font-mono text-xs">{cert.certificateId}</span>
        },
        {
            header: 'Student',
            accessor: 'user',
            render: (cert) => (
                <div className="flex items-center">
                    <Avatar
                        name={`${cert.user?.firstName} ${cert.user?.lastName}`}
                        size="sm"
                        className="mr-3"
                    />
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {cert.user?.firstName} {cert.user?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{cert.user?.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Internship',
            accessor: 'internship',
            render: (cert) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">{cert.internship?.title}</div>
                    <div className="text-sm text-gray-500">{cert.internship?.domain}</div>
                </div>
            )
        },
        {
            header: 'Issued Date',
            accessor: 'issueDate',
            render: (cert) => (
                <div className="flex items-center text-sm text-gray-500">
                    <FiCalendar className="w-4 h-4 mr-2" />
                    {new Date(cert.issueDate).toLocaleDateString()}
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (cert) => (
                <Badge variant={cert.isRevoked ? 'error' : 'success'}>
                    {cert.isRevoked ? (
                        <span className="flex items-center gap-1">
                            <FiXCircle className="w-3.5 h-3.5" /> Revoked
                        </span>
                    ) : (
                        <span className="flex items-center gap-1">
                            <FiCheckCircle className="w-3.5 h-3.5" /> Active
                        </span>
                    )}
                </Badge>
            )
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (cert) => (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleDownload(cert.pdfUrl)}
                    >
                        <FiDownload className="w-4 h-4 mr-1" /> Download
                    </Button>
                    {!cert.isRevoked && (
                        <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleRevoke(cert._id)}
                        >
                            <FiXCircle className="w-4 h-4 mr-1" /> Revoke
                        </Button>
                    )}
                </div>
            )
        }
    ];

    const enrollmentOptions = [
        { value: '', label: 'Choose an enrollment...' },
        ...enrollments.map(enrollment => ({
            value: enrollment._id,
            label: `${enrollment.user?.firstName} ${enrollment.user?.lastName} - ${enrollment.internship?.title}`
        }))
    ];

    const internOptions = [
        { value: '', label: 'Choose an intern...' },
        ...interns.map(intern => ({
            value: intern._id,
            label: `${intern.firstName} ${intern.lastName} (${intern.email})`
        }))
    ];

    const internshipOptions = [
        { value: '', label: 'Choose an internship...' },
        ...internships.map(internship => ({
            value: internship._id,
            label: `${internship.title} (${internship.domain})`
        }))
    ];

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex-center h-64">
                    <LoadingSpinner size="lg" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Head>
                <title>Certificates - Admin Panel</title>
            </Head>

            <div className="space-y-6">
                <div className="flex-between">
                    <SectionHeader
                        title="Certificates"
                        subtitle="Manage and generate certificates"
                    />
                    <Button onClick={() => setShowGenerateModal(true)}>
                        <FiPlus className="w-5 h-5 mr-2" />
                        Generate Certificate
                    </Button>
                </div>

                {certificates.length > 0 ? (
                    <ResponsiveTable
                        columns={columns}
                        data={certificates}
                    />
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <FiAward className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
                            <p className="text-gray-500 mb-4">Generate certificates for completed internships</p>
                            <Button onClick={() => setShowGenerateModal(true)}>
                                <FiPlus className="w-5 h-5 mr-2" />
                                Generate Certificate
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <Modal
                    isOpen={showGenerateModal}
                    onClose={() => {
                        setShowGenerateModal(false);
                        setGenerationMode('auto');
                        setSelectedEnrollment('');
                        setSelectedIntern('');
                        setSelectedInternship('');
                    }}
                    title="Generate Certificate"
                >
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
                                <FormSelect
                                    label="Select Completed Enrollment"
                                    value={selectedEnrollment}
                                    onChange={(e) => setSelectedEnrollment(e.target.value)}
                                    options={enrollmentOptions}
                                    required
                                    helperText="Only completed enrollments are shown"
                                />
                            </div>
                        ) : (
                            <>
                                <Alert
                                    variant="warning"
                                    title="Warning"
                                    message="Manual generation bypasses completion validation. Use only for special cases."
                                    className="mb-4"
                                />

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
                            </>
                        )}

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setShowGenerateModal(false);
                                    setGenerationMode('auto');
                                    setSelectedEnrollment('');
                                    setSelectedIntern('');
                                    setSelectedInternship('');
                                }}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={generating}
                                className="flex-1"
                            >
                                {generating ? 'Generating...' : 'Generate Certificate'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </AdminLayout>
    );
}
