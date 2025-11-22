import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';
import {
    FiArrowLeft, FiClock, FiCalendar, FiAward, FiFileText,
    FiUpload, FiCheckCircle, FiAlertCircle, FiDownload
} from 'react-icons/fi';

export default function AssignmentDetails() {
    const router = useRouter();
    const { id } = router.query;
    const { user } = useAuth();
    const [assignment, setAssignment] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [submissionText, setSubmissionText] = useState('');
    const [repositoryLink, setRepositoryLink] = useState('');
    const [liveLink, setLiveLink] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (id && user) {
            fetchAssignmentDetails();
        }
    }, [id, user]);

    const fetchAssignmentDetails = async () => {
        if (!user) return;

        try {
            const [assignmentRes, submissionRes] = await Promise.all([
                apiClient.get(`/assignments/${id}`),
                apiClient.get(`/submissions?assignment=${id}&user=${user._id}`).catch(() => ({ data: { data: [] } }))
            ]);

            setAssignment(assignmentRes.data.data);
            if (submissionRes.data.data && submissionRes.data.data.length > 0) {
                setSubmission(submissionRes.data.data[0]);
            }
        } catch (error) {
            console.error('Error fetching assignment:', error);
            toast.error('Failed to load assignment details');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!submissionText && !selectedFile && !repositoryLink && !liveLink) {
            toast.error('Please provide at least one form of submission');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('assignment', id);
            formData.append('submissionText', submissionText);
            formData.append('repositoryLink', repositoryLink);
            formData.append('liveLink', liveLink);
            if (selectedFile) {
                formData.append('files', selectedFile);
            }

            await apiClient.post('/submissions', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Assignment submitted successfully!');
            fetchAssignmentDetails();
            setSubmissionText('');
            setRepositoryLink('');
            setLiveLink('');
            setSelectedFile(null);
        } catch (error) {
            console.error('Error submitting assignment:', error);
            toast.error(error.response?.data?.message || 'Failed to submit assignment');
        } finally {
            setSubmitting(false);
        }
    };

    const getDaysUntilDue = (dueDate) => {
        const now = new Date();
        const due = new Date(dueDate);
        const diffTime = due - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { text: `${Math.abs(diffDays)} days overdue`, color: 'text-red-600' };
        if (diffDays === 0) return { text: 'Due today', color: 'text-orange-600' };
        if (diffDays === 1) return { text: 'Due tomorrow', color: 'text-yellow-600' };
        if (diffDays <= 3) return { text: `${diffDays} days left`, color: 'text-yellow-600' };
        return { text: `${diffDays} days left`, color: 'text-gray-600' };
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!assignment) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Assignment not found</h2>
                    <Link href="/dashboard/assignments" className="text-primary-600 hover:text-primary-700">
                        ← Back to assignments
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    const daysUntilDue = getDaysUntilDue(assignment.dueDate);
    const isOverdue = new Date(assignment.dueDate) < new Date();
    const hasSubmission = submission !== null;

    return (
        <>
            <Head>
                <title>{assignment.title} - Assignment</title>
            </Head>

            <DashboardLayout>
                <div className="space-y-6">
                    {/* Back Button */}
                    <Link
                        href="/dashboard/assignments"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Back to Assignments
                    </Link>

                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-3 capitalize">
                                    {assignment.type}
                                </span>
                                <h1 className="text-3xl font-bold mb-2">{assignment.title}</h1>
                                <p className="text-primary-100">{assignment.internship?.title}</p>
                            </div>
                            {hasSubmission && (
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium">
                                    <FiCheckCircle className="w-5 h-5" />
                                    Submitted
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="bg-white/10 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-primary-100 text-sm mb-1">
                                    <FiCalendar className="w-4 h-4" />
                                    Due Date
                                </div>
                                <div className="font-semibold">{new Date(assignment.dueDate).toLocaleDateString()}</div>
                                <div className={`text-xs mt-1 ${daysUntilDue.color}`}>{daysUntilDue.text}</div>
                            </div>

                            <div className="bg-white/10 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-primary-100 text-sm mb-1">
                                    <FiAward className="w-4 h-4" />
                                    Max Score
                                </div>
                                <div className="font-semibold">{assignment.maxScore} pts</div>
                            </div>

                            <div className="bg-white/10 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-primary-100 text-sm mb-1">
                                    <FiCheckCircle className="w-4 h-4" />
                                    Passing Score
                                </div>
                                <div className="font-semibold">{assignment.passingScore} pts</div>
                            </div>

                            {submission?.score !== undefined && (
                                <div className="bg-white/10 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-primary-100 text-sm mb-1">
                                        <FiAward className="w-4 h-4" />
                                        Your Score
                                    </div>
                                    <div className="font-semibold text-yellow-300">{submission.score}/{assignment.maxScore}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Description */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                                <p className="text-gray-700 whitespace-pre-line">{assignment.description}</p>
                            </div>

                            {/* Instructions */}
                            {assignment.instructions && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h2>
                                    <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                                        {assignment.instructions}
                                    </div>
                                </div>
                            )}

                            {/* Resources */}
                            {assignment.resources && assignment.resources.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Resources</h2>
                                    <div className="space-y-2">
                                        {assignment.resources.map((resource, index) => (
                                            <a
                                                key={index}
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <FiDownload className="w-5 h-5 text-primary-600" />
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">{resource.title}</div>
                                                    {resource.type && <div className="text-xs text-gray-500">{resource.type}</div>}
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Submission Form */}
                            {!hasSubmission && !isOverdue && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Submit Assignment</h2>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Submission Text */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Submission Text / Description
                                            </label>
                                            <textarea
                                                value={submissionText}
                                                onChange={(e) => setSubmissionText(e.target.value)}
                                                rows={6}
                                                className="block w-full border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                placeholder="Describe your work, approach, challenges faced, etc..."
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Provide a brief description of your submission
                                            </p>
                                        </div>

                                        {/* Links Section */}
                                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <h3 className="text-sm font-semibold text-gray-900">Project Links</h3>

                                            {/* GitHub/Repository Link */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    GitHub / Repository Link
                                                    {assignment.requireRepositoryLink && <span className="text-red-500 ml-1">*</span>}
                                                </label>
                                                <input
                                                    type="url"
                                                    value={repositoryLink}
                                                    onChange={(e) => setRepositoryLink(e.target.value)}
                                                    required={assignment.requireRepositoryLink}
                                                    className="block w-full border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                    placeholder="https://github.com/username/repository"
                                                />
                                            </div>

                                            {/* Live Link */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Live Demo / Deployed Link
                                                </label>
                                                <input
                                                    type="url"
                                                    value={liveLink}
                                                    onChange={(e) => setLiveLink(e.target.value)}
                                                    className="block w-full border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                    placeholder="https://your-project.vercel.app"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">
                                                    If applicable, provide a link to your deployed project
                                                </p>
                                            </div>
                                        </div>

                                        {/* File Upload */}
                                        {(assignment.requireFileUpload || true) && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Upload Files
                                                    {assignment.requireFileUpload && <span className="text-red-500 ml-1">*</span>}
                                                </label>
                                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 transition-colors">
                                                    <div className="space-y-1 text-center">
                                                        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                                                        <div className="flex text-sm text-gray-600">
                                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                                                                <span>Upload a file</span>
                                                                <input
                                                                    type="file"
                                                                    className="sr-only"
                                                                    onChange={handleFileChange}
                                                                    required={assignment.requireFileUpload}
                                                                    accept={assignment.allowedFileTypes?.join(',')}
                                                                />
                                                            </label>
                                                            <p className="pl-1">or drag and drop</p>
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            {assignment.allowedFileTypes && assignment.allowedFileTypes.length > 0
                                                                ? `Allowed: ${assignment.allowedFileTypes.join(', ')}`
                                                                : 'PDF, DOC, ZIP, or images up to 10MB'}
                                                        </p>
                                                        {selectedFile && (
                                                            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                                                <p className="text-sm text-green-800 font-medium flex items-center gap-2">
                                                                    <FiCheckCircle className="w-4 h-4" />
                                                                    {selectedFile.name}
                                                                </p>
                                                                <p className="text-xs text-green-600 mt-1">
                                                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <div className="pt-4 border-t border-gray-200">
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            >
                                                {submitting ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiCheckCircle className="w-5 h-5 mr-2" />
                                                        Submit Assignment
                                                    </>
                                                )}
                                            </button>
                                            <p className="mt-2 text-xs text-center text-gray-500">
                                                Make sure all required fields are filled before submitting
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Feedback */}
                            {submission?.feedback && (
                                <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                                    <h2 className="text-lg font-semibold text-blue-900 mb-4">Instructor Feedback</h2>
                                    <p className="text-blue-800 whitespace-pre-line">{submission.feedback}</p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Status Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Status</h3>
                                <div className="space-y-3">
                                    {hasSubmission ? (
                                        <>
                                            <div className="flex items-center gap-2 text-green-600">
                                                <FiCheckCircle className="w-5 h-5" />
                                                <span className="font-medium">Submitted</span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                                            </div>
                                            {submission.status === 'graded' && (
                                                <div className="pt-3 border-t border-gray-200">
                                                    <div className="text-sm text-gray-600 mb-1">Grade</div>
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {submission.score}/{assignment.maxScore}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : isOverdue ? (
                                        <div className="flex items-center gap-2 text-red-600">
                                            <FiAlertCircle className="w-5 h-5" />
                                            <span className="font-medium">Overdue</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-yellow-600">
                                            <FiClock className="w-5 h-5" />
                                            <span className="font-medium">Pending Submission</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Module Info */}
                            {assignment.module && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="font-semibold text-gray-900 mb-2">Module</h3>
                                    <p className="text-gray-700">{assignment.module.title}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
