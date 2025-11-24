import { useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import apiClient from '@/utils/apiClient';
import { FiBookOpen, FiUsers, FiFileText, FiCheckCircle } from 'react-icons/fi';
import {
  SectionHeader,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  LoadingSpinner,
  ResponsiveTable
} from '@/components/ui';
import { useApiCall } from '@/hooks/useCommon';
import StatsCard from '@/components/dashboard/StatsCard';

export default function MentorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const { data: dashboardData, loading, execute: fetchDashboardData } = useApiCall(
    () => apiClient.get('/mentors/dashboard'),
    {
      initialData: null,
      errorMessage: 'Failed to fetch dashboard data'
    }
  );

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

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex-center h-64">
          <LoadingSpinner size="lg" />
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

  const submissionColumns = [
    {
      header: 'Student',
      accessor: 'user',
      render: (submission) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {submission.user?.name}
          </div>
          <div className="text-sm text-gray-500">{submission.user?.email}</div>
        </div>
      )
    },
    {
      header: 'Assignment',
      accessor: 'assignment',
      render: (submission) => submission.assignment?.title
    },
    {
      header: 'Submitted',
      accessor: 'submittedAt',
      render: (submission) => (
        <span className="text-sm text-gray-500">
          {new Date(submission.submittedAt).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (submission) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push(`/mentor/submissions/${submission._id}`)}
        >
          Grade
        </Button>
      )
    }
  ];

  return (
    <>
      <Head>
        <title>Mentor Dashboard - TechFieldSolution LMS</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-8 text-white shadow-lg">
            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
            <p className="text-primary-100 text-lg">Manage your internships and mentor your students</p>
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
              <SectionHeader title="My Internships" className="mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dashboardData.internships.map((internship) => (
                  <Card key={internship._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{internship.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {internship.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">
                          {internship.enrollmentCount || 0} students enrolled
                        </span>
                        <Button
                          variant="ghost"
                          className="text-primary-600 hover:text-primary-700 p-0"
                          onClick={() => router.push(`/mentor/internships/${internship._id}`)}
                        >
                          View Details →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Pending Submissions */}
          {dashboardData.pendingSubmissions && dashboardData.pendingSubmissions.length > 0 && (
            <div>
              <SectionHeader title="Pending Submissions" className="mb-4" />
              <ResponsiveTable
                columns={submissionColumns}
                data={dashboardData.pendingSubmissions.slice(0, 10)}
              />
            </div>
          )}

          {/* Recent Activity */}
          {dashboardData.recentGraded && dashboardData.recentGraded.length > 0 && (
            <div>
              <SectionHeader title="Recently Graded" className="mb-4" />
              <Card>
                <div className="divide-y divide-gray-200">
                  {dashboardData.recentGraded.slice(0, 5).map((submission) => (
                    <div key={submission._id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-gray-900">
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
              </Card>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
