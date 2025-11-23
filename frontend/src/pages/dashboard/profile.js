import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';
import { FiUser, FiLock, FiMail, FiPhone, FiCalendar, FiSave } from 'react-icons/fi';
import { validatePassword } from '@/utils/validation';

export default function InternProfile() {
    const { user, setUser, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '' // Stores only the 10 digits
    });

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Populate form when user data is available
    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/');
            } else if (user.role === 'admin') {
                router.push('/admin/dashboard');
            } else if (user.role === 'mentor') {
                router.push('/mentor/dashboard');
            } else {
                // Extract digits from stored phone (e.g., "+91 1234567890" -> "1234567890")
                const phoneDigits = user.phone ? user.phone.replace(/\D/g, '').slice(-10) : '';

                setProfileForm({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    phone: phoneDigits
                });
            }
        }
    }, [user, authLoading]);

    // Handle profile update with phone validation
    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        // Validate phone digits
        const digits = profileForm.phone.replace(/\D/g, '');
        if (digits.length !== 10) {
            toast.error('Please enter a valid 10‑digit mobile number');
            return;
        }

        const formattedPhone = `+91 ${digits}`;
        const updatedProfile = { ...profileForm, phone: formattedPhone };

        setLoading(true);
        try {
            const res = await apiClient.put('/auth/update-profile', updatedProfile);
            setUser(res.data.user);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    // Handle password change
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        const validation = validatePassword(passwordForm.newPassword, passwordForm.confirmPassword);
        if (!validation.valid) {
            toast.error(validation.error);
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

    if (authLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <>
            <Head>
                <title>My Profile - TechFieldSolution LMS</title>
            </Head>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
                        <h1 className="text-2xl font-bold text-neutral-900">My Profile</h1>
                        <p className="text-neutral-600 mt-1">Manage your personal information and account settings</p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Profile Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your personal details</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleProfileUpdate} className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                                <FiUser className="inline w-4 h-4 mr-1" /> First Name *
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
                                                <FiUser className="inline w-4 h-4 mr-1" /> Last Name *
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
                                            <FiMail className="inline w-4 h-4 mr-1" /> Email *
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
                                            <FiPhone className="inline w-4 h-4 mr-1" /> Phone Number
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <span className="text-gray-500 font-medium">+91</span>
                                            </div>
                                            <input
                                                type="tel"
                                                value={profileForm.phone}
                                                onChange={(e) => {
                                                    // Only allow digits and max 10 chars
                                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                    setProfileForm({ ...profileForm, phone: val });
                                                }}
                                                className="input w-full pl-12" // Added padding-left for the +91 prefix
                                                placeholder="6290218436"
                                            />
                                        </div>
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

                        {/* Account Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Details</CardTitle>
                                <CardDescription>Your account information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between py-3 border-b border-neutral-100">
                                    <span className="text-sm text-neutral-600">Role</span>
                                    <span className="text-sm font-medium text-neutral-900 capitalize">{user?.role}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-neutral-100">
                                    <span className="text-sm text-neutral-600">Account Status</span>
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-neutral-100">
                                    <span className="text-sm text-neutral-600">
                                        <FiCalendar className="inline w-4 h-4 mr-1" /> Member Since
                                    </span>
                                    <span className="text-sm font-medium text-neutral-900">
                                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between py-3">
                                    <span className="text-sm text-neutral-600">Last Login</span>
                                    <span className="text-sm font-medium text-neutral-900">
                                        {new Date().toLocaleDateString()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Change Password */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Update your password to keep your account secure</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-xl">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                                        <FiLock className="inline w-4 h-4 mr-1" /> Current Password *
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
                                        <FiLock className="inline w-4 h-4 mr-1" /> New Password *
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        className="input w-full"
                                        required
                                        minLength={6}
                                    />
                                    <p className="text-xs text-neutral-500 mt-1">Minimum 6 characters</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                                        <FiLock className="inline w-4 h-4 mr-1" /> Confirm New Password *
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
                                        <FiLock className="w-4 h-4 mr-2" />
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        </>
    );
}
