import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import ModuleForm from '@/components/admin/ModuleForm';
import AssignmentForm from '@/components/admin/AssignmentForm';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';
import {
    FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiMoreVertical,
    FiBook, FiFileText, FiCheckCircle, FiClock, FiX, FiChevronDown, FiChevronUp
} from 'react-icons/fi';

export default function CurriculumManagement() {
    const router = useRouter();
    const { id } = router.query;
    const [internship, setInternship] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null); // 'module' or 'assignment'
    const [editingItem, setEditingItem] = useState(null);
    const [activeModuleId, setActiveModuleId] = useState(null); // For adding assignment to specific module
    const [formLoading, setFormLoading] = useState(false);

    // Expanded modules state
    const [expandedModules, setExpandedModules] = useState({});

    useEffect(() => {
        if (id) {
            fetchInternship();
        }
    }, [id]);

    const fetchInternship = async () => {
        try {
            const response = await apiClient.get(`/internships/${id}`);
            setInternship(response.data.data);
            setModules(response.data.data.modules || []);

            // Expand all modules by default
            const initialExpanded = {};
            if (response.data.data.modules) {
                response.data.data.modules.forEach(m => {
                    initialExpanded[m._id] = true;
                });
            }
            setExpandedModules(initialExpanded);
        } catch (error) {
            console.error('Error fetching internship:', error);
            toast.error('Failed to load internship details');
        } finally {
            setLoading(false);
        }
    };

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    // Module Actions
    const handleCreateModule = () => {
        setEditingItem(null);
        setModalType('module');
        setShowModal(true);
    };

    const handleEditModule = (module) => {
        setEditingItem(module);
        setModalType('module');
        setShowModal(true);
    };

    const handleDeleteModule = async (moduleId) => {
        if (!confirm('Are you sure you want to delete this module? All assignments within it will also be deleted.')) return;
        try {
            await apiClient.delete(`/modules/${moduleId}`);
            toast.success('Module deleted successfully');
            fetchInternship();
        } catch (error) {
            console.error('Error deleting module:', error);
            toast.error('Failed to delete module');
        }
    };

    // Assignment Actions
    const handleCreateAssignment = (moduleId) => {
        setEditingItem(null);
        setActiveModuleId(moduleId);
        setModalType('assignment');
        setShowModal(true);
    };

    const handleEditAssignment = (assignment, moduleId) => {
        setEditingItem(assignment);
        setActiveModuleId(moduleId);
        setModalType('assignment');
        setShowModal(true);
    };

    const handleDeleteAssignment = async (assignmentId) => {
        if (!confirm('Are you sure you want to delete this assignment?')) return;
        try {
            await apiClient.delete(`/assignments/${assignmentId}`);
            toast.success('Assignment deleted successfully');
            fetchInternship();
        } catch (error) {
            console.error('Error deleting assignment:', error);
            toast.error('Failed to delete assignment');
        }
    };

    // Form Submission
    const handleFormSubmit = async (formData) => {
        setFormLoading(true);
        try {
            if (modalType === 'module') {
                if (editingItem) {
                    await apiClient.put(`/modules/${editingItem._id}`, formData);
                    toast.success('Module updated successfully');
                } else {
                    await apiClient.post('/modules', { ...formData, internship: id });
                    toast.success('Module created successfully');
                }
            } else if (modalType === 'assignment') {
                if (editingItem) {
                    await apiClient.put(`/assignments/${editingItem._id}`, formData);
                    toast.success('Assignment updated successfully');
                } else {
                    await apiClient.post('/assignments', {
                        ...formData,
                        module: activeModuleId,
                        internship: id
                    });
                    toast.success('Assignment created successfully');
                }
            }
            setShowModal(false);
            fetchInternship();
        } catch (error) {
            console.error(`Error saving ${modalType}:`, error);
            toast.error(error.response?.data?.message || `Failed to save ${modalType}`);
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Head>
                <title>Manage Curriculum - {internship?.title}</title>
            </Head>

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/internships"
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                            <FiArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Curriculum Management</h1>
                            <p className="text-sm text-gray-500">{internship?.title}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleCreateModule}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                        Add Module
                    </button>
                </div>

                {/* Modules List */}
                <div className="space-y-4">
                    {modules.length > 0 ? (
                        modules.map((module, index) => (
                            <div key={module._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                {/* Module Header */}
                                <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                    <div
                                        className="flex items-center gap-3 cursor-pointer flex-1"
                                        onClick={() => toggleModule(module._id)}
                                    >
                                        <button className="text-gray-500 hover:text-gray-700">
                                            {expandedModules[module._id] ? <FiChevronUp /> : <FiChevronDown />}
                                        </button>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                                <span className="text-gray-500 font-normal">Module {module.order || index + 1}:</span>
                                                {module.title}
                                                {!module.isPublished && (
                                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Draft</span>
                                                )}
                                            </h3>
                                            <p className="text-sm text-gray-500 line-clamp-1">{module.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEditModule(module)}
                                            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-white rounded-lg transition-colors"
                                            title="Edit Module"
                                        >
                                            <FiEdit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteModule(module._id)}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                                            title="Delete Module"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Assignments List */}
                                {expandedModules[module._id] && (
                                    <div className="p-4 bg-white">
                                        <div className="space-y-3">
                                            {module.assignments && module.assignments.length > 0 ? (
                                                module.assignments.map((assignment) => (
                                                    <div key={assignment._id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors group">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg ${assignment.isPublished ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                                <FiFileText className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                                                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                                                    <span className="capitalize">{assignment.type}</span>
                                                                    <span>•</span>
                                                                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                                                    {!assignment.isPublished && (
                                                                        <>
                                                                            <span>•</span>
                                                                            <span className="text-yellow-600 font-medium">Draft</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleEditAssignment(assignment, module._id)}
                                                                className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded transition-colors"
                                                            >
                                                                <FiEdit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteAssignment(assignment._id)}
                                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
                                                            >
                                                                <FiTrash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-400 italic text-center py-2">No assignments in this module</p>
                                            )}

                                            <button
                                                onClick={() => handleCreateAssignment(module._id)}
                                                className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all flex items-center justify-center gap-2"
                                            >
                                                <FiPlus className="w-4 h-4" />
                                                Add Assignment
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                            <FiBook className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No modules yet</h3>
                            <p className="mt-1 text-sm text-gray-500">Start building the curriculum by adding a module.</p>
                            <div className="mt-6">
                                <button
                                    onClick={handleCreateModule}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                                    Add Module
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in backdrop-blur-sm">
                        <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl border border-neutral-200 animate-scale-up max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 sticky top-0 bg-white z-10">
                                <h2 className="text-lg font-semibold text-neutral-900">
                                    {editingItem ? `Edit ${modalType === 'module' ? 'Module' : 'Assignment'}` : `Add New ${modalType === 'module' ? 'Module' : 'Assignment'}`}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6">
                                {modalType === 'module' ? (
                                    <ModuleForm
                                        initialData={editingItem}
                                        onSubmit={handleFormSubmit}
                                        onCancel={() => setShowModal(false)}
                                        loading={formLoading}
                                    />
                                ) : (
                                    <AssignmentForm
                                        initialData={editingItem}
                                        onSubmit={handleFormSubmit}
                                        onCancel={() => setShowModal(false)}
                                        loading={formLoading}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
