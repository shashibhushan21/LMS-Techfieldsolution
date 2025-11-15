import Head from 'next/head';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BRAND } from '@/config/brand';
import SectionHeader from '@/components/ui/SectionHeader';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = async () => {
    try {
      const res = await apiClient.get('/notifications');
      setItems(res.data.data || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const markAll = async () => {
    try {
      await apiClient.put('/notifications/read-all');
      toast.success('All marked as read');
      load();
    } catch {
      toast.error('Failed to mark all');
    }
  };

  const markOne = async (id) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      load();
    } catch {}
  };

  const removeOne = async (id) => {
    try {
      await apiClient.delete(`/notifications/${id}`);
      toast.success('Deleted');
      setItems((prev) => prev.filter((n) => n._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <>
      <Head>
        <title>Notifications - {BRAND.name}</title>
      </Head>
      <Navbar />
      <main className="bg-gray-50">
        <section className="py-16">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6">
              <SectionHeader title="Notifications" subtitle={`${unreadCount} unread`} />
              <Button onClick={markAll} variant="outline">Mark all as read</Button>
            </div>
            {loading ? (
              <div className="h-40 grid place-items-center">Loading...</div>
            ) : items.length === 0 ? (
              <Card><CardContent>No notifications</CardContent></Card>
            ) : (
              <div className="space-y-3">
                {items.map((n) => (
                  <Card key={n._id}>
                    <CardContent className="flex items-start justify-between gap-4">
                      <div>
                        <p className={`font-medium ${n.isRead ? 'text-neutral-700' : 'text-neutral-900'}`}>{n.title || 'Notification'}</p>
                        {n.message && <p className="text-sm text-neutral-600 mt-1">{n.message}</p>}
                        <p className="text-xs text-neutral-500 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!n.isRead && <Button variant="ghost" onClick={() => markOne(n._id)}>Mark read</Button>}
                        <Button variant="outline" onClick={() => removeOne(n._id)}>Delete</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
