import Head from 'next/head';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import apiClient from '@/utils/apiClient';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import EmptyState from '@/components/admin/EmptyState';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiAlertCircle } from 'react-icons/fi';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'info', audience: 'all' });

  const load = async () => {
    try {
      const res = await apiClient.get('/announcements');
      setAnnouncements(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch announcements', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = () => {
    setForm({ title: '', message: '', type: 'info', audience: 'all' });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (announcement) => {
    setForm({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type || 'info',
      audience: announcement.audience || 'all'
    });
    setEditingId(announcement._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await apiClient.put(`/announcements/${editingId}`, form);
      } else {
        await apiClient.post('/announcements', form);
      }
      setShowModal(false);
      load();
    } catch (err) {
      console.error('Failed to save announcement', err);
      alert('Failed to save announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await apiClient.delete(`/announcements/${id}`);
      load();
    } catch (err) {
      console.error('Failed to delete announcement', err);
      alert('Failed to delete announcement');
    }
  };

  const typeColors = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    danger: 'bg-red-50 border-red-200 text-red-800'
  };

  const typeIcons = {
    info: '💡',
    success: '✅',
    warning: '⚠️',
    danger: '🚨'
  };

  return (
    <>
      <Head><title>Admin Announcements</title></Head>
      <AdminLayout>
        <div className="flex items-center justify-between">
          <SectionHeader title="Announcements" subtitle="Manage platform-wide notifications" />
          <Button onClick={handleCreate}>
            <FiPlus className="w-4 h-4 mr-2" /> New Announcement
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : announcements.length === 0 ? (
          <Card className="mt-6">
            <CardContent className="py-12">
              <EmptyState
                title="No announcements yet"
                message="Create your first announcement to notify users about important updates."
              />
            </CardContent>
          </Card>
        ) : (
          <div className="mt-6 grid gap-4">
            {announcements.map(announcement => {
              const type = (announcement.type && typeColors[announcement.type]) ? announcement.type : 'info';
              const colorClass = typeColors[type];

              return (
                <Card key={announcement._id} className={`border-l-4 ${colorClass.replace('bg-', 'border-l-').split(' ')[0]}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{typeIcons[type]}</span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorClass}`}>
                            {type}
                          </span>
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-100 text-neutral-700">
                            {announcement.audience || 'all'}
                          </span>
                        </div>
                        <CardTitle className="text-xl">{announcement.title}</CardTitle>
                        <CardDescription className="mt-2 text-sm leading-relaxed">
                          {announcement.message}
                        </CardDescription>
                        <p className="text-xs text-neutral-500 mt-3">
                          Posted {new Date(announcement.createdAt).toLocaleDateString()} at {new Date(announcement.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(announcement)}
                          className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-primary-600 transition"
                          aria-label="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(announcement._id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-neutral-600 hover:text-red-600 transition"
                          aria-label="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
            <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl border border-neutral-200 animate-scale-up">
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {editingId ? 'Edit Announcement' : 'New Announcement'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700"
                  aria-label="Close"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="input w-full"
                    placeholder="Important Update"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Message *</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="input w-full"
                    rows={4}
                    placeholder="Describe the announcement in detail..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Type</label>
                    <select
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                      className="input w-full"
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="danger">Danger</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Audience</label>
                    <select
                      value={form.audience}
                      onChange={e => setForm({ ...form, audience: e.target.value })}
                      className="input w-full"
                    >
                      <option value="all">All Users</option>
                      <option value="intern">Interns Only</option>
                      <option value="mentor">Mentors Only</option>
                      <option value="admin">Admins Only</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-800">
                  <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>This announcement will be visible to {form.audience === 'all' ? 'all users' : form.audience + 's'} immediately.</span>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
