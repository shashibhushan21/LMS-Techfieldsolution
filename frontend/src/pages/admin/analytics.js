import Head from 'next/head';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import apiClient from '@/utils/apiClient';
import {
  SectionHeader,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  LoadingSpinner,
  Alert,
  ResponsiveTable,
  Badge
} from '@/components/ui';
import { FiUsers, FiBookOpen, FiFileText, FiTrendingUp } from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useApiCall } from '@/hooks/useCommon';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminAnalytics() {
  const { data: rawData, loading, error, execute: load } = useApiCall(
    () => apiClient.get('/analytics/dashboard/admin'),
    {
      errorMessage: 'Failed to load analytics',
      initialData: null
    }
  );

  // Extract the actual data from nested structure
  const data = rawData?.data || rawData;

  useEffect(() => {
    load();
  }, []);

  // Calculate completion rate
  const completionRate = data?.overview?.totalEnrollments > 0
    ? Math.round((data.overview.completedEnrollments / data.overview.totalEnrollments) * 100)
    : 0;

  // Chart data for Popular Internships (Bar Chart)
  const popularInternshipsChartData = {
    labels: data?.popularInternships?.map(i => i.title.substring(0, 20)) || [],
    datasets: [
      {
        label: 'Enrollments',
        data: data?.popularInternships?.map(i => i.enrollmentCount) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart data for Enrollment Status (Doughnut Chart)
  const enrollmentStatusChartData = {
    labels: ['Active', 'Completed', 'Inactive'],
    datasets: [
      {
        data: [
          data?.overview?.activeEnrollments || 0,
          data?.overview?.completedEnrollments || 0,
          (data?.overview?.totalEnrollments || 0) - (data?.overview?.activeEnrollments || 0) - (data?.overview?.completedEnrollments || 0),
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(156, 163, 175, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for User Distribution (Doughnut Chart)
  const userDistributionChartData = {
    labels: ['Interns', 'Mentors', 'Admins'],
    datasets: [
      {
        data: [
          data?.overview?.totalInterns || 0,
          data?.overview?.totalMentors || 0,
          (data?.overview?.totalUsers || 0) - (data?.overview?.totalInterns || 0) - (data?.overview?.totalMentors || 0),
        ],
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(251, 146, 60, 0.8)',
        ],
        borderColor: [
          'rgba(147, 51, 234, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(251, 146, 60, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const recentEnrollmentsColumns = [
    {
      header: 'Student',
      accessor: 'user',
      render: (enrollment) => `${enrollment.user?.firstName} ${enrollment.user?.lastName}`
    },
    {
      header: 'Internship',
      accessor: 'internship',
      render: (enrollment) => enrollment.internship?.title
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (enrollment) => new Date(enrollment.createdAt).toLocaleDateString()
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (enrollment) => (
        <Badge variant={
          enrollment.status === 'active' ? 'success' :
            enrollment.status === 'completed' ? 'info' : 'default'
        }>
          {enrollment.status}
        </Badge>
      )
    }
  ];

  const recentSubmissionsColumns = [
    {
      header: 'Student',
      accessor: 'user',
      render: (submission) => `${submission.user?.firstName} ${submission.user?.lastName}`
    },
    {
      header: 'Assignment',
      accessor: 'assignment',
      render: (submission) => submission.assignment?.title
    },
    {
      header: 'Submitted',
      accessor: 'submittedAt',
      render: (submission) => new Date(submission.submittedAt).toLocaleDateString()
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (submission) => (
        <Badge variant={
          submission.status === 'submitted' ? 'warning' :
            submission.status === 'graded' ? 'success' : 'default'
        }>
          {submission.status}
        </Badge>
      )
    }
  ];

  return (
    <>
      <Head><title>Admin Analytics</title></Head>
      <AdminLayout>
        <div className="flex-between mb-6">
          <SectionHeader title="Analytics" subtitle="Platform performance overview" />
          <Button variant="outline" onClick={load} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        {error && (
          <Alert variant="error" title="Error" message={error} className="mb-4" />
        )}

        {loading && !data ? (
          <div className="flex-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Overview KPIs */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-neutral-600">Total Users</CardTitle>
                    <FiUsers className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardDescription className="text-3xl font-semibold text-neutral-900 mt-2">
                    {data?.overview?.totalUsers ?? '—'}
                  </CardDescription>
                  <p className="text-xs text-neutral-500 mt-1">
                    {data?.overview?.totalInterns ?? 0} interns, {data?.overview?.totalMentors ?? 0} mentors
                  </p>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-neutral-600">Internships</CardTitle>
                    <FiBookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <CardDescription className="text-3xl font-semibold text-neutral-900 mt-2">
                    {data?.overview?.totalInternships ?? '—'}
                  </CardDescription>
                  <p className="text-xs text-neutral-500 mt-1">
                    {data?.overview?.activeEnrollments ?? 0} active enrollments
                  </p>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-neutral-600">Total Enrollments</CardTitle>
                    <FiFileText className="w-5 h-5 text-green-600" />
                  </div>
                  <CardDescription className="text-3xl font-semibold text-neutral-900 mt-2">
                    {data?.overview?.totalEnrollments ?? '—'}
                  </CardDescription>
                  <p className="text-xs text-neutral-500 mt-1">
                    {data?.overview?.completedEnrollments ?? 0} completed
                  </p>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-neutral-600">Completion Rate</CardTitle>
                    <FiTrendingUp className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardDescription className="text-3xl font-semibold text-neutral-900 mt-2">
                    {completionRate}%
                  </CardDescription>
                  <p className="text-xs text-neutral-500 mt-1">
                    {data?.overview?.completedEnrollments ?? 0} / {data?.overview?.totalEnrollments ?? 0}
                  </p>
                </CardHeader>
              </Card>
            </div>

            {/* Assignment Stats */}
            <div className="grid gap-4 sm:grid-cols-3 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-neutral-600">Total Assignments</CardTitle>
                  <CardDescription className="text-2xl font-semibold text-neutral-900 mt-2">
                    {data?.assignments?.totalAssignments ?? '—'}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-neutral-600">Total Submissions</CardTitle>
                  <CardDescription className="text-2xl font-semibold text-neutral-900 mt-2">
                    {data?.assignments?.totalSubmissions ?? '—'}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-neutral-600">Pending Review</CardTitle>
                  <CardDescription className="text-2xl font-semibold text-amber-600 mt-2">
                    {data?.assignments?.pendingSubmissions ?? '—'}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-8">
              {/* Popular Internships Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Internships</CardTitle>
                  <CardDescription>Enrollment distribution across top internships</CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.popularInternships && data.popularInternships.length > 0 ? (
                    <div className="h-64 w-full">
                      <Bar data={popularInternshipsChartData} options={barChartOptions} />
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-500 text-center py-4">No data available</p>
                  )}
                </CardContent>
              </Card>

              {/* Enrollment Status Doughnut Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Enrollment Status</CardTitle>
                  <CardDescription>Distribution of enrollment statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full flex items-center justify-center">
                    <Doughnut data={enrollmentStatusChartData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>

              {/* User Distribution Doughnut Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                  <CardDescription>Platform users by role</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full flex items-center justify-center">
                    <Doughnut data={userDistributionChartData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Last 30 days overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FiUsers className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">New Enrollments</p>
                          <p className="text-xs text-neutral-500">Last 30 days</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">
                        {data?.recent?.enrollmentsLast30Days ?? 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <FiFileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">Active Enrollments</p>
                          <p className="text-xs text-neutral-500">Currently in progress</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-green-600">
                        {data?.overview?.activeEnrollments ?? 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Enrollments */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Enrollments</CardTitle>
                  <CardDescription>Latest 10 enrollments</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {data?.recentEnrollments && data.recentEnrollments.length > 0 ? (
                    <ResponsiveTable
                      columns={recentEnrollmentsColumns}
                      data={data.recentEnrollments}
                    />
                  ) : (
                    <p className="text-sm text-neutral-500 text-center py-4">No recent enrollments</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Submissions */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Submissions</CardTitle>
                  <CardDescription>Latest 10 submissions requiring review</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {data?.recentSubmissions && data.recentSubmissions.length > 0 ? (
                    <ResponsiveTable
                      columns={recentSubmissionsColumns}
                      data={data.recentSubmissions}
                    />
                  ) : (
                    <p className="text-sm text-neutral-500 text-center py-4">No recent submissions</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </AdminLayout>
    </>
  );
}
