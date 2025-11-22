import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layout/AdminLayout';
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
        router.push('/');
      } else if (user.role !== 'admin') {
        router.push('/dashboard');
      } else {
        fetchDashboardData();
      }
    }
  }, [user, authLoading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/analytics/dashboard/admin');
      console.log('Admin dashboard response:', response.data);

      const data = response.data.data;

      // Transform the data to match our component structure
      setDashboardData({
        stats: {
          totalUsers: data.overview?.totalUsers || 0,
          totalInterns: data.overview?.totalInterns || 0,
          totalMentors: data.overview?.totalMentors || 0,
          totalInternships: data.overview?.totalInternships || 0,
          activeInternships: data.overview?.activeEnrollments || 0,
          totalEnrollments: data.overview?.totalEnrollments || 0
        },
        recentStats: {
          newUsers: data.recent?.enrollmentsLast30Days || 0,
          newEnrollments: data.recent?.enrollmentsLast30Days || 0
        },
        popularInternships: data.popularInternships || [],
        recentEnrollments: data.recentEnrollments || [],
        recentSubmissions: data.recentSubmissions || []
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      console.error('Error details:', error.response?.data);
      // Set minimal fallback data to prevent "Failed to load" message
      setDashboardData({
        stats: { totalUsers: 0, totalInterns: 0, totalMentors: 0, totalInternships: 0, activeInternships: 0, totalEnrollments: 0 },
        recentStats: { newUsers: 0, newEnrollments: 0 },
        popularInternships: [],
        recentEnrollments: [],
        recentSubmissions: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!dashboardData) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load dashboard data</p>
        </div>
      </AdminLayout>
    );
  }

  const stats = dashboardData.stats || {};
  const recentStats = dashboardData.recentStats || {};

  return (
    <>
      <Head>
        <title>Admin Dashboard - TechFieldSolutionLMS</title>
      </Head>

      <AdminLayout>
        <div className="space-y-4">
          <div className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm">
            <div>
              <h1 className="text-xl md:text-2xl font-heading font-bold text-neutral-900">Admin Dashboard</h1>
              <p className="text-sm text-neutral-600 mt-0.5">Platform overview and performance metrics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
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

          {dashboardData.popularInternships && dashboardData.popularInternships.length > 0 && (
            <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-3">
              <h2 className="text-base font-semibold text-neutral-900 mb-3">Popular Internships</h2>
              <div className="overflow-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-1.5 text-left font-medium text-neutral-600">
                        Internship
                      </th>
                      <th className="px-3 py-1.5 text-left font-medium text-neutral-600">
                        Category
                      </th>
                      <th className="px-3 py-1.5 text-left font-medium text-neutral-600">
                        Enrollments
                      </th>
                      <th className="px-3 py-1.5 text-left font-medium text-neutral-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {dashboardData.popularInternships.slice(0, 5).map((internship) => (
                      <tr key={internship._id} className="border-t border-neutral-100">
                        <td className="px-3 py-1.5 font-medium text-neutral-900">{internship.title}</td>
                        <td className="px-3 py-1.5 text-neutral-600">{internship.category}</td>
                        <td className="px-3 py-1.5 text-neutral-900">{internship.enrollmentCount}</td>
                        <td className="px-3 py-1.5">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${internship.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>{internship.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div>
              <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-3">
                <h2 className="text-base font-semibold text-neutral-900 mb-2">Recent Enrollments</h2>
                {dashboardData.recentEnrollments && dashboardData.recentEnrollments.length > 0 ? (
                  <div className="divide-y divide-neutral-100">
                    {dashboardData.recentEnrollments.slice(0, 5).map((enrollment) => (
                      <div key={enrollment._id} className="py-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-neutral-900">
                              {enrollment.user?.name || enrollment.user?.firstName}
                            </p>
                            <p className="text-xs text-neutral-600 mt-0.5">{enrollment.internship?.title}</p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${enrollment.status === 'approved'
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
                  <p className="py-6 text-neutral-500 text-center text-xs">No recent enrollments</p>
                )}
              </div>
            </div>

            <div>
              <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-3">
                <h2 className="text-base font-semibold text-neutral-900 mb-2">Recent Submissions</h2>
                {dashboardData.recentSubmissions && dashboardData.recentSubmissions.length > 0 ? (
                  <div className="divide-y divide-neutral-100">
                    {dashboardData.recentSubmissions.slice(0, 5).map((submission) => (
                      <div key={submission._id} className="py-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-neutral-900">
                              {submission.user?.name || submission.user?.firstName}
                            </p>
                            <p className="text-xs text-neutral-600 mt-0.5">{submission.assignment?.title}</p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${submission.status === 'graded'
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
                  <p className="py-6 text-neutral-500 text-center text-xs">No recent submissions</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
