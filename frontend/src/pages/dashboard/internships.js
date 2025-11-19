import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProgressCard from '@/components/dashboard/ProgressCard';
import apiClient from '@/utils/apiClient';
import { FiCalendar, FiClock, FiAward } from 'react-icons/fi';

export default function MyInternships() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
      } else {
        fetchEnrollments();
      }
    }
  }, [user, authLoading]);

  const fetchEnrollments = async () => {
    try {
      const response = await apiClient.get('/enrollments/my-enrollments');
      setEnrollments(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
      setEnrollments([]);
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

  return (
    <>
      <Head>
        <title>My Internships - Dashboard</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-4">
          <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
            <h1 className="text-xl font-bold text-gray-900">My Internships</h1>
            <p className="text-sm text-gray-600 mt-0.5">Track your enrolled internships and progress</p>
          </div>

          {enrollments.length > 0 ? (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <div key={enrollment._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">
                        {enrollment.internship?.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {enrollment.internship?.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <FiCalendar className="w-3.5 h-3.5" />
                          <span>Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <FiClock className="w-3.5 h-3.5" />
                          <span>
                            Duration: {enrollment.internship?.duration
                              ? typeof enrollment.internship.duration === 'object'
                                ? `${enrollment.internship.duration.weeks || 0} weeks`
                                : enrollment.internship.duration
                              : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <FiAward className="w-3.5 h-3.5" />
                          <span>Level: {enrollment.internship?.level || 'N/A'}</span>
                        </div>
                        <div>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            enrollment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : enrollment.status === 'active'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {enrollment.status}
                          </span>
                        </div>
                      </div>

                      {enrollment.progress !== undefined && (
                        <ProgressCard
                          title="Overall Progress"
                          current={enrollment.progress}
                          total={100}
                          percentage={enrollment.progress}
                          color="primary"
                        />
                      )}
                    </div>

                    <div className="flex md:flex-col gap-2">
                      <button
                        onClick={() => router.push(`/internships/${enrollment.internship?._id}`)}
                        className="btn btn-sm btn-primary"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => router.push(`/dashboard/assignments?internship=${enrollment.internship?._id}`)}
                        className="btn btn-sm btn-secondary"
                      >
                        Assignments
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">You haven't enrolled in any internships yet</p>
              <button
                onClick={() => router.push('/internships')}
                className="btn btn-primary"
              >
                Browse Internships
              </button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
