import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import apiClient from '@/utils/apiClient';
import { FiUsers, FiBookOpen, FiFileText, FiTrendingUp, FiUserCheck } from 'react-icons/fi';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push('/dashboard');
      } else {
        fetchDashboardData();
      }
    }
  }, [user, authLoading]);

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get('/analytics/admin-dashboard');
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
  const recentStats = dashboardData.recentStats || {};

  return (
    <>
      <Head>
        <title>Admin Dashboard - TechFieldSolution LMS</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-primary-100">Manage your LMS platform and monitor performance</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatsCard
              title="Total Users"
              value={stats.totalUsers || 0}
              icon={FiUsers}
              color="primary"
              description={`+${recentStats.newUsers || 0} this month`}
            />
            <StatsCard
              title="Total Interns"
              value={stats.totalInterns || 0}
              icon={FiUserCheck}
              color="success"
            />
            <StatsCard
              title="Total Mentors"
              value={stats.totalMentors || 0}
              icon={FiUsers}
              color="info"
            />
            <StatsCard
              title="Internships"
              value={stats.totalInternships || 0}
              icon={FiBookOpen}
              color="warning"
              description={`${stats.activeInternships || 0} active`}
            />
            <StatsCard
              title="Enrollments"
              value={stats.totalEnrollments || 0}
              icon={FiFileText}
              color="primary"
              description={`${recentStats.newEnrollments || 0} new`}
            />
          </div>

          {/* Popular Internships */}
          {dashboardData.popularInternships && dashboardData.popularInternships.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Internships</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Internship
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrollments
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.popularInternships.slice(0, 5).map((internship) => (
                      <tr key={internship._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{internship.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{internship.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{internship.enrollmentCount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              internship.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {internship.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Enrollments</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {dashboardData.recentEnrollments && dashboardData.recentEnrollments.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {dashboardData.recentEnrollments.slice(0, 5).map((enrollment) => (
                      <div key={enrollment._id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {enrollment.user?.name}
                            </p>
                            <p className="text-sm text-gray-500">{enrollment.internship?.title}</p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              enrollment.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : enrollment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {enrollment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="p-4 text-gray-500 text-center">No recent enrollments</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Submissions</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {dashboardData.recentSubmissions && dashboardData.recentSubmissions.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {dashboardData.recentSubmissions.slice(0, 5).map((submission) => (
                      <div key={submission._id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {submission.user?.name}
                            </p>
                            <p className="text-sm text-gray-500">{submission.assignment?.title}</p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              submission.status === 'graded'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {submission.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="p-4 text-gray-500 text-center">No recent submissions</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
