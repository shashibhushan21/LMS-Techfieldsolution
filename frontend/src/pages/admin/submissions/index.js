import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';
import {
    FiFileText, FiUser, FiCalendar, FiCheckCircle, FiClock,
    FiAward, FiEye, FiX
} from 'react-icons/fi';

export default function AdminSubmissions() {
    const { user } = useAuth();
    const router = useRouter();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showGradeModal, setShowGradeModal] = useState(false);
    const [gradeForm, setGradeForm] = useState({ score: '', feedback: '' });
    const [grading, setGrading] = useState(false);

    useEffect(() => {
        if (user && user.role !== 'admin' && user.role !== 'mentor') {
            router.push('/dashboard');
            return;
        }
        fetchSubmissions();
    }, [user, filter]);

    const fetchSubmissions = async () => {
        try {
            const params = filter !== 'all' ? `?status=${filter}` : '';
            const response = await apiClient.get(`/submissions${params}`);
            setSubmissions(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch submissions:', error);
            toast.error('Failed to load submissions');
        } finally {
            setLoading(false);
        }
    };

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

    const getStatusBadge = (status) => {
        const badges = {
            submitted: { text: 'Submitted', className: 'bg-blue-100 text-blue-800', icon: FiClock },
            graded: { text: 'Graded', className: 'bg-green-100 text-green-800', icon: FiCheckCircle },
            pending: { text: 'Pending', className: 'bg-yellow-100 text-yellow-800', icon: FiClock }
        };
        return badges[status] || badges.pending;
    };

    const filteredSubmissions = submissions.filter(sub => {
        if (filter === 'all') return true;
        return sub.status === filter;
    });

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </AdminLayout>
        );
    }

    const filterOptions = [
        { value: 'all', label: 'All', count: submissions.length },
        { value: 'submitted', label: 'Submitted', count: submissions.filter(s => s.status === 'submitted').length },
        { value: 'graded', label: 'Graded', count: submissions.filter(s => s.status === 'graded').length }
    ];

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
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
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
                    </div>

                    {/* Submissions Table */}
                    {filteredSubmissions.length > 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Student
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Assignment
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Submitted
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Score
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredSubmissions.map((submission) => {
                                            const statusBadge = getStatusBadge(submission.status);
                                            const StatusIcon = statusBadge.icon;

                                            return (
                                                <tr key={submission._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                                <FiUser className="w-5 h-5 text-primary-600" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {submission.user?.firstName} {submission.user?.lastName}
                                                                </div>
                                                                <div className="text-sm text-gray-500">{submission.user?.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">{submission.assignment?.title}</div>
                                                        <div className="text-sm text-gray-500">
                                                            Max Score: {submission.assignment?.maxScore} pts
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <FiCalendar className="w-4 h-4 mr-2" />
                                                            {new Date(submission.submittedAt).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}>
                                                            <StatusIcon className="w-3.5 h-3.5" />
                                                            {statusBadge.text}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {submission.score !== undefined && submission.score !== null ? (
                                                            <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                                                <FiAward className="w-4 h-4 text-yellow-500" />
                                                                {submission.score}/{submission.assignment?.maxScore}
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-400">Not graded</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => handleGradeClick(submission)}
                                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                                        >
                                                            <FiEye className="w-4 h-4" />
                                                            {submission.status === 'graded' ? 'Review' : 'Grade'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                            <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
                            <p className="text-gray-500">
                                {filter === 'all' ? 'No submissions yet' : `No ${filter} submissions`}
                            </p>
                        </div>
                    )}
                </div>

                {/* Grading Modal */}
                {showGradeModal && selectedSubmission && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Grade Submission</h2>
                                <button
                                    onClick={() => setShowGradeModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-6">
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Score (out of {selectedSubmission.assignment?.maxScore})
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max={selectedSubmission.assignment?.maxScore}
                                            step="0.5"
                                            value={gradeForm.score}
                                            onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                                            className="block w-full border-2 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 px-3 py-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Feedback
                                        </label>
                                        <textarea
                                            value={gradeForm.feedback}
                                            onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                                            rows={6}
                                            className="block w-full border-2 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 px-3 py-2"
                                            placeholder="Provide feedback to the student..."
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowGradeModal(false)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={grading}
                                            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                                        >
                                            {grading ? 'Grading...' : 'Submit Grade'}
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
