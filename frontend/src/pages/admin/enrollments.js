import Head from 'next/head';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import apiClient from '@/utils/apiClient';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import StatusBadge from '@/components/admin/StatusBadge';
import EmptyState from '@/components/admin/EmptyState';
import { Card, CardContent } from '@/components/ui/Card';
import { FiCheck, FiX, FiEye, FiFilter } from 'react-icons/fi';

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/enrollments');
      setEnrollments(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch enrollments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleStatusUpdate = async (enrollmentId, newStatus) => {
    setUpdating(enrollmentId);
    try {
      await apiClient.patch(`/enrollments/${enrollmentId}`, { status: newStatus });
      setEnrollments(prev => prev.map(e => 
        e._id === enrollmentId ? { ...e, status: newStatus } : e
      ));
    } catch (err) {
      console.error('Failed to update enrollment status', err);
      alert('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = enrollments.filter(e => {
    const matchesStatus = !statusFilter || e.status === statusFilter;
    const matchesSearch = !searchTerm || 
      e.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.internship?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: enrollments.length,
    pending: enrollments.filter(e => e.status === 'pending').length,
    approved: enrollments.filter(e => e.status === 'approved').length,
    rejected: enrollments.filter(e => e.status === 'rejected').length,
    active: enrollments.filter(e => e.status === 'active').length,
    completed: enrollments.filter(e => e.status === 'completed').length
  };

  return (
    <>
      <Head><title>Admin Enrollments</title></Head>
      <AdminLayout>
        <SectionHeader title="Enrollments" subtitle="Manage student enrollments and applications" />

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
          {[
            { label: 'Total', value: stats.total, color: 'bg-neutral-50 text-neutral-700 border-neutral-200' },
            { label: 'Pending', value: stats.pending, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
            { label: 'Approved', value: stats.approved, color: 'bg-green-50 text-green-700 border-green-200' },
            { label: 'Active', value: stats.active, color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { label: 'Completed', value: stats.completed, color: 'bg-purple-50 text-purple-700 border-purple-200' },
            { label: 'Rejected', value: stats.rejected, color: 'bg-red-50 text-red-700 border-red-200' }
          ].map(stat => (
            <Card key={stat.label} className={`border ${stat.color}`}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs font-medium mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name, email, or internship..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="input w-full"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="input w-40"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
                <Button variant="outline" onClick={() => { setStatusFilter(''); setSearchTerm(''); }}>
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enrollments List */}
        {loading ? (
          <div className="flex items-center justify-center py-12 mt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="mt-6">
            <CardContent className="py-12">
              <EmptyState 
                title={searchTerm || statusFilter ? "No matching enrollments" : "No enrollments yet"} 
                message={searchTerm || statusFilter ? "Try adjusting your filters." : "Enrollments will appear here when students apply."}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="mt-6 overflow-auto">
            <div className="bg-white border border-neutral-200 rounded-xl shadow-soft">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 text-neutral-700 border-b border-neutral-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Student</th>
                    <th className="px-4 py-3 text-left font-semibold">Internship</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Applied</th>
                    <th className="px-4 py-3 text-left font-semibold">Progress</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filtered.map(enrollment => (
                    <tr key={enrollment._id} className="hover:bg-neutral-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar 
                            src={enrollment.user?.avatar} 
                            name={`${enrollment.user?.firstName} ${enrollment.user?.lastName}`} 
                            size="sm" 
                          />
                          <div>
                            <div className="font-medium text-neutral-900">
                              {enrollment.user?.firstName} {enrollment.user?.lastName}
                            </div>
                            <div className="text-xs text-neutral-500">{enrollment.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-neutral-800">{enrollment.internship?.title || '—'}</div>
                        <div className="text-xs text-neutral-500">{enrollment.internship?.category || '—'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={enrollment.status} />
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {new Date(enrollment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-neutral-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-primary-600 h-full rounded-full transition-all"
                              style={{ width: `${enrollment.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-neutral-600 w-10 text-right">
                            {enrollment.progress || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          {enrollment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(enrollment._id, 'approved')}
                                disabled={updating === enrollment._id}
                                className="p-2 rounded-lg hover:bg-green-50 text-green-600 hover:text-green-700 transition disabled:opacity-50"
                                title="Approve"
                              >
                                <FiCheck className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(enrollment._id, 'rejected')}
                                disabled={updating === enrollment._id}
                                className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition disabled:opacity-50"
                                title="Reject"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {enrollment.status === 'approved' && (
                            <button
                              onClick={() => handleStatusUpdate(enrollment._id, 'active')}
                              disabled={updating === enrollment._id}
                              className="px-3 py-1 text-xs rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition disabled:opacity-50"
                            >
                              Start
                            </button>
                          )}
                          {enrollment.status === 'active' && (
                            <button
                              onClick={() => handleStatusUpdate(enrollment._id, 'completed')}
                              disabled={updating === enrollment._id}
                              className="px-3 py-1 text-xs rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition disabled:opacity-50"
                            >
                              Complete
                            </button>
                          )}
                          <button
                            className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-neutral-700 transition"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
