import { useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import apiClient from '@/utils/apiClient';
import { FiCalendar, FiClock, FiAward, FiBookOpen } from 'react-icons/fi';
import {
  SectionHeader,
  Card,
  CardContent,
  Button,
  LoadingSpinner,
  Badge,
  ProgressBar
} from '@/components/ui';
import { useApiCall } from '@/hooks/useCommon';

export default function MyInternships() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const { data: enrollments, loading, execute: fetchEnrollments } = useApiCall(
    () => apiClient.get('/enrollments/my-enrollments'),
    {
      initialData: [],
      errorMessage: 'Failed to fetch enrollments'
    }
  );

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
      } else {
        fetchEnrollments();
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

  return (
    <>
      <Head>
        <title>My Internships - Dashboard</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          <SectionHeader
            title="My Internships"
            subtitle="Track your enrolled internships and progress"
          />

          {enrollments.length > 0 ? (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <Card key={enrollment._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {enrollment.internship?.title}
                          </h3>
                          <Badge variant={
                            enrollment.status === 'completed' ? 'success' :
                              enrollment.status === 'active' ? 'info' : 'warning'
                          }>
                            {enrollment.status}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {enrollment.internship?.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiCalendar className="w-4 h-4 text-primary-500" />
                            <span>Enrolled: {enrollment.createdAt ? new Date(enrollment.createdAt).toLocaleDateString() : 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiClock className="w-4 h-4 text-primary-500" />
                            <span>
                              Duration: {enrollment.internship?.duration
                                ? typeof enrollment.internship.duration === 'object'
                                  ? `${enrollment.internship.duration.weeks || 0} weeks`
                                  : enrollment.internship.duration
                                : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiAward className="w-4 h-4 text-primary-500" />
                            <span>Level: {enrollment.internship?.level || 'N/A'}</span>
                          </div>
                        </div>

                        {enrollment.progressPercentage !== undefined && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700">Overall Progress</span>
                              <span className="font-medium text-primary-600">{enrollment.progressPercentage}%</span>
                            </div>
                            <ProgressBar progress={enrollment.progressPercentage} />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row md:flex-col gap-3 min-w-[140px]">
                        <Button
                          variant="primary"
                          className="w-full justify-center"
                          onClick={() => router.push(`/internships/${enrollment.internship?._id}`)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-center"
                          onClick={() => router.push(`/dashboard/assignments?internship=${enrollment.internship?._id}`)}
                        >
                          Assignments
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FiBookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No internship enrolled yet</h3>
                <p className="mt-1 text-sm text-gray-500 mb-6">Contact your administrator to enroll in an internship.</p>
                <Button onClick={() => router.push('/internships')}>
                  Browse Internships
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
