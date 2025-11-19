import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import apiClient from '@/utils/apiClient';
import { FiBell, FiCheckCircle, FiAlertCircle, FiInfo, FiTrash2 } from 'react-icons/fi';

export default function Notifications() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
      } else {
        fetchNotifications();
      }
    }
  }, [user, authLoading, filter]);

  const fetchNotifications = async () => {
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const response = await apiClient.get(`/notifications${params}`);
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await apiClient.patch(`/notifications/${notificationId}`, { read: true });
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await apiClient.delete(`/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.patch('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return { icon: FiCheckCircle, color: 'text-green-600', bg: 'bg-green-50' };
      case 'warning':
        return { icon: FiAlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50' };
      case 'error':
        return { icon: FiAlertCircle, color: 'text-red-600', bg: 'bg-red-50' };
      default:
        return { icon: FiInfo, color: 'text-blue-600', bg: 'bg-blue-50' };
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <Head>
        <title>Notifications - Dashboard</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-4">
          <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-600 mt-0.5">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn btn-sm btn-secondary"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
            <div className="flex gap-2">
              {['all', 'unread', 'read'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    filter === f
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {notifications.length > 0 ? (
            <div className="space-y-2">
              {notifications.map((notification) => {
                const iconConfig = getNotificationIcon(notification.type);
                const Icon = iconConfig.icon;

                return (
                  <div
                    key={notification._id}
                    className={`bg-white border rounded-lg p-3 transition-all ${
                      notification.read ? 'border-gray-200' : 'border-primary-200 bg-primary-50/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${iconConfig.bg}`}>
                        <Icon className={`w-4 h-4 ${iconConfig.color}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-1">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
                            title="Mark as read"
                          >
                            <FiCheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <FiBell className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No notifications found</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
