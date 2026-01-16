import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layout/AdminLayout';
import Avatar from '@/components/ui/Avatar';
import apiClient from '@/utils/apiClient';
import {
  FiUser, FiMail, FiCalendar, FiBook, FiFileText,
  FiCheckCircle, FiClock, FiAward, FiMessageSquare,
  FiTrendingUp, FiActivity, FiEdit2, FiShield
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useApiCall } from '@/hooks/useCommon';
import { LoadingSpinner } from '@/components/ui';

export default function UserDetail() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const {
    data: allUserData,
    loading,
    execute: fetchUserData
  } = useApiCall(
    async () => {
      // Fetch user profile
      const userResponse = await apiClient.get(`/users/${id}`);
      const userData = userResponse.data.data;

      let enrollmentsData = [];
      let submissionsData = [];

      // Fetch user enrollments
      try {
        const enrollmentResponse = await apiClient.get(`/enrollments/user/${id}`);
        enrollmentsData = enrollmentResponse.data.data || [];
      } catch (err) {
        enrollmentsData = [];
      }

      // Fetch user submissions
      try {
        const submissionsResponse = await apiClient.get(`/submissions?user=${id}`);
        submissionsData = submissionsResponse.data.data || [];
      } catch (err) {
        submissionsData = [];
      }

      return {
        data: {
          userData,
          enrollments: enrollmentsData,
          submissions: submissionsData
        }
      };
    },
    {
      initialData: null,
      errorMessage: 'Failed to load user data',
      onError: (error) => {
        if (error.response?.status === 404) {
          router.push('/admin/users');
        }
      }
    }
  );

  const userData = allUserData?.userData;
  const enrollments = allUserData?.enrollments || [];
  const submissions = allUserData?.submissions || [];

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
      } else if (user.role !== 'admin') {
        router.push('/dashboard');
      } else if (id) {
        fetchUserData();
      }
    }
  }, [user, authLoading, id]);

  useEffect(() => {
    if (enrollments.length > 0 || submissions.length > 0) {
      calculateStats(enrollments, submissions);
    }
  }, [enrollments, submissions]);

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

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-800',
      mentor: 'bg-blue-100 text-blue-800',
      intern: 'bg-green-100 text-green-800'
    };
    return styles[role] || 'bg-gray-100 text-gray-800';
  };

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  if (!userData) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">User not found</p>
        </div>
      </AdminLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiUser },
    { id: 'enrollments', label: 'Enrollments', icon: FiBook },
    { id: 'submissions', label: 'Submissions', icon: FiFileText },
    { id: 'activity', label: 'Activity', icon: FiActivity }
  ];

  return (
    <>
      <Head>
        <title>{userData.firstName} {userData.lastName} - Admin Dashboard</title>
      </Head>

      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar
                  name={`${userData.firstName} ${userData.lastName}`}
                  src={userData.avatar}
                  size="2xl"
                />
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {userData.firstName} {userData.lastName}
                    </h1>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(userData.role)}`}>
                      <FiShield className="w-3 h-3" />
                      {userData.role}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="flex items-center gap-2 text-gray-600">
                      <FiMail className="w-4 h-4" />
                      {userData.email}
                    </p>
                    {userData.phone && (
                      <p className="flex items-center gap-2 text-gray-600">
                        <FiUser className="w-4 h-4" />
                        {userData.phone}
                      </p>
                    )}
                    <p className="flex items-center gap-2 text-gray-600">
                      <FiCalendar className="w-4 h-4" />
                      Joined {new Date(userData.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/admin/users`)}
                  className="btn btn-sm btn-secondary inline-flex items-center gap-2"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit User
                </button>
                <button
                  onClick={() => router.push('/admin/users')}
                  className="btn btn-sm btn-secondary"
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards - Only show for interns */}
          {userData.role === 'intern' && stats && (
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
                            {userData.firstName} {userData.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium text-gray-900">{userData.email}</p>
                        </div>
                        {userData.phone && (
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium text-gray-900">{userData.phone}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-600">Role</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(userData.role)}`}>
                            {userData.role}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Account Status</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${userData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {userData.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Joined Date</p>
                          <p className="font-medium text-gray-900">
                            {new Date(userData.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Performance Summary - Only for interns */}
                    {userData.role === 'intern' && stats && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Active Enrollments</span>
                              <span className="font-medium text-gray-900">
                                {stats.activeEnrollments} / {stats.totalEnrollments}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary-600 h-2 rounded-full"
                                style={{
                                  width: `${stats.totalEnrollments > 0
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
                                {stats.gradedSubmissions} / {stats.totalSubmissions}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{
                                  width: `${stats.totalSubmissions > 0
                                    ? (stats.gradedSubmissions / stats.totalSubmissions) * 100
                                    : 0}%`
                                }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Average Score</span>
                              <span className="font-medium text-gray-900">{stats.averageScore}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${stats.averageScore || 0}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* For non-interns, show role-specific info */}
                    {userData.role !== 'intern' && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Information</h3>
                        <div className="space-y-3">
                          {userData.role === 'mentor' && (
                            <>
                              <div>
                                <p className="text-sm text-gray-600">Assigned Internships</p>
                                <p className="font-medium text-gray-900">View in Internships section</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Students Mentoring</p>
                                <p className="font-medium text-gray-900">Check enrollment records</p>
                              </div>
                            </>
                          )}
                          {userData.role === 'admin' && (
                            <>
                              <div>
                                <p className="text-sm text-gray-600">Access Level</p>
                                <p className="font-medium text-gray-900">Full System Access</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Permissions</p>
                                <p className="font-medium text-gray-900">All Features Enabled</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
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

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <FiActivity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Activity timeline coming soon</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
