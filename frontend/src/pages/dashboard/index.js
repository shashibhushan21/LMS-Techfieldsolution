import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import ProgressCard from '@/components/dashboard/ProgressCard';
import AssignmentCard from '@/components/dashboard/AssignmentCard';
import apiClient from '@/utils/apiClient';
import { FiBookOpen, FiFileText, FiAward, FiTrendingUp } from 'react-icons/fi';

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
      const response = await apiClient.get('/analytics/intern-dashboard');
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

  return (
    <>
      <Head>
        <title>Dashboard - TechFieldSolution LMS</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-primary-100">Track your progress and continue your learning journey</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Active Internships"
              value={dashboardData.stats?.activeEnrollments || 0}
              icon={FiBookOpen}
              color="primary"
            />
            <StatsCard
              title="Pending Assignments"
              value={dashboardData.stats?.pendingAssignments || 0}
              icon={FiFileText}
              color="warning"
            />
            <StatsCard
              title="Certificates Earned"
              value={dashboardData.stats?.certificatesEarned || 0}
              icon={FiAward}
              color="success"
            />
            <StatsCard
              title="Average Score"
              value={dashboardData.stats?.averageScore ? `${dashboardData.stats.averageScore}%` : 'N/A'}
              icon={FiTrendingUp}
              color="info"
            />
          </div>

          {/* Progress Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">My Progress</h2>
              {dashboardData.progress && dashboardData.progress.length > 0 ? (
                dashboardData.progress.map((item) => (
                  <ProgressCard
                    key={item.internship._id}
                    title={item.internship.title}
                    current={item.completedAssignments}
                    total={item.totalAssignments}
                    percentage={Math.round((item.completedAssignments / item.totalAssignments) * 100) || 0}
                    color="primary"
                  />
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 text-center">
                  <p className="text-gray-500">No active internships yet</p>
                  <button
                    onClick={() => router.push('/internships')}
                    className="btn btn-primary mt-4"
                  >
                    Browse Internships
                  </button>
                </div>
              )}
            </div>

            {/* Recent Assignments */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Assignments</h2>
              {dashboardData.recentAssignments && dashboardData.recentAssignments.length > 0 ? (
                dashboardData.recentAssignments.slice(0, 3).map((assignment) => (
                  <AssignmentCard key={assignment._id} assignment={assignment} />
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 text-center">
                  <p className="text-gray-500">No assignments yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Certificates */}
          {dashboardData.recentCertificates && dashboardData.recentCertificates.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Certificates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData.recentCertificates.map((certificate) => (
                  <div
                    key={certificate._id}
                    className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                  >
                    <FiAward className="w-12 h-12 text-primary-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {certificate.internship?.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Certificate ID: {certificate.certificateId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Issued: {new Date(certificate.issueDate).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => window.open(certificate.pdfUrl, '_blank')}
                      className="btn btn-outline w-full mt-4"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
