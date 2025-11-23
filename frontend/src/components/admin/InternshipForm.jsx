import { useState, useEffect } from 'react';
import apiClient from '@/utils/apiClient';
import { FiSave, FiX, FiCalendar, FiUser, FiClock, FiLayers, FiType } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function InternshipForm({ initialData, onSubmit, loading }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        domain: 'web-development',
        skillLevel: 'beginner',
        duration: { weeks: 12 },
        startDate: '',
        endDate: '',
        applicationDeadline: '',
        mentor: '',
        status: 'draft',
        ...initialData
    });

    const [mentors, setMentors] = useState([]);
    const [loadingMentors, setLoadingMentors] = useState(true);

    useEffect(() => {
        fetchMentors();
        if (initialData) {
            // Format dates for input fields (YYYY-MM-DD)
            const formatDate = (dateString) => dateString ? new Date(dateString).toISOString().split('T')[0] : '';
            setFormData(prev => ({
                ...prev,
                ...initialData,
                startDate: formatDate(initialData.startDate),
                endDate: formatDate(initialData.endDate),
                applicationDeadline: formatDate(initialData.applicationDeadline),
                mentor: initialData.mentor?._id || initialData.mentor // Handle populated or ID
            }));
        }
    }, [initialData]);

    const fetchMentors = async () => {
        try {
            const response = await apiClient.get('/users?role=mentor&limit=100');
            setMentors(response.data.data);
        } catch (error) {
            console.error('Error fetching mentors:', error);
            toast.error('Failed to load mentors list');
        } finally {
            setLoadingMentors(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const domains = [
        'software-development', 'web-development', 'mobile-development',
        'data-science', 'machine-learning', 'ui-ux-design',
        'digital-marketing', 'business-analytics', 'cybersecurity',
        'cloud-computing', 'devops', 'other'
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-4">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Internship Title</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiType className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                placeholder="e.g. Full Stack Web Development"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            required
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            className="block w-full border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Detailed description of the internship program..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiLayers className="text-gray-400" />
                            </div>
                            <select
                                name="domain"
                                required
                                value={formData.domain}
                                onChange={handleChange}
                                className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            >
                                {domains.map(d => (
                                    <option key={d} value={d}>{d.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Skill Level</label>
                        <select
                            name="skillLevel"
                            required
                            value={formData.skillLevel}
                            onChange={handleChange}
                            className="block w-full border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Weeks)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiClock className="text-gray-400" />
                            </div>
                            <input
                                type="number"
                                name="duration.weeks"
                                required
                                min="1"
                                value={formData.duration.weeks}
                                onChange={handleChange}
                                className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="block w-full border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="draft">Draft</option>
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-4">Schedule & Assignment</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiCalendar className="text-gray-400" />
                            </div>
                            <input
                                type="date"
                                name="startDate"
                                required
                                value={formData.startDate}
                                onChange={handleChange}
                                className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiCalendar className="text-gray-400" />
                            </div>
                            <input
                                type="date"
                                name="endDate"
                                required
                                value={formData.endDate}
                                onChange={handleChange}
                                className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiCalendar className="text-gray-400" />
                            </div>
                            <input
                                type="date"
                                name="applicationDeadline"
                                required
                                value={formData.applicationDeadline}
                                onChange={handleChange}
                                className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assign Mentor</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiUser className="text-gray-400" />
                            </div>
                            <select
                                name="mentor"
                                required
                                value={formData.mentor}
                                onChange={handleChange}
                                disabled={loadingMentors}
                                className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                            >
                                <option value="">Select a mentor</option>
                                {mentors.map(mentor => (
                                    <option key={mentor._id} value={mentor._id}>
                                        {mentor.firstName} {mentor.lastName} ({mentor.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        {loadingMentors && <p className="text-xs text-gray-500 mt-1">Loading mentors...</p>}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                        </>
                    ) : (
                        <>
                            <FiSave className="mr-2 -ml-1 h-5 w-5" />
                            Save Internship
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
