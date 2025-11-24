import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import apiClient from '@/utils/apiClient';
import { FiBell, FiCheckCircle, FiAlertCircle, FiInfo, FiTrash2, FiCheck, FiClock } from 'react-icons/fi';
import { useToast } from '@/hooks/useToast';
import {
  SectionHeader,
  Button,
  LoadingSpinner,
  Card,
  CardContent,
  Badge
} from '@/components/ui';
import { useApiCall } from '@/hooks/useCommon';

export default function Notifications() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [filter, setFilter] = useState('all'); // all, unread, read

  const { data: notifications, loading, execute: fetchNotifications, setData: setNotifications } = useApiCall(
    () => {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      return apiClient.get(`/notifications${params}`);
    },
    {
      initialData: [],
      errorMessage: 'Failed to fetch notifications',
      dependencies: [filter]
    }
  );

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
      } else {
        fetchNotifications();
      }
    }
  }, [user, authLoading, filter]);

  const markAsRead = async (notificationId) => {
    try {
      await apiClient.put(`/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error('Failed to update notification');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await apiClient.delete(`/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      toast.success('Notification removed');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return { icon: FiCheckCircle, color: 'text-green-600', bg: 'bg-green-50' };
      case 'warning':
        return { icon: FiAlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' };
      case 'error':
        return { icon: FiAlertCircle, color: 'text-red-600', bg: 'bg-red-50' };
      default:
        return { icon: FiInfo, color: 'text-blue-600', bg: 'bg-blue-50' };
    }
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <Head>
        <title>Notifications - Dashboard</title>
      </Head>

      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <SectionHeader
              title="Notifications"
              subtitle="Stay updated with your latest activities and announcements"
            />
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                >
                  <FiCheck className="w-4 h-4 mr-2" />
                  Mark all as read
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
            {['all', 'unread', 'read'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${filter === f
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const iconConfig = getNotificationIcon(notification.type);
                const Icon = iconConfig.icon;

                return (
                  <div
                    key={notification._id}
                    className={`group relative bg-white border rounded-xl p-4 transition-all hover:shadow-md ${notification.isRead
                      ? 'border-gray-200'
                      : 'border-primary-200 bg-primary-50/10 shadow-sm'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl flex-shrink-0 ${iconConfig.bg} ${iconConfig.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-base font-semibold mb-1 text-gray-900">
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                            <FiClock className="w-3 h-3" />
                            {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {notification.message}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-lg p-1 border border-gray-100">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                            title="Mark as read"
                          >
                            <FiCheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <FiBell className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                <p className="text-gray-500 mt-1">You're all caught up! Check back later.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
