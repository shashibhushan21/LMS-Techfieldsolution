import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { FiUser, FiMail, FiLock, FiBriefcase, FiInfo } from 'react-icons/fi';

export default function UserForm({ initialData, onSubmit, loading }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'intern',
        bio: '',
        ...initialData
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData, password: '' })); // Don't populate password
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">First Name</label>
                    <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className="input w-full pl-10"
                            placeholder="John"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Last Name</label>
                    <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className="input w-full pl-10"
                            placeholder="Doe"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="input w-full pl-10"
                        placeholder="john@example.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {initialData ? 'New Password (Optional)' : 'Password'}
                </label>
                <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="password"
                        name="password"
                        required={!initialData}
                        value={formData.password}
                        onChange={handleChange}
                        className="input w-full pl-10"
                        placeholder={initialData ? "Leave blank to keep current" : "••••••••"}
                        minLength={6}
                    />
                </div>
                <p className="text-xs text-neutral-500 mt-1">Must be at least 6 characters</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Role</label>
                <div className="relative">
                    <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="input w-full pl-10"
                    >
                        <option value="intern">Intern</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Bio (Optional)</label>
                <div className="relative">
                    <FiInfo className="absolute left-3 top-3 text-neutral-400" />
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="input w-full pl-10"
                        rows={3}
                        placeholder="Short bio about the user..."
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (initialData ? 'Update User' : 'Create User')}
                </Button>
            </div>
        </form>
    );
}
