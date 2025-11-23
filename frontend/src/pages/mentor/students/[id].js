import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Avatar from '@/components/ui/Avatar';
import apiClient from '@/utils/apiClient';
import {
  FiUser, FiMail, FiCalendar, FiBook, FiFileText,
  FiCheckCircle, FiClock, FiAward, FiMessageSquare,
  FiTrendingUp, FiActivity
} from 'react-icons/fi';

export default function StudentDetail() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
      } else if (user.role !== 'mentor') {
        router.push('/dashboard');
      } else if (id) {
        fetchStudentData();
      }
    }
  }, [user, authLoading, id]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);

      // Fetch all student data from mentor endpoint
      const response = await apiClient.get(`/mentors/students/${id}`);
      const { student, enrollments, submissions } = response.data.data;

      setStudent(student);
      setEnrollments(enrollments || []);
      setSubmissions(submissions || []);

      // Calculate stats
      calculateStats(enrollments || [], submissions || []);
    } catch (error) {
      console.error('Failed to fetch student data:', error);
      if (error.response?.status === 403 || error.response?.status === 404) {
        router.push('/mentor/students');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (enrollments, submissions) => {
    const totalEnrollments = enrollments.length;
    const activeEnrollments = enrollments.filter(e => e.status === 'active').length;
    const completedEnrollments = enrollments.filter(e => e.status === 'completed').length;

    const totalSubmissions = submissions.length;
    const gradedSubmissions = submissions.filter(s => s.status === 'graded' && s.score !== null).length;

    // Calculate average score properly - submissions have 'score' field and assignment has 'maxScore'
    let averageScore = 0;
    if (gradedSubmissions > 0) {
      const totalPercentage = submissions
        .filter(s => s.status === 'graded' && s.score !== null && s.assignment?.maxScore)
        .reduce((acc, s) => {
          const percentage = (s.score / s.assignment.maxScore) * 100;
          return acc + percentage;
        }, 0);
      averageScore = totalPercentage / gradedSubmissions;
    }

    setStats({
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      totalSubmissions,
      gradedSubmissions,
      pendingSubmissions: totalSubmissions - gradedSubmissions,
      averageScore: averageScore > 0 ? averageScore.toFixed(1) : '0'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      submitted: 'bg-blue-100 text-blue-800',
      graded: 'bg-green-100 text-green-800',
      late: 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
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

  if (!student) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Student not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiUser },
    { id: 'enrollments', label: 'Enrollments', icon: FiBook },
    { id: 'submissions', label: 'Submissions', icon: FiFileText }
  ];

  return (
    <>
      <Head>
        <title>{student.firstName} {student.lastName} - Mentor Dashboard</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar
                  name={`${student.firstName} ${student.lastName}`}
                  src={student.avatar}
                  size="2xl"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {student.firstName} {student.lastName}
                  </h1>
                  <div className="mt-2 space-y-1">
                    <p className="flex items-center gap-2 text-gray-600">
                      <FiMail className="w-4 h-4" />
                      {student.email}
                    </p>
                    {student.phone && (
                      <p className="flex items-center gap-2 text-gray-600">
                        <FiUser className="w-4 h-4" />
                        {student.phone}
                      </p>
                    )}
                    <p className="flex items-center gap-2 text-gray-600">
                      <FiCalendar className="w-4 h-4" />
                      Joined {new Date(student.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/dashboard/messages?user=${student._id}`)}
                  className="btn btn-sm btn-secondary inline-flex items-center gap-2"
                >
                  <FiMessageSquare className="w-4 h-4" />
                  Message
                </button>
                <button
                  onClick={() => router.push('/mentor/students')}
                  className="btn btn-sm btn-secondary"
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Enrollments</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FiBook className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Submissions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiFileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiTrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Reviews</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingSubmissions}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FiClock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Full Name</p>
                          <p className="font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium text-gray-900">{student.email}</p>
                        </div>
                        {student.phone && (
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium text-gray-900">{student.phone}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-600">Joined Date</p>
                          <p className="font-medium text-gray-900">
                            {new Date(student.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Performance Summary */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Active Enrollments</span>
                            <span className="font-medium text-gray-900">
                              {stats?.activeEnrollments} / {stats?.totalEnrollments}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{
                                width: `${stats?.totalEnrollments > 0
                                  ? (stats.activeEnrollments / stats.totalEnrollments) * 100
                                  : 0}%`
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Graded Submissions</span>
                            <span className="font-medium text-gray-900">
                              {stats?.gradedSubmissions} / {stats?.totalSubmissions}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{
                                width: `${stats?.totalSubmissions > 0
                                  ? (stats.gradedSubmissions / stats.totalSubmissions) * 100
                                  : 0}%`
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Average Score</span>
                            <span className="font-medium text-gray-900">{stats?.averageScore}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${stats?.averageScore || 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enrollments Tab */}
              {activeTab === 'enrollments' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Enrolled Internships</h3>
                  {enrollments.length > 0 ? (
                    <div className="grid gap-4">
                      {enrollments.map((enrollment) => (
                        <div
                          key={enrollment._id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">
                                {enrollment.internship?.title || 'Untitled Internship'}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {enrollment.internship?.description}
                              </p>
                              <div className="flex gap-4 mt-3 text-sm">
                                <span className="text-gray-500">
                                  Enrolled: {new Date(enrollment.createdAt).toLocaleDateString()}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${enrollment.status === 'active' ? 'bg-green-100 text-green-800' :
                                    enrollment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                      'bg-gray-100 text-gray-800'
                                  }`}>
                                  {enrollment.status}
                                </span>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-sm text-gray-600 mb-1">Progress</div>
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-primary-600 h-2 rounded-full"
                                    style={{ width: `${enrollment.progressPercentage || 0}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  {enrollment.progressPercentage || 0}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <FiBook className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No enrollments found</p>
                    </div>
                  )}
                </div>
              )}

              {/* Submissions Tab */}
              {activeTab === 'submissions' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Submission History</h3>
                  {submissions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Assignment
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Submitted
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Score
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {submissions.map((submission) => (
                            <tr key={submission._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <p className="font-medium text-gray-900">
                                  {submission.assignment?.title || 'Untitled Assignment'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {submission.assignment?.internship?.title}
                                </p>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {new Date(submission.submittedAt || submission.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(submission.status)}`}>
                                  {submission.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                {submission.status === 'graded' && submission.score !== null ? (
                                  <span className="font-medium text-gray-900">
                                    {submission.score}/{submission.assignment?.maxScore || 100}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => router.push(`/mentor/submissions/${submission._id}`)}
                                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No submissions found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
