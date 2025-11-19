import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AssignmentCard from '@/components/dashboard/AssignmentCard';
import apiClient from '@/utils/apiClient';
import { FiFilter } from 'react-icons/fi';

export default function MyAssignments() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, submitted, graded
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
      } else {
        fetchAssignments();
      }
    }
  }, [user, authLoading, filter]);

  const fetchAssignments = async () => {
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const response = await apiClient.get(`/assignments/my-assignments${params}`);
      setAssignments(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      setAssignments([]);
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

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'graded', label: 'Graded' },
  ];

  return (
    <>
      <Head>
        <title>My Assignments - Dashboard</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-4">
          <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
            <h1 className="text-xl font-bold text-gray-900">My Assignments</h1>
            <p className="text-sm text-gray-600 mt-0.5">View and submit your assignments</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <FiFilter className="w-4 h-4 text-gray-500" />
              <div className="flex gap-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      filter === option.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {assignments.length > 0 ? (
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <AssignmentCard key={assignment._id} assignment={assignment} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">
                {filter === 'all' ? 'No assignments found' : `No ${filter} assignments`}
              </p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
