import Head from 'next/head';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import apiClient from '@/utils/apiClient';
import {
  SectionHeader,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  LoadingSpinner,
  Modal,
  FormInput,
  FormTextarea,
  FormSelect,
  Badge,
  Alert
} from '@/components/ui';
import EmptyState from '@/components/admin/EmptyState';
import { FiEdit2, FiTrash2, FiPlus, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useApiCall, useFormValidation } from '@/hooks/useCommon';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { loading, execute: load } = useApiCall(
    () => apiClient.get('/announcements'),
    {
      onSuccess: (data) => {
        const announcementsArray = Array.isArray(data) ? data : (data?.data || []);
        setAnnouncements(announcementsArray);
      },
      errorMessage: 'Failed to fetch announcements'
    }
  );

  const validation = (values) => {
    const errors = {};
    if (!values.title?.trim()) errors.title = 'Title is required';
    if (!values.content?.trim()) errors.content = 'Content is required';
    return errors;
  };

  const {
    values: form,
    errors,
    handleChange,
    setValues: setForm,
    validate,
    resetForm
  } = useFormValidation(
    { title: '', content: '', type: 'general', targetAudience: 'all' },
    validation
  );

  useEffect(() => { load(); }, []);

  const handleCreate = () => {
    resetForm();
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (announcement) => {
    setForm({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type || 'general',
      targetAudience: announcement.targetAudience || 'all'
    });
    setEditingId(announcement._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (editingId) {
        await apiClient.put(`/announcements/${editingId}`, form);
        toast.success('Announcement updated successfully');
      } else {
        await apiClient.post('/announcements', form);
        toast.success('Announcement created successfully');
      }
      setShowModal(false);
      load();
    } catch (err) {
      console.error('Failed to save announcement', err);
      toast.error(err.response?.data?.message || 'Failed to save announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await apiClient.delete(`/announcements/${id}`);
      toast.success('Announcement deleted successfully');
      load();
    } catch (err) {
      console.error('Failed to delete announcement', err);
      toast.error(err.response?.data?.message || 'Failed to delete announcement');
    }
  };

  const typeVariants = {
    general: 'info',
    urgent: 'error',
    update: 'success',
    reminder: 'warning',
    event: 'primary'
  };

  const typeIcons = {
    general: '📢',
    urgent: '🚨',
    update: '✅',
    reminder: '⏰',
    event: '📅'
  };

  const typeOptions = [
    { value: 'general', label: 'General' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'update', label: 'Update' },
    { value: 'reminder', label: 'Reminder' },
    { value: 'event', label: 'Event' }
  ];

  const audienceOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'interns', label: 'Interns Only' },
    { value: 'mentors', label: 'Mentors Only' }
  ];

  return (
    <>
      <Head><title>Admin Announcements</title></Head>
      <AdminLayout>
        <div className="flex-between">
          <SectionHeader title="Announcements" subtitle="Manage platform-wide notifications" />
          <Button onClick={handleCreate}>
            <FiPlus className="w-4 h-4 mr-2" /> New Announcement
          </Button>
        </div>

        {loading ? (
          <div className="flex-center py-12">
            <LoadingSpinner size="lg" />
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
              const type = (announcement.type && typeVariants[announcement.type]) ? announcement.type : 'general';

              return (
                <Card key={announcement._id} className="border-l-4 border-l-primary-600">
                  <CardHeader>
                    <div className="flex-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{typeIcons[type]}</span>
                          <Badge variant={typeVariants[type]}>{type}</Badge>
                          <Badge variant="default">{announcement.targetAudience || 'all'}</Badge>
                        </div>
                        <CardTitle className="text-xl">{announcement.title}</CardTitle>
                        <CardDescription className="mt-2 text-sm leading-relaxed">
                          {announcement.content}
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
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingId ? 'Edit Announcement' : 'New Announcement'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Important Update"
              required
            />

            <FormTextarea
              label="Message"
              name="content"
              value={form.content}
              onChange={handleChange}
              error={errors.content}
              rows={4}
              placeholder="Describe the announcement in detail..."
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                label="Type"
                name="type"
                value={form.type}
                onChange={handleChange}
                options={typeOptions}
              />

              <FormSelect
                label="Audience"
                name="targetAudience"
                value={form.targetAudience}
                onChange={handleChange}
                options={audienceOptions}
              />
            </div>

            <Alert variant="info">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0 mr-2" />
              This announcement will be visible to {form.targetAudience === 'all' ? 'all users' : form.targetAudience} immediately.
            </Alert>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </Modal>
      </AdminLayout>
    </>
  );
}
