import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Avatar from '@/components/ui/Avatar';
import apiClient from '@/utils/apiClient';
import {
  FiFileText, FiUser, FiCalendar, FiClock, FiDownload,
  FiCheckCircle, FiXCircle, FiAlertCircle, FiExternalLink,
  FiSave, FiSend
} from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function SubmissionGrading() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  const [formData, setFormData] = useState({
    score: '',
    feedback: ''
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
      } else if (user.role !== 'mentor') {
        router.push('/dashboard');
      } else if (id) {
        fetchSubmission();
      }
    }
  }, [user, authLoading, id]);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/mentors/submissions/${id}`);
      const submissionData = response.data.data;
      setSubmission(submissionData);

      // Pre-fill form if already graded
      if (submissionData.status === 'graded') {
        setFormData({
          score: submissionData.score || '',
          feedback: submissionData.feedback || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch submission:', error);
      toast.error('Failed to load submission');
      if (error.response?.status === 403 || error.response?.status === 404) {
        router.push('/mentor/submissions');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitGrade = async () => {
    // Validation
    if (!formData.score || formData.score === '') {
      toast.error('Please enter score');
      return;
    }

    const score = parseFloat(formData.score);
    if (isNaN(score) || score < 0 || score > submission.assignment.maxScore) {
      toast.error(`Score must be between 0 and ${submission.assignment.maxScore}`);
      return;
    }

    if (!formData.feedback || formData.feedback.trim() === '') {
      toast.error('Please provide feedback');
      return;
    }

    try {
      setGrading(true);
      await apiClient.put(`/mentors/submissions/${id}/grade`, {
        earnedPoints: parseFloat(formData.earnedPoints),
        feedback: formData.feedback.trim()
      });

      toast.success('Submission graded successfully');
      fetchSubmission(); // Refresh data
    } catch (error) {
      console.error('Failed to grade submission:', error);
      toast.error(error.response?.data?.message || 'Failed to grade submission');
    } finally {
      setGrading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FiClock },
      submitted: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FiAlertCircle },
      graded: { bg: 'bg-green-100', text: 'text-green-800', icon: FiCheckCircle },
      late: { bg: 'bg-red-100', text: 'text-red-800', icon: FiXCircle }
    };
    return styles[status] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: FiFileText };
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!submission) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Submission not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const statusInfo = getStatusBadge(submission.status);
  const StatusIcon = statusInfo.icon;
  const isLate = submission.assignment?.dueDate &&
    submission.submittedAt &&
    new Date(submission.submittedAt) > new Date(submission.assignment.dueDate);

  return (
    <>
      <Head>
        <title>Grade Submission - Mentor Dashboard</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {submission.assignment?.title || 'Untitled Assignment'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {submission.assignment?.internship?.title}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                    <StatusIcon className="w-4 h-4" />
                    {submission.status}
                  </span>
                  {isLate && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      <FiClock className="w-4 h-4" />
                      Late Submission
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => router.push('/mentor/submissions')}
                className="btn btn-sm btn-secondary"
              >
                ← Back to Submissions
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Student Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
                <div className="flex items-center gap-4">
                  <Avatar
                    name={`${submission.user?.firstName} ${submission.user?.lastName}`}
                    src={submission.user?.avatar}
                    size="lg"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {submission.user?.firstName} {submission.user?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{submission.user?.email}</p>
                    <button
                      onClick={() => router.push(`/mentor/students/${submission.user?._id}`)}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-1"
                    >
                      View Student Profile →
                    </button>
                  </div>
                </div>
              </div>

              {/* Submission Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Details</h3>

                <div className="space-y-4">
                  {/* Submission Text */}
                  {submission.content && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Response:</h4>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-900 whitespace-pre-wrap">{submission.content}</p>
                      </div>
                    </div>
                  )}

                  {/* File Attachments */}
                  {submission.files && submission.files.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments:</h4>
                      <div className="space-y-2">
                        {submission.files.map((file, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <FiFileText className="w-8 h-8 text-gray-400" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">Submission File {index + 1}</p>
                              <p className="text-sm text-gray-500">
                                {file.originalName || file.fileName || 'Download attachment'}
                              </p>
                            </div>
                            <a
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-secondary inline-flex items-center gap-2"
                            >
                              <FiDownload className="w-4 h-4" />
                              Download
                            </a>
                            <a
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-secondary inline-flex items-center gap-2"
                            >
                              <FiExternalLink className="w-4 h-4" />
                              Open
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Link Submissions */}
                  {(submission.repositoryLink || submission.liveLink) && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Submission Links:</h4>
                      <div className="space-y-2">
                        {submission.repositoryLink && (
                          <div>
                            <span className="text-xs text-gray-500 uppercase font-semibold">Repository:</span>
                            <a
                              href={submission.repositoryLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-primary-600 hover:text-primary-700 hover:underline break-all"
                            >
                              {submission.repositoryLink}
                            </a>
                          </div>
                        )}
                        {submission.liveLink && (
                          <div>
                            <span className="text-xs text-gray-500 uppercase font-semibold">Live Demo:</span>
                            <a
                              href={submission.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-primary-600 hover:text-primary-700 hover:underline break-all"
                            >
                              {submission.liveLink}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Previous Feedback (if graded) */}
              {submission.status === 'graded' && submission.feedback && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <FiCheckCircle className="w-5 h-5" />
                    Previous Feedback
                  </h3>
                  <p className="text-green-800 whitespace-pre-wrap">{submission.feedback}</p>
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-sm text-green-700">
                      Graded on: {submission.gradedAt ? new Date(submission.gradedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Assignment Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Info</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Total Points</p>
                    <p className="text-2xl font-bold text-gray-900">{submission.assignment?.maxScore}</p>
                  </div>
                  {submission.assignment?.dueDate && (
                    <div>
                      <p className="text-sm text-gray-600">Due Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(submission.assignment.dueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Submitted At</p>
                    <p className="font-medium text-gray-900">
                      {new Date(submission.submittedAt || submission.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Grading Form */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {submission.status === 'graded' ? 'Update Grade' : 'Grade Submission'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Earned Points *
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max={submission.assignment?.maxScore || 100}
                        step="0.5"
                        value={formData.score}
                        onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                        className="input flex-1"
                        placeholder="0"
                      />
                      <span className="text-gray-500">/ {submission.assignment?.maxScore || 100}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Enter points between 0 and {submission.assignment?.maxScore || 100}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback *
                    </label>
                    <textarea
                      rows={6}
                      value={formData.feedback}
                      onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                      className="input resize-none"
                      placeholder="Provide detailed feedback for the student..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Be constructive and specific in your feedback
                    </p>
                  </div>

                  <button
                    onClick={handleSubmitGrade}
                    disabled={grading}
                    className="btn btn-primary w-full inline-flex items-center justify-center gap-2"
                  >
                    {grading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FiSend className="w-4 h-4" />
                        {submission.status === 'graded' ? 'Update Grade' : 'Submit Grade'}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push(`/mentor/students/${submission.user?._id}`)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    View Student Profile
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/messages?user=${submission.user?._id}`)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Message Student
                  </button>
                  <button
                    onClick={() => router.push('/mentor/submissions')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Back to All Submissions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
