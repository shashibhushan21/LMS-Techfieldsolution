import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';
import {
  FiFilter, FiClock, FiCheckCircle, FiAlertCircle, FiFileText,
  FiCalendar, FiAward, FiChevronRight
} from 'react-icons/fi';

export default function MyAssignments() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
      } else {
        fetchAssignments();
      }
    }
  }, [user, authLoading]);

  const fetchAssignments = async () => {
    try {
      const response = await apiClient.get('/assignments/my-assignments');
      setAssignments(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      toast.error('Failed to load assignments');
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (assignment) => {
    const { submissionStatus } = assignment;

    // Only show graded if the submission status is explicitly 'graded'
    if (submissionStatus === 'graded') {
      return {
        text: 'Graded',
        className: 'bg-green-100 text-green-800',
        icon: FiCheckCircle
      };
    } else if (submissionStatus === 'submitted' || submissionStatus === 'pending') {
      return {
        text: 'Submitted',
        className: 'bg-blue-100 text-blue-800',
        icon: FiCheckCircle
      };
    } else if (new Date(assignment.dueDate) < new Date()) {
      return {
        text: 'Overdue',
        className: 'bg-red-100 text-red-800',
        icon: FiAlertCircle
      };
    } else {
      return {
        text: 'Pending',
        className: 'bg-yellow-100 text-yellow-800',
        icon: FiClock
      };
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
    { value: 'all', label: 'All', count: assignments.length },
    { value: 'pending', label: 'Pending', count: assignments.filter(a => getStatusBadge(a).text === 'Pending').length },
    { value: 'submitted', label: 'Submitted', count: assignments.filter(a => getStatusBadge(a).text === 'Submitted').length },
    { value: 'graded', label: 'Graded', count: assignments.filter(a => getStatusBadge(a).text === 'Graded').length },
    { value: 'overdue', label: 'Overdue', count: assignments.filter(a => getStatusBadge(a).text === 'Overdue').length },
  ];

  return (
    <>
      <Head>
        <title>My Assignments - Dashboard</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
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
          </div>

          {/* Assignments Grid */}
          {filteredAssignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssignments.map((assignment) => {
                const statusBadge = getStatusBadge(assignment);
                const StatusIcon = statusBadge.icon;

                return (
                  <div
                    key={assignment._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer group overflow-hidden flex flex-col"
                    onClick={() => router.push(`/dashboard/assignments/${assignment._id}`)}
                  >
                    {/* Header with status */}
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusBadge.text}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">{assignment.type}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 min-h-[3rem]">
                        {assignment.title}
                      </h3>
                    </div>

                    {/* Content - flex-1 to take remaining space */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col">
                      {/* Internship & Module */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiFileText className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{assignment.internship?.title}</span>
                      </div>

                      {/* Due Date */}
                      <div className="flex items-center justify-between text-sm">
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

                      {/* Action - mt-auto pushes to bottom */}
                      <div className="pt-2 border-t border-gray-100 mt-auto">
                        <button className="w-full flex items-center justify-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                          View Details
                          <FiChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
              <p className="text-gray-500">
                {filter === 'all'
                  ? 'You have no assignments yet'
                  : `No ${filter} assignments`}
              </p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
