import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import apiClient from '@/utils/apiClient';
import { FiClock, FiCheckCircle, FiAlertCircle, FiFileText } from 'react-icons/fi';
import {
  SectionHeader,
  ResponsiveTable,
  Badge,
  Button,
  LoadingSpinner,
  Card,
  CardContent
} from '@/components/ui';
import { useApiCall } from '@/hooks/useCommon';

export default function MentorSubmissions() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState('all'); // all, pending, graded

  const { data: submissions, loading, execute: fetchSubmissions } = useApiCall(
    () => {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      return apiClient.get(`/mentors/submissions${params}`).then(res => ({ data: res.data.data || [] }));
    },
    {
      initialData: [],
      errorMessage: 'Failed to fetch submissions',
      dependencies: [filter]
    }
  );

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
      } else if (user.role !== 'mentor') {
        router.push('/dashboard');
      } else {
        fetchSubmissions();
      }
    }
  }, [user, authLoading, filter]);

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const columns = [
    {
      header: 'Student',
      accessor: 'user',
      render: (submission) => (
        <span className="font-medium text-gray-900">
          {submission.user?.firstName} {submission.user?.lastName}
        </span>
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
        <span className="text-xs text-gray-500">
          {new Date(submission.submittedAt).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (submission) => {
        const variants = {
          pending: 'warning',
          graded: 'success',
          submitted: 'info'
        };
        return (
          <Badge variant={variants[submission.status] || 'default'}>
            {submission.status}
          </Badge>
        );
      }
    },
    {
      header: 'Grade',
      accessor: 'score',
      render: (submission) => (
        submission.score !== undefined ? (
          <span className="font-medium text-gray-900">
            {submission.score}/{submission.assignment?.maxScore || 100}
          </span>
        ) : (
          <span className="text-gray-500">-</span>
        )
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (submission) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push(`/mentor/submissions/${submission._id}`)}
        >
          Review
        </Button>
      )
    }
  ];

  return (
    <>
      <Head>
        <title>Submissions - Mentor Dashboard</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          <SectionHeader
            title="Student Submissions"
            subtitle="Review and grade student assignments"
          />

          <Card>
            <CardContent className="p-2">
              <div className="flex gap-2">
                {['all', 'pending', 'graded'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === f
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {submissions.length > 0 ? (
            <ResponsiveTable
              columns={columns}
              data={submissions}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No submissions found</h3>
                <p className="text-gray-500 mt-1">
                  {filter === 'all'
                    ? 'Students haven\'t submitted any assignments yet.'
                    : `No ${filter} submissions found.`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
