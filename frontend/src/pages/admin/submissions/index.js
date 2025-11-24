import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';
import {
    SectionHeader,
    Card,
    CardContent,
    LoadingSpinner,
    Modal,
    FormInput,
    FormTextarea,
    Button,
    Badge,
    ResponsiveTable,
    Avatar
} from '@/components/ui';
import {
    FiFileText, FiUser, FiCalendar, FiCheckCircle, FiClock,
    FiAward, FiEye
} from 'react-icons/fi';
import { useApiCall } from '@/hooks/useCommon';

export default function AdminSubmissions() {
    const { user } = useAuth();
    const router = useRouter();
    const [submissions, setSubmissions] = useState([]);
    const [filter, setFilter] = useState('all');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showGradeModal, setShowGradeModal] = useState(false);
    const [gradeForm, setGradeForm] = useState({ score: '', feedback: '' });
    const [grading, setGrading] = useState(false);

    const { loading, execute: fetchSubmissions } = useApiCall(
        () => {
            const params = filter !== 'all' ? `?status=${filter}` : '';
            return apiClient.get(`/submissions${params}`);
        },
        {
            onSuccess: (response) => setSubmissions(response.data || []),
            errorMessage: 'Failed to load submissions',
            showErrorToast: true
        }
    );

    useEffect(() => {
        if (user && user.role !== 'admin' && user.role !== 'mentor') {
            router.push('/dashboard');
            return;
        }
        fetchSubmissions();
    }, [user, filter]);

    const handleGradeClick = (submission) => {
        setSelectedSubmission(submission);
        setGradeForm({
            score: submission.score || '',
            feedback: submission.feedback || ''
        });
        setShowGradeModal(true);
    };

    const handleGradeSubmit = async (e) => {
        e.preventDefault();

        if (!gradeForm.score) {
            toast.error('Please enter a score');
            return;
        }

        const assignment = selectedSubmission.assignment;
        if (parseFloat(gradeForm.score) > assignment.maxScore) {
            toast.error(`Score cannot exceed ${assignment.maxScore}`);
            return;
        }

        setGrading(true);
        try {
            await apiClient.put(`/submissions/${selectedSubmission._id}/grade`, gradeForm);
            toast.success('Submission graded successfully!');
            setShowGradeModal(false);
            fetchSubmissions();
        } catch (error) {
            console.error('Failed to grade submission:', error);
            toast.error(error.response?.data?.message || 'Failed to grade submission');
        } finally {
            setGrading(false);
        }
    };

    const getStatusVariant = (status) => {
        const variants = {
            submitted: 'info',
            graded: 'success',
            pending: 'warning'
        };
        return variants[status] || 'default';
    };

    const filteredSubmissions = submissions.filter(sub => {
        if (filter === 'all') return true;
        return sub.status === filter;
    });

    const filterOptions = [
        { value: 'all', label: 'All', count: submissions.length },
        { value: 'submitted', label: 'Submitted', count: submissions.filter(s => s.status === 'submitted').length },
        { value: 'graded', label: 'Graded', count: submissions.filter(s => s.status === 'graded').length }
    ];

    // Table columns
    const columns = [
        {
            header: 'Student',
            accessor: 'student',
            render: (submission) => (
                <div className="flex items-center">
                    <Avatar
                        name={`${submission.user?.firstName} ${submission.user?.lastName}`}
                        size="sm"
                    />
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {submission.user?.firstName} {submission.user?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{submission.user?.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Assignment',
            accessor: 'assignment',
            render: (submission) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">{submission.assignment?.title}</div>
                    <div className="text-sm text-gray-500">
                        Max Score: {submission.assignment?.maxScore} pts
                    </div>
                </div>
            )
        },
        {
            header: 'Submitted',
            accessor: 'submittedAt',
            render: (submission) => (
                <div className="flex items-center text-sm text-gray-500">
                    <FiCalendar className="w-4 h-4 mr-2" />
                    {new Date(submission.submittedAt).toLocaleDateString()}
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (submission) => (
                <Badge variant={getStatusVariant(submission.status)}>
                    {submission.status === 'submitted' && <FiClock className="w-3.5 h-3.5 mr-1" />}
                    {submission.status === 'graded' && <FiCheckCircle className="w-3.5 h-3.5 mr-1" />}
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                </Badge>
            )
        },
        {
            header: 'Score',
            accessor: 'score',
            render: (submission) => (
                submission.score !== undefined && submission.score !== null ? (
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                        <FiAward className="w-4 h-4 text-yellow-500" />
                        {submission.score}/{submission.assignment?.maxScore}
                    </div>
                ) : (
                    <span className="text-sm text-gray-400">Not graded</span>
                )
            )
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (submission) => (
                <div className="text-right">
                    <Button
                        size="sm"
                        onClick={() => handleGradeClick(submission)}
                    >
                        <FiEye className="w-4 h-4 mr-2" />
                        {submission.status === 'graded' ? 'Review' : 'Grade'}
                    </Button>
                </div>
            )
        }
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
        <>
            <Head>
                <title>Submissions - Admin Panel</title>
            </Head>

            <AdminLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg">
                        <h1 className="text-2xl font-bold mb-1">Assignment Submissions</h1>
                        <p className="text-primary-100">Review and grade intern submissions</p>
                    </div>

                    {/* Filters */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3 flex-wrap">
                                <FiFileText className="w-5 h-5 text-gray-400" />
                                <div className="flex gap-2 flex-wrap">
                                    {filterOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setFilter(option.value)}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === option.value
                                                    ? 'bg-primary-600 text-white shadow-md'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {option.label}
                                            {option.count > 0 && (
                                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === option.value ? 'bg-white/20' : 'bg-gray-200'
                                                    }`}>
                                                    {option.count}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submissions Table */}
                    {filteredSubmissions.length > 0 ? (
                        <ResponsiveTable
                            columns={columns}
                            data={filteredSubmissions}
                            loading={loading}
                        />
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
                                <p className="text-gray-500">
                                    {filter === 'all' ? 'No submissions yet' : `No ${filter} submissions`}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Grading Modal */}
                <Modal
                    isOpen={showGradeModal}
                    onClose={() => setShowGradeModal(false)}
                    title="Grade Submission"
                    size="lg"
                >
                    {selectedSubmission && (
                        <div className="space-y-6">
                            {/* Student Info */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Student Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Name</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {selectedSubmission.user?.firstName} {selectedSubmission.user?.lastName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-sm font-medium text-gray-900">{selectedSubmission.user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Assignment Info */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Assignment</h3>
                                <p className="text-sm font-medium text-gray-900">{selectedSubmission.assignment?.title}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Max Score: {selectedSubmission.assignment?.maxScore} points
                                </p>
                            </div>

                            {/* Submission Content */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Submission</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-700 whitespace-pre-line">
                                        {selectedSubmission.content || 'No text submission'}
                                    </p>
                                    {selectedSubmission.repositoryLink && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <p className="text-xs text-gray-500 mb-1">Repository Link:</p>
                                            <a
                                                href={selectedSubmission.repositoryLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary-600 hover:text-primary-700 underline break-all"
                                            >
                                                {selectedSubmission.repositoryLink}
                                            </a>
                                        </div>
                                    )}
                                    {selectedSubmission.liveLink && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <p className="text-xs text-gray-500 mb-1">Live Demo Link:</p>
                                            <a
                                                href={selectedSubmission.liveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary-600 hover:text-primary-700 underline break-all"
                                            >
                                                {selectedSubmission.liveLink}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Grading Form */}
                            <form onSubmit={handleGradeSubmit} className="space-y-4">
                                <FormInput
                                    label={`Score (out of ${selectedSubmission.assignment?.maxScore})`}
                                    name="score"
                                    type="number"
                                    min="0"
                                    max={selectedSubmission.assignment?.maxScore}
                                    step="0.5"
                                    value={gradeForm.score}
                                    onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                                    required
                                />

                                <FormTextarea
                                    label="Feedback"
                                    name="feedback"
                                    value={gradeForm.feedback}
                                    onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                                    rows={6}
                                    placeholder="Provide feedback to the student..."
                                />

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowGradeModal(false)}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={grading}
                                        className="flex-1"
                                    >
                                        {grading ? 'Grading...' : 'Submit Grade'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </Modal>
            </AdminLayout>
        </>
    );
}
