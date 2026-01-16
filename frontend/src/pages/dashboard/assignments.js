import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';
import {
  Card,
  CardContent,
  LoadingSpinner,
  Badge
} from '@/components/ui';
import {
  FiFilter, FiClock, FiCheckCircle, FiAlertCircle, FiFileText,
  FiCalendar, FiAward, FiChevronRight
} from 'react-icons/fi';
import { useApiCall } from '@/hooks/useCommon';

export default function MyAssignments() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState('all');

  const { loading, execute: fetchAssignments } = useApiCall(
    () => apiClient.get('/assignments/my-assignments'),
    {
      onSuccess: (response) => setAssignments(response.data || []),
      errorMessage: 'Failed to load assignments',
      showErrorToast: true
    }
  );

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
      } else {
        fetchAssignments();
      }
    }
  }, [user, authLoading]);

  const getStatusBadge = (assignment) => {
    const { submissionStatus } = assignment;

    if (submissionStatus === 'graded') {
      return { text: 'Graded', variant: 'success', icon: FiCheckCircle };
    } else if (submissionStatus === 'submitted' || submissionStatus === 'pending') {
      return { text: 'Submitted', variant: 'info', icon: FiCheckCircle };
    } else if (new Date(assignment.dueDate) < new Date()) {
      return { text: 'Overdue', variant: 'error', icon: FiAlertCircle };
    } else {
      return { text: 'Pending', variant: 'warning', icon: FiClock };
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days left`;
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    const status = getStatusBadge(assignment).text.toLowerCase();
    return status === filter;
  });

  const filterOptions = [
    { value: 'all', label: 'All', count: assignments.length },
    { value: 'pending', label: 'Pending', count: assignments.filter(a => getStatusBadge(a).text === 'Pending').length },
    { value: 'submitted', label: 'Submitted', count: assignments.filter(a => getStatusBadge(a).text === 'Submitted').length },
    { value: 'graded', label: 'Graded', count: assignments.filter(a => getStatusBadge(a).text === 'Graded').length },
    { value: 'overdue', label: 'Overdue', count: assignments.filter(a => getStatusBadge(a).text === 'Overdue').length },
  ];

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
        <title>My Assignments - Dashboard</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">My Assignments</h1>
                <p className="text-primary-100">Track and submit your assignments</p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{assignments.length}</div>
                  <div className="text-xs text-primary-100">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">
                    {assignments.filter(a => getStatusBadge(a).text === 'Pending').length}
                  </div>
                  <div className="text-xs text-primary-100">Pending</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 flex-wrap">
                <FiFilter className="w-5 h-5 text-gray-400" />
                <div className="flex gap-2 flex-wrap">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilter(option.value)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === option.value
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {option.label}
                      {option.count > 0 && (
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === option.value ? 'bg-white/20' : 'bg-gray-200'
                          }`}>
                          {option.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignments Grid */}
          {filteredAssignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssignments.map((assignment) => {
                const statusBadge = getStatusBadge(assignment);
                const StatusIcon = statusBadge.icon;

                return (
                  <Card
                    key={assignment._id}
                    className="card-hover cursor-pointer group overflow-hidden flex flex-col"
                    onClick={() => router.push(`/dashboard/assignments/${assignment._id}`)}
                  >
                    {/* Header with status */}
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex-between mb-2">
                        <Badge variant={statusBadge.variant}>
                          <StatusIcon className="w-3.5 h-3.5 mr-1" />
                          {statusBadge.text}
                        </Badge>
                        <span className="text-xs text-gray-500 capitalize">{assignment.type}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate-2 min-h-[3rem]">
                        {assignment.title}
                      </h3>
                    </div>

                    {/* Content */}
                    <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                      {/* Internship & Module */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiFileText className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{assignment.internship?.title}</span>
                      </div>

                      {/* Due Date */}
                      <div className="flex-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiCalendar className="w-4 h-4" />
                          <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                        <span className={`text-xs font-medium ${new Date(assignment.dueDate) < new Date()
                            ? 'text-red-600'
                            : 'text-gray-500'
                          }`}>
                          {getDaysUntilDue(assignment.dueDate)}
                        </span>
                      </div>

                      {/* Score */}
                      {assignment.score !== undefined && (
                        <div className="flex items-center gap-2 text-sm">
                          <FiAward className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium text-gray-900">
                            {assignment.score}/{assignment.maxScore} pts
                          </span>
                        </div>
                      )}

                      {/* Action */}
                      <div className="pt-2 border-t border-gray-100 mt-auto">
                        <button className="w-full flex-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                          View Details
                          <FiChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
                <p className="text-gray-500">
                  {filter === 'all'
                    ? 'You have no assignments yet'
                    : `No ${filter} assignments`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
