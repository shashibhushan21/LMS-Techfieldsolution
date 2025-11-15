import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/utils/apiClient';
import { FiBook, FiAward, FiClock, FiTrendingUp, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    enrolledInternships: 0,
    completedAssignments: 0,
    pendingAssignments: 0,
    certificatesEarned: 0
  });
  const [enrollments, setEnrollments] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
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
      setLoading(true);
      
      // Fetch enrollments
      const enrollmentsRes = await apiClient.get('/enrollments/my-enrollments');
      const enrollmentsData = enrollmentsRes.data.data || [];
      setEnrollments(enrollmentsData);

      // Fetch submissions
      const submissionsRes = await apiClient.get('/submissions/my-submissions');
      const submissionsData = submissionsRes.data.data || [];
      setRecentSubmissions(submissionsData.slice(0, 5));

      // Calculate stats
      const completedCount = submissionsData.filter(s => s.status === 'graded').length;
      const pendingCount = submissionsData.filter(s => s.status === 'submitted').length;
      
      setStats({
        enrolledInternships: enrollmentsData.length,
        completedAssignments: completedCount,
        pendingAssignments: pendingCount,
        certificatesEarned: 0 // TODO: Fetch certificates
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'intern') {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard - TechFieldSolution LMS</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900">
                  Welcome back, {user.firstName}!
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Here's what's happening with your internships
                </p>
              </div>
              <button
                onClick={() => router.push('/internships')}
                className="btn-primary"
              >
                Browse Internships
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <FiBook className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Enrolled Internships
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stats.enrolledInternships}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FiCheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completed Assignments
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stats.completedAssignments}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <FiClock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Assignments
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stats.pendingAssignments}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FiAward className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Certificates Earned
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stats.certificatesEarned}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Enrollments */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">My Internships</h2>
              <div className="space-y-4">
                {enrollments.length === 0 ? (
                  <div className="card text-center py-12">
                    <FiBook className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No enrollments</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by enrolling in an internship
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => router.push('/internships')}
                        className="btn-primary"
                      >
                        Browse Internships
                      </button>
                    </div>
                  </div>
                ) : (
                  enrollments.map((enrollment) => (
                    <div key={enrollment._id} className="card hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {enrollment.internship?.title || 'Untitled Internship'}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {enrollment.internship?.department || 'No department'}
                          </p>
                          <div className="mt-2 flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              enrollment.status === 'active' ? 'bg-green-100 text-green-800' :
                              enrollment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              enrollment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {enrollment.status}
                            </span>
                            {enrollment.progress !== undefined && (
                              <div className="flex items-center text-sm text-gray-500">
                                <FiTrendingUp className="mr-1" />
                                {enrollment.progress}% Complete
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => router.push(`/internships/${enrollment.internship?._id}`)}
                          className="btn-secondary text-sm"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Submissions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Submissions</h2>
              <div className="space-y-4">
                {recentSubmissions.length === 0 ? (
                  <div className="card text-center py-12">
                    <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Complete assignments to see your submissions here
                    </p>
                  </div>
                ) : (
                  recentSubmissions.map((submission) => (
                    <div key={submission._id} className="card hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-gray-900">
                            {submission.assignment?.title || 'Assignment'}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                          </p>
                          <div className="mt-2 flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              submission.status === 'graded' ? 'bg-green-100 text-green-800' :
                              submission.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {submission.status}
                            </span>
                            {submission.score !== undefined && submission.score > 0 && (
                              <span className="text-sm font-medium text-gray-900">
                                Score: {submission.score}/100
                              </span>
                            )}
                          </div>
                          {submission.feedback && (
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                              {submission.feedback}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
