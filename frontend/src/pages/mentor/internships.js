import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import apiClient from '@/utils/apiClient';
import { FiUsers, FiFileText, FiCalendar } from 'react-icons/fi';
import { useApiCall } from '@/hooks/useCommon';
import { LoadingSpinner } from '@/components/ui';

export default function MentorInternships() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const {
    data: internships,
    loading,
    execute: fetchInternships
  } = useApiCall(
    () => apiClient.get('/mentors/my-internships').then(res => ({ data: res.data.data || [] })),
    {
      initialData: [],
      errorMessage: 'Failed to load internships'
    }
  );

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
      } else if (user.role !== 'mentor') {
        router.push('/dashboard');
      } else {
        fetchInternships();
      }
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>My Internships - Mentor Dashboard</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-4">
          <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
            <h1 className="text-xl font-bold text-gray-900">My Internships</h1>
            <p className="text-sm text-gray-600 mt-0.5">Manage internships you're mentoring</p>
          </div>

          {internships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {internships.map((internship) => (
                <div key={internship._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{internship.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{internship.description}</p>

                  <div className="space-y-1.5 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <FiUsers className="w-3.5 h-3.5" />
                      <span>{internship.enrollmentCount || 0} Students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiFileText className="w-3.5 h-3.5" />
                      <span>{internship.moduleCount || 0} Modules</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-3.5 h-3.5" />
                      <span>
                        {internship.duration
                          ? typeof internship.duration === 'object'
                            ? `${internship.duration.weeks || 0} weeks`
                            : internship.duration
                          : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/mentor/internships/${internship._id}`)}
                    className="mt-3 w-full btn btn-sm btn-primary"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">No internships assigned yet</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
