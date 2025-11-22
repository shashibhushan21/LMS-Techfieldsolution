import Head from 'next/head';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import apiClient from '@/utils/apiClient';
import RoleBadge from '@/components/admin/RoleBadge';
import EmptyState from '@/components/admin/EmptyState';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import SectionHeader from '@/components/ui/SectionHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { FiSearch, FiUserPlus, FiEdit2, FiTrash2, FiX, FiMoreVertical } from 'react-icons/fi';
import UserForm from '@/components/admin/UserForm';
import { toast } from 'react-toastify';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const load = async () => {
    try {
      const res = await apiClient.get('/users');
      setUsers(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await apiClient.delete(`/users/${id}`);
      toast.success('User deleted successfully');
      load();
    } catch (err) {
      console.error('Failed to delete user', err);
      toast.error('Failed to delete user');
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingUser) {
        await apiClient.put(`/users/${editingUser._id}`, formData);
        toast.success('User updated successfully');
      } else {
        await apiClient.post('/users', formData);
        toast.success('User created successfully');
      }
      setShowModal(false);
      load();
    } catch (err) {
      console.error('Failed to save user', err);
      toast.error(err.response?.data?.message || 'Failed to save user');
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = users.filter(u => {
    const matchesRole = !filter || u.role === filter;
    const matchesSearch = !searchTerm ||
      u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    mentors: users.filter(u => u.role === 'mentor').length,
    interns: users.filter(u => u.role === 'intern').length
  };

  return (
    <>
      <Head><title>Admin Users</title></Head>
      <AdminLayout>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <SectionHeader title="Users" subtitle="Manage platform users" />
          <Button onClick={handleCreate}>
            <FiUserPlus className="w-4 h-4 mr-2" /> Add User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Total Users', value: stats.total, color: 'bg-white border-neutral-200 text-neutral-700' },
            { label: 'Admins', value: stats.admins, color: 'bg-red-50 border-red-100 text-red-700' },
            { label: 'Mentors', value: stats.mentors, color: 'bg-blue-50 border-blue-100 text-blue-700' },
            { label: 'Interns', value: stats.interns, color: 'bg-green-50 border-green-100 text-green-700' }
          ].map(stat => (
            <Card key={stat.label} className={`border shadow-sm ${stat.color}`}>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-xs font-medium mt-1 uppercase tracking-wider opacity-80">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mt-6 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="input w-full pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select value={filter} onChange={e => setFilter(e.target.value)} className="input w-40">
                  <option value="">All Roles</option>
                  <option value="admin">Admins</option>
                  <option value="mentor">Mentors</option>
                  <option value="intern">Interns</option>
                </select>
                {(filter || searchTerm) && (
                  <Button variant="outline" onClick={() => { setFilter(''); setSearchTerm(''); }}>Reset</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-12 mt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="mt-6">
            <CardContent className="py-12">
              <EmptyState
                title={searchTerm || filter ? "No matching users" : "No users"}
                message={searchTerm || filter ? "Try adjusting your filters." : "Users will appear here."}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="mt-6 overflow-hidden bg-white border border-neutral-200 rounded-xl shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 text-neutral-700 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">User</th>
                    <th className="px-6 py-3 text-left font-semibold">Role</th>
                    <th className="px-6 py-3 text-left font-semibold">Joined</th>
                    <th className="px-6 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filtered.map(u => (
                    <tr key={u._id} className="hover:bg-neutral-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={u.avatar} name={`${u.firstName} ${u.lastName}`} size="sm" />
                          <div>
                            <div className="font-medium text-neutral-900">{u.firstName} {u.lastName}</div>
                            <div className="text-neutral-500 text-xs">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><RoleBadge role={u.role} /></td>
                      <td className="px-6 py-4 text-neutral-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(u)}
                            className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(u._id)}
                            className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <FiTrash2 className="w-4 h-4" />
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

        {/* Add/Edit User Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl border border-neutral-200 animate-scale-up max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 sticky top-0 bg-white z-10">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700"
                  aria-label="Close"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <UserForm
                  initialData={editingUser}
                  onSubmit={handleFormSubmit}
                  loading={formLoading}
                />
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
