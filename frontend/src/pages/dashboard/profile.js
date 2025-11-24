import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    Button,
    FormInput,
    LoadingSpinner,
    Badge,
    Alert
} from '@/components/ui';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';
import { FiUser, FiLock, FiMail, FiPhone, FiCalendar, FiSave } from 'react-icons/fi';
import { validatePassword } from '@/utils/validation';
import { useFormValidation } from '@/hooks/useCommon';

export default function InternProfile() {
    const { user, updateProfile, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Profile form validation
    const profileValidation = (values) => {
        const errors = {};
        if (!values.firstName?.trim()) errors.firstName = 'First name is required';
        if (!values.lastName?.trim()) errors.lastName = 'Last name is required';
        if (!values.email?.trim()) errors.email = 'Email is required';

        const digits = values.phone?.replace(/\D/g, '') || '';
        if (digits && digits.length !== 10) {
            errors.phone = 'Please enter a valid 10-digit mobile number';
        }
        return errors;
    };

    const {
        values: profileForm,
        errors: profileErrors,
        handleChange: handleProfileChange,
        setValues: setProfileForm,
        validate: validateProfile
    } = useFormValidation(
        { firstName: '', lastName: '', email: '', phone: '' },
        profileValidation
    );

    // Password form validation
    const passwordValidation = (values) => {
        const errors = {};
        if (!values.currentPassword) errors.currentPassword = 'Current password is required';
        if (!values.newPassword) errors.newPassword = 'New password is required';
        if (values.newPassword && values.newPassword.length < 6) {
            errors.newPassword = 'Password must be at least 6 characters';
        }
        if (values.newPassword !== values.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        return errors;
    };

    const {
        values: passwordForm,
        errors: passwordErrors,
        handleChange: handlePasswordChange,
        setValues: setPasswordForm,
        validate: validatePasswordForm
    } = useFormValidation(
        { currentPassword: '', newPassword: '', confirmPassword: '' },
        passwordValidation
    );

    // Populate form when user data is available
    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/');
            } else if (user.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
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

    // Handle profile update
    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        if (!validateProfile()) return;

        const digits = profileForm.phone.replace(/\D/g, '');
        const formattedPhone = digits ? `+91${digits}` : '';
        const updatedProfile = { ...profileForm, phone: formattedPhone };

        setLoading(true);
        try {
            const result = await updateProfile(updatedProfile);
            if (result.success) {
                toast.success('Profile updated successfully');
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    // Handle password change
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (!validatePasswordForm()) return;

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
                <div className="flex-center h-64">
                    <LoadingSpinner size="lg" />
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
                    <Card>
                        <CardContent className="p-6">
                            <h1 className="text-2xl font-bold text-neutral-900">My Profile</h1>
                            <p className="text-neutral-600 mt-1">Manage your personal information and account settings</p>
                        </CardContent>
                    </Card>

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
                                        <FormInput
                                            label="First Name"
                                            name="firstName"
                                            value={profileForm.firstName}
                                            onChange={handleProfileChange}
                                            error={profileErrors.firstName}
                                            icon={FiUser}
                                            required
                                        />
                                        <FormInput
                                            label="Last Name"
                                            name="lastName"
                                            value={profileForm.lastName}
                                            onChange={handleProfileChange}
                                            error={profileErrors.lastName}
                                            icon={FiUser}
                                            required
                                        />
                                    </div>

                                    <FormInput
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={profileForm.email}
                                        onChange={handleProfileChange}
                                        error={profileErrors.email}
                                        icon={FiMail}
                                        required
                                    />

                                    <div>
                                        <label className="label">
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
                                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                    handleProfileChange({ target: { name: 'phone', value: val } });
                                                }}
                                                className={`input w-full pl-12 ${profileErrors.phone ? 'input-error' : ''}`}
                                                placeholder="6290218436"
                                            />
                                        </div>
                                        {profileErrors.phone && (
                                            <p className="mt-1 text-sm text-red-600">{profileErrors.phone}</p>
                                        )}
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
                                <div className="flex-between py-3 border-b border-neutral-100">
                                    <span className="text-sm text-neutral-600">Role</span>
                                    <Badge variant="primary" className="capitalize">{user?.role}</Badge>
                                </div>
                                <div className="flex-between py-3 border-b border-neutral-100">
                                    <span className="text-sm text-neutral-600">Account Status</span>
                                    <Badge variant="success">Active</Badge>
                                </div>
                                <div className="flex-between py-3 border-b border-neutral-100">
                                    <span className="text-sm text-neutral-600">
                                        <FiCalendar className="inline w-4 h-4 mr-1" /> Member Since
                                    </span>
                                    <span className="text-sm font-medium text-neutral-900">
                                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex-between py-3">
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
                            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
                                <FormInput
                                    label="Current Password"
                                    name="currentPassword"
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChange}
                                    error={passwordErrors.currentPassword}
                                    icon={FiLock}
                                    required
                                />

                                <FormInput
                                    label="New Password"
                                    name="newPassword"
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    error={passwordErrors.newPassword}
                                    icon={FiLock}
                                    helperText="Minimum 6 characters"
                                    required
                                />

                                <FormInput
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    error={passwordErrors.confirmPassword}
                                    icon={FiLock}
                                    required
                                />

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
