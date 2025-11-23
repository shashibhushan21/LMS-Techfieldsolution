import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import apiClient from '@/utils/apiClient';
import { FiBookOpen, FiUsers, FiFileText, FiCheckCircle } from 'react-icons/fi';

export default function MentorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
      } else if (user.role !== 'mentor') {
        router.push('/dashboard');
      } else {
        fetchDashboardData();
      }
    }
  }, [user, authLoading]);

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get('/mentors/dashboard');
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
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

  if (!dashboardData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load dashboard data</p>
        </div>
      </DashboardLayout>
    );
  }

  const stats = dashboardData.stats || {};

  return (
    <>
      <Head>
        <title>Mentor Dashboard - TechFieldSolution LMS</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
            <p className="text-primary-100">Manage your internships and mentor your students</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="My Internships"
              value={stats.totalInternships || 0}
              icon={FiBookOpen}
              color="primary"
            />
            <StatsCard
              title="Total Students"
              value={stats.totalStudents || 0}
              icon={FiUsers}
              color="success"
            />
            <StatsCard
              title="Pending Submissions"
              value={stats.pendingSubmissions || 0}
              icon={FiFileText}
              color="warning"
            />
            <StatsCard
              title="Graded This Week"
              value={stats.gradedThisWeek || 0}
              icon={FiCheckCircle}
              color="info"
            />
          </div>

          {/* My Internships */}
          {dashboardData.internships && dashboardData.internships.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">My Internships</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dashboardData.internships.map((internship) => (
                  <div
                    key={internship._id}
                    className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{internship.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {internship.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {internship.enrollmentCount || 0} students enrolled
                      </span>
                      <button
                        onClick={() => router.push(`/mentor/internships/${internship._id}`)}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Submissions */}
          {dashboardData.pendingSubmissions && dashboardData.pendingSubmissions.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Submissions</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.pendingSubmissions.slice(0, 10).map((submission) => (
                      <tr key={submission._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {submission.user?.name}
                          </div>
                          <div className="text-sm text-gray-500">{submission.user?.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{submission.assignment?.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(submission.submittedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => router.push(`/mentor/submissions/${submission._id}`)}
                            className="text-primary-600 hover:text-primary-900 font-medium"
                          >
                            Grade
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          {dashboardData.recentGraded && dashboardData.recentGraded.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recently Graded</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="divide-y divide-gray-200">
                  {dashboardData.recentGraded.slice(0, 5).map((submission) => (
                    <div key={submission._id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {submission.user?.name}
                          </p>
                          <p className="text-sm text-gray-500">{submission.assignment?.title}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {submission.score}/{submission.assignment?.maxScore}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(submission.gradedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
