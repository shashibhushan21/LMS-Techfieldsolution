import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import apiClient from '@/utils/apiClient';
import { FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function MentorSubmissions() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, graded
  const [loading, setLoading] = useState(true);

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

  const fetchSubmissions = async () => {
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const response = await apiClient.get(`/mentors/submissions${params}`);
      setSubmissions(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FiClock },
      graded: { bg: 'bg-green-100', text: 'text-green-800', icon: FiCheckCircle },
      submitted: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FiAlertCircle },
    };
    const badge = badges[status] || badges.submitted;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
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
        <title>Submissions - Mentor Dashboard</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-4">
          <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
            <h1 className="text-xl font-bold text-gray-900">Student Submissions</h1>
            <p className="text-sm text-gray-600 mt-0.5">Review and grade student assignments</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
            <div className="flex gap-2">
              {['all', 'pending', 'graded'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === f
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {submissions.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Student</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Assignment</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Submitted</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Grade</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((submission) => (
                      <tr key={submission._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {submission.user?.firstName} {submission.user?.lastName}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">{submission.assignment?.title}</td>
                        <td className="px-4 py-2 text-xs text-gray-500">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">{getStatusBadge(submission.status)}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {submission.score !== undefined ? (
                            <span className="font-medium text-gray-900">
                              {submission.score}/{submission.assignment?.maxScore || 100}
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => router.push(`/mentor/submissions/${submission._id}`)}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">No submissions found</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
