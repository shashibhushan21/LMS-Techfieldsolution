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
import { FiSearch, FiUserPlus } from 'react-icons/fi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await apiClient.get('/users');
      setUsers(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

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
          <Button>
            <FiUserPlus className="w-4 h-4 mr-2" /> Add User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Total Users', value: stats.total, color: 'bg-neutral-50 border-neutral-200 text-neutral-700' },
            { label: 'Admins', value: stats.admins, color: 'bg-red-50 border-red-200 text-red-700' },
            { label: 'Mentors', value: stats.mentors, color: 'bg-blue-50 border-blue-200 text-blue-700' },
            { label: 'Interns', value: stats.interns, color: 'bg-green-50 border-green-200 text-green-700' }
          ].map(stat => (
            <Card key={stat.label} className={`border ${stat.color}`}>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-xs font-medium mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mt-6">
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
                <Button variant="outline" onClick={() => { setFilter(''); setSearchTerm(''); }}>Reset</Button>
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
          <div className="mt-6 overflow-auto">
            <div className="bg-white border border-neutral-200 rounded-xl shadow-soft">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 text-neutral-700 border-b border-neutral-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Email</th>
                    <th className="px-4 py-3 text-left font-semibold">Role</th>
                    <th className="px-4 py-3 text-left font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filtered.map(u => (
                    <tr key={u._id} className="hover:bg-neutral-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={u.avatar} name={`${u.firstName} ${u.lastName}`} size="sm" />
                          <div className="font-medium text-neutral-900">{u.firstName} {u.lastName}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-neutral-600">{u.email}</td>
                      <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                      <td className="px-4 py-3 text-neutral-600">{new Date(u.createdAt).toLocaleDateString()}</td>
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
