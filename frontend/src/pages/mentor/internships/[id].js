import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import InternshipCurriculumManager from '@/components/admin/InternshipCurriculumManager';
import apiClient from '@/utils/apiClient';
import { FiBook, FiFileText, FiUsers } from 'react-icons/fi';
import { useApiCall } from '@/hooks/useCommon';
import { LoadingSpinner } from '@/components/ui';

export default function MentorInternshipDetails() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  const [internship, setInternship] = useState(null);

  const {
    data: internshipData,
    loading,
    execute: fetchInternship
  } = useApiCall(
    () => apiClient.get(`/mentors/internships/${id}`).then(res => ({ data: res.data.data.internship })),
    {
      initialData: null,
      errorMessage: 'Failed to load internship',
      onError: (error) => {
        if (error.response?.status === 403) {
          router.push('/mentor/internships');
        }
      },
      onSuccess: (data) => {
        setInternship(data);
      }
    }
  );

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
      } else if (user.role !== 'mentor') {
        router.push('/dashboard');
      } else if (id) {
        fetchInternship();
      }
    }
  }, [user, authLoading, id]);

  const handleDataUpdate = (updatedData) => {
    if (updatedData && updatedData.internship) {
      setInternship(updatedData.internship);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!internship) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Internship not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>{internship.title} - Mentor Dashboard</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{internship.title}</h1>
                <p className="text-gray-600 mt-1">{internship.description}</p>
                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <FiBook className="w-4 h-4" />
                    {internship.domain}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FiFileText className="w-4 h-4" />
                    {internship.level}
                  </span>
                </div>
              </div>
              <button
                onClick={() => router.push('/mentor/internships')}
                className="btn btn-sm btn-secondary"
              >
                ← Back to Internships
              </button>
            </div>
          </div>

          {/* Curriculum Manager */}
          <InternshipCurriculumManager
            internshipId={id}
            role="mentor"
            canEdit={true}
            onDataUpdate={handleDataUpdate}
          />
        </div>
      </DashboardLayout>
    </>
  );
}
