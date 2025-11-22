import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import ProgressCard from '@/components/dashboard/ProgressCard';
import AssignmentCard from '@/components/dashboard/AssignmentCard';
import apiClient from '@/utils/apiClient';
import { FiBookOpen, FiFileText, FiAward, FiTrendingUp, FiCalendar, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function InternDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
      } else if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (user.role === 'mentor') {
        router.push('/mentor/dashboard');
      } else {
        fetchDashboardData();
      }
    }
  }, [user, authLoading]);

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get('/analytics/dashboard/intern');
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
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

  const userName = user?.firstName || user?.name || 'Learner';

  return (
    <>
      <Head>
        <title>Dashboard - TechFieldSolution LMS</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6 animate-fade-in">
          {/* Welcome Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl p-8 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Welcome back, {userName}! 👋</h1>
              <p className="text-primary-100 text-lg">Track your progress and continue your learning journey</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatsCard
              title="Active Internships"
              value={dashboardData.overview?.activeEnrollments || 0}
              icon={FiBookOpen}
              color="primary"
            />
            <StatsCard
              title="Total Submissions"
              value={dashboardData.overview?.totalSubmissions || 0}
              icon={FiFileText}
              color="warning"
            />
            <StatsCard
              title="Completed"
              value={dashboardData.overview?.completedEnrollments || 0}
              icon={FiAward}
              color="success"
            />
            <StatsCard
              title="Average Score"
              value={dashboardData.overview?.averageScore ? `${dashboardData.overview.averageScore}%` : 'N/A'}
              icon={FiTrendingUp}
              color="info"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progress Section - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">My Progress</h2>
                {dashboardData.progress && dashboardData.progress.length > 0 && (
                  <span className="text-sm text-gray-500">{dashboardData.progress.length} Active</span>
                )}
              </div>

              {dashboardData.progress && dashboardData.progress.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.progress.map((item) => (
                    <ProgressCard
                      key={item.internship._id}
                      title={item.internship.title}
                      current={item.completedAssignments}
                      total={item.totalAssignments}
                      percentage={Math.round((item.completedAssignments / item.totalAssignments) * 100) || 0}
                      color="primary"
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiBookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-700 font-medium mb-2">No internship enrolled yet</p>
                  <p className="text-gray-500 text-sm">Contact your administrator to get enrolled.</p>
                </div>
              )}

              {/* Recent Assignments */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Recent Assignments</h2>
                  {dashboardData.recentAssignments && dashboardData.recentAssignments.length > 0 && (
                    <button
                      onClick={() => router.push('/dashboard/assignments')}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View all
                    </button>
                  )}
                </div>

                {dashboardData.recentAssignments && dashboardData.recentAssignments.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.recentAssignments.slice(0, 3).map((assignment) => (
                      <AssignmentCard key={assignment._id} assignment={assignment} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 text-center">
                    <FiFileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-500">No assignments yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Certificates & Quick Actions */}
            <div className="space-y-6">
              {/* Recent Certificates */}
              {dashboardData.recentCertificates && dashboardData.recentCertificates.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Certificates</h2>
                  <div className="space-y-3">
                    {dashboardData.recentCertificates.map((certificate) => (
                      <div
                        key={certificate._id}
                        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => window.open(certificate.pdfUrl, '_blank')}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FiAward className="w-5 h-5 text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm truncate">
                              {certificate.internship?.title}
                            </h3>
                            <p className="text-xs text-gray-600 mt-1">
                              {new Date(certificate.issueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Enrollments</span>
                    <span className="font-semibold text-gray-900">{dashboardData.overview?.totalEnrollments || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Graded Work</span>
                    <span className="font-semibold text-gray-900">{dashboardData.overview?.gradedSubmissions || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="font-semibold text-primary-600">
                      {dashboardData.overview?.totalEnrollments > 0
                        ? Math.round((dashboardData.overview.completedEnrollments / dashboardData.overview.totalEnrollments) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
