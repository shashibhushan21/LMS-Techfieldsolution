import Head from 'next/head';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import apiClient from '@/utils/apiClient';
import DataTable from '@/components/admin/DataTable';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/ui/SectionHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import { Card, CardContent } from '@/components/ui/Card';
import { FiPlus, FiX, FiRefreshCw, FiSearch } from 'react-icons/fi';

export default function AdminInternships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ title: '', company: '', description: '' });

  const load = async () => {
    try {
      const res = await apiClient.get('/internships');
      setInternships(res.data.data || []);
    } catch (e) {
      console.error('Failed to fetch internships', e);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = internships.filter(i => 
    !searchTerm || 
    i.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: internships.length,
    active: internships.filter(i => i.status === 'active').length,
    draft: internships.filter(i => i.status === 'draft').length,
    archived: internships.filter(i => i.status === 'archived').length
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    setCreating(true);
    try {
      // Placeholder: implement POST /internships when backend endpoint ready for admin create.
      // await apiClient.post('/internships', form);
      setShowCreate(false);
      setForm({ title: '', company: '', description: '' });
      // Optimistic placeholder entry
      setInternships(prev => [{ _id: 'temp-' + Date.now(), title: form.title, company: form.company, description: form.description, status: 'draft', createdAt: new Date().toISOString() }, ...prev]);
    } catch (e) {
      console.error('Failed to create internship', e);
    } finally { setCreating(false); }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'company', label: 'Company', render: r => r.company || '—' },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status || 'draft'} /> },
    { key: 'createdAt', label: 'Created', render: r => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—' },
  ];

  return (
    <>
      <Head><title>Admin Internships</title></Head>
      <AdminLayout>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <SectionHeader title="Internships" subtitle="Manage internship listings" />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => load()}>
              <FiRefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
            <Button onClick={() => setShowCreate(true)}>
              <FiPlus className="w-4 h-4 mr-2" /> New Internship
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Total', value: stats.total, color: 'bg-neutral-50 border-neutral-200 text-neutral-700' },
            { label: 'Active', value: stats.active, color: 'bg-green-50 border-green-200 text-green-700' },
            { label: 'Draft', value: stats.draft, color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
            { label: 'Archived', value: stats.archived, color: 'bg-neutral-50 border-neutral-200 text-neutral-600' }
          ].map(stat => (
            <Card key={stat.label} className={`border ${stat.color}`}>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-xs font-medium mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search internships by title or company..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input w-full pl-10"
              />
            </div>
          </CardContent>
        </Card>
        <div className="mt-6">
          <DataTable columns={columns} data={filtered} loading={loading} emptyTitle="No internships" emptyMessage={searchTerm ? "No internships match your search." : "Create your first internship to get started."} />
        </div>

        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl border border-neutral-200 animate-scale-up">
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900">Create Internship</h2>
                <button className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700" onClick={() => setShowCreate(false)} aria-label="Close">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="px-6 py-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Title *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input w-full" placeholder="Full Stack Development Internship" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Company</label>
                  <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="input w-full" placeholder="TechFieldSolution" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                  <textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input w-full" placeholder="Describe the internship..." />
                </div>
                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-xs text-yellow-800">
                  ⚠️ Note: Persisting to backend not yet wired. This creates a temporary entry.
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                  <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                  <Button type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create'}</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
