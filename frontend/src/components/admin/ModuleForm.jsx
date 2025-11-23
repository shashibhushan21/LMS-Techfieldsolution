import { useState, useEffect } from 'react';
import { FiSave, FiX, FiType, FiAlignLeft, FiHash, FiClock } from 'react-icons/fi';

export default function ModuleForm({ initialData, onSubmit, onCancel, loading }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        order: 0,
        duration: { hours: 0, minutes: 0 },
        isPublished: false,
        ...initialData
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                duration: initialData.duration || { hours: 0, minutes: 0 }
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: type === 'number' ? parseInt(value) : value }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Module Title</label>
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
                        placeholder="e.g. Introduction to React"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                        <FiAlignLeft className="text-gray-400" />
                    </div>
                    <textarea
                        name="description"
                        required
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Brief description of what this module covers..."
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiHash className="text-gray-400" />
                        </div>
                        <input
                            type="number"
                            name="order"
                            required
                            min="0"
                            value={formData.order}
                            onChange={handleChange}
                            className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Hours)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiClock className="text-gray-400" />
                        </div>
                        <input
                            type="number"
                            name="duration.hours"
                            min="0"
                            value={formData.duration.hours}
                            onChange={handleChange}
                            className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center">
                <input
                    id="isPublished"
                    name="isPublished"
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                    Publish Module (visible to interns)
                </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : (
                        <>
                            <FiSave className="mr-2 -ml-1 h-4 w-4" />
                            Save Module
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
