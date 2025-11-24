import Head from 'next/head';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import apiClient from '@/utils/apiClient';
import RoleBadge from '@/components/admin/RoleBadge';
import EmptyState from '@/components/admin/EmptyState';
import {
  Button,
  Avatar,
  SectionHeader,
  Card,
  CardContent,
  LoadingSpinner,
  FormInput,
  FormSelect,
  Modal,
  ResponsiveTable
} from '@/components/ui';
import { FiSearch, FiUserPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import UserForm from '@/components/admin/UserForm';
import { toast } from 'react-toastify';
import { useApiCall } from '@/hooks/useCommon';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Use custom hook for API calls
  const { data, loading, execute: loadUsers } = useApiCall(
    () => apiClient.get('/users?limit=1000'),
    {
      onSuccess: (data) => {
        // Backend returns { data: { data: [...] } }, useApiCall extracts first .data
        // So we receive { data: [...] } and need to extract .data again
        const usersArray = Array.isArray(data) ? data : (data?.data || []);
        setUsers(usersArray);
      },
      errorMessage: 'Failed to load users',
      showErrorToast: true
    }
  );

  useEffect(() => { loadUsers(); }, []);

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
      loadUsers();
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
      loadUsers();
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

  // Table columns configuration
  const columns = [
    {
      header: 'User',
      accessor: 'name',
      render: (user) => (
        <div className="flex items-center gap-3">
          <Avatar src={user.avatar} name={`${user.firstName} ${user.lastName}`} size="sm" />
          <div>
            <div className="font-medium text-neutral-900">{user.firstName} {user.lastName}</div>
            <div className="text-neutral-500 text-xs">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (user) => <RoleBadge role={user.role} />
    },
    {
      header: 'Joined',
      accessor: 'createdAt',
      render: (user) => (
        <span className="text-neutral-600">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (user) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleEdit(user)}
            className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Edit User"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(user._id)}
            className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete User"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'admin', label: 'Admins' },
    { value: 'mentor', label: 'Mentors' },
    { value: 'intern', label: 'Interns' }
  ];

  return (
    <>
      <Head><title>Admin Users</title></Head>
      <AdminLayout>
        {/* Header */}
        <div className="flex-between flex-col sm:flex-row gap-4">
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
              <FormInput
                name="search"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={FiSearch}
                className="flex-1"
              />
              <div className="flex gap-2">
                <FormSelect
                  name="role"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  options={roleOptions}
                  className="w-40"
                />
                {(filter || searchTerm) && (
                  <Button variant="outline" onClick={() => { setFilter(''); setSearchTerm(''); }}>
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        {loading ? (
          <div className="mt-6">
            <LoadingSpinner size="lg" />
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
          <div className="mt-6">
            <ResponsiveTable
              columns={columns}
              data={filtered}
              emptyMessage="No users found"
            />
          </div>
        )}

        {/* Add/Edit User Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingUser ? 'Edit User' : 'Add New User'}
          size="lg"
        >
          <UserForm
            initialData={editingUser}
            onSubmit={handleFormSubmit}
            loading={formLoading}
          />
        </Modal>
      </AdminLayout>
    </>
  );
}
