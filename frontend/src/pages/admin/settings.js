import Head from 'next/head';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import SectionHeader from '@/components/ui/SectionHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';
import { FiUser, FiLock, FiBell, FiInfo, FiSave, FiTool } from 'react-icons/fi';
import { validatePassword } from '@/utils/validation';

export default function AdminSettings() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [systemInfo, setSystemInfo] = useState(null);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newEnrollments: true,
    submissionAlerts: true,
    systemUpdates: false
  });

  // Maintenance mode
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [maintenanceStartTime, setMaintenanceStartTime] = useState('');
  const [maintenanceEndTime, setMaintenanceEndTime] = useState('');
  const [loadingMaintenance, setLoadingMaintenance] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
    fetchSystemInfo();
  }, [user]);

  const fetchSystemInfo = async () => {
    try {
      const res = await apiClient.get('/analytics/dashboard/admin');
      setSystemInfo(res.data.data);
    } catch (error) {
      console.error('Failed to fetch system info:', error);
    }
  };

  const fetchMaintenanceSettings = async () => {
    try {
      const res = await apiClient.get('/admin/system/settings');
      const settings = res.data.data;
      setMaintenanceMode(settings.maintenanceMode);
      setMaintenanceMessage(settings.maintenanceMessage || '');
      setMaintenanceStartTime(settings.maintenanceStartTime ? new Date(settings.maintenanceStartTime).toISOString().slice(0, 16) : '');
      setMaintenanceEndTime(settings.maintenanceEndTime ? new Date(settings.maintenanceEndTime).toISOString().slice(0, 16) : '');
    } catch (error) {
      console.error('Failed to fetch maintenance settings:', error);
    }
  };

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
    fetchSystemInfo();
    fetchMaintenanceSettings();
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.put('/auth/update-profile', profileForm);
      setUser(res.data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validate password
    const passwordValidation = validatePassword(passwordForm.newPassword, passwordForm.confirmPassword);
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.error);
      return;
    }

    setLoading(true);
    try {
      await apiClient.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);
    try {
      // Store in localStorage for now (can be moved to backend later)
      localStorage.setItem('notificationPreferences', JSON.stringify(notifications));
      toast.success('Notification preferences updated');
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleMaintenanceToggle = async () => {
    setLoadingMaintenance(true);
    try {
      await apiClient.put('/admin/system/maintenance', {
        maintenanceMode: !maintenanceMode,
        maintenanceMessage,
        maintenanceStartTime: maintenanceStartTime || null,
        maintenanceEndTime: maintenanceEndTime || null
      });
      setMaintenanceMode(!maintenanceMode);
      toast.success(`Maintenance mode ${!maintenanceMode ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update maintenance mode');
    } finally {
      setLoadingMaintenance(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiLock },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'maintenance', label: 'Maintenance', icon: FiTool },
    { id: 'system', label: 'System Info', icon: FiInfo }
  ];

  return (
    <>
      <Head><title>Settings - Admin</title></Head>
      <AdminLayout>
        <SectionHeader title="Settings" subtitle="Manage your account and preferences" />

        {/* Tabs */}
        <div className="flex gap-2 mt-6 mb-6 border-b border-neutral-200 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        className="input w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className="input w-full"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="input w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="input w-full"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={loading}>
                      <FiSave className="w-4 h-4 mr-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-sm text-neutral-600">Role</span>
                  <span className="text-sm font-medium text-neutral-900 capitalize">{user?.role}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-sm text-neutral-600">Account Status</span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-sm text-neutral-600">Member Since</span>
                  <span className="text-sm font-medium text-neutral-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-neutral-600">Last Login</span>
                  <span className="text-sm font-medium text-neutral-900">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="input w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      New Password *
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="input w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="input w-full"
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={loading}>
                      <FiSave className="w-4 h-4 mr-2" />
                      {loading ? 'Update Password' : 'Change Password'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">Email Notifications</p>
                      <p className="text-sm text-neutral-500">Receive daily summaries via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.emailNotifications}
                        onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">New Enrollments</p>
                      <p className="text-sm text-neutral-500">Get notified when a student enrolls</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.newEnrollments}
                        onChange={(e) => setNotifications({ ...notifications, newEnrollments: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">Submission Alerts</p>
                      <p className="text-sm text-neutral-500">Get notified when a student submits an assignment</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.submissionAlerts}
                        onChange={(e) => setNotifications({ ...notifications, submissionAlerts: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">System Updates</p>
                      <p className="text-sm text-neutral-500">Receive notifications about system maintenance</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.systemUpdates}
                        onChange={(e) => setNotifications({ ...notifications, systemUpdates: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="pt-4">
                    <Button onClick={handleNotificationUpdate} disabled={loading}>
                      {loading ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Mode</CardTitle>
                <CardDescription>Control site-wide maintenance mode for non-admin users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Maintenance Mode Toggle */}
                  <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900 mb-1">Enable Maintenance Mode</p>
                      <p className="text-sm text-neutral-500">
                        When enabled, all non-admin users will be redirected to the maintenance page. Admins can still access the full site.
                      </p>
                      {maintenanceMode && (
                        <div className="mt-2 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full inline-block">
                          ⚠️ Maintenance Mode Active
                        </div>
                      )}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        checked={maintenanceMode}
                        onChange={handleMaintenanceToggle}
                        disabled={loadingMaintenance}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  {/* Custom Message */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Maintenance Message
                    </label>
                    <textarea
                      value={maintenanceMessage}
                      onChange={(e) => setMaintenanceMessage(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="We're currently performing scheduled maintenance..."
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      This message will be displayed on the maintenance page
                    </p>
                  </div>

                  {/* Scheduled Downtime */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-semibold text-neutral-900 mb-4">Scheduled Downtime (Optional)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Start Time
                        </label>
                        <input
                          type="datetime-local"
                          value={maintenanceStartTime}
                          onChange={(e) => setMaintenanceStartTime(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          End Time
                        </label>
                        <input
                          type="datetime-local"
                          value={maintenanceEndTime}
                          onChange={(e) => setMaintenanceEndTime(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">
                      Set estimated downtime period to display on the maintenance page
                    </p>
                  </div>

                  {/* Save Button */}
                  <div className="pt-2">
                    <Button
                      onClick={async () => {
                        setLoadingMaintenance(true);
                        try {
                          await apiClient.put('/admin/system/maintenance', {
                            maintenanceMode,
                            maintenanceMessage,
                            maintenanceStartTime: maintenanceStartTime || null,
                            maintenanceEndTime: maintenanceEndTime || null
                          });
                          toast.success('Maintenance settings updated');
                        } catch (error) {
                          toast.error('Failed to update settings');
                        } finally {
                          setLoadingMaintenance(false);
                        }
                      }}
                      disabled={loadingMaintenance}
                    >
                      <FiSave className="w-4 h-4 mr-2" />
                      {loadingMaintenance ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* System Info Tab */}
        {activeTab === 'system' && (
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>Technical details about the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-sm text-neutral-600">Version</span>
                  <span className="text-sm font-medium text-neutral-900">1.0.0</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-sm text-neutral-600">Environment</span>
                  <span className="text-sm font-medium text-neutral-900">Production</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-sm text-neutral-600">Database Status</span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Connected
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-sm text-neutral-600">Last Backup</span>
                  <span className="text-sm font-medium text-neutral-900">
                    {new Date(Date.now() - 86400000).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
