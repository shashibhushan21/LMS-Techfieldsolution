import { useState, useEffect } from 'react';
import ModuleForm from '@/components/admin/ModuleForm';
import AssignmentForm from '@/components/admin/AssignmentForm';
import Avatar from '@/components/ui/Avatar';
import apiClient from '@/utils/apiClient';
import { 
  FiUsers, FiFileText, FiBook, FiPlus, FiEdit2, FiTrash2, 
  FiCheckCircle, FiClock, FiX, FiChevronDown, FiChevronUp,
  FiTrendingUp
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export default function InternshipCurriculumManager({ 
  internshipId, 
  role = 'admin', // 'admin' or 'mentor'
  canEdit = true,
  onDataUpdate,
  initialData = null
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    if (internshipId && !initialData) {
      fetchInternshipData();
    } else if (initialData) {
      // Process initial data
      processData(initialData);
    }
  }, [internshipId, initialData]);

  const processData = (responseData) => {
    // Group assignments by module
    const modules = responseData.modules || [];
    const assignments = responseData.assignments || [];
    
    // Attach assignments to their respective modules
    const modulesWithAssignments = modules.map(module => ({
      ...module,
      assignments: assignments.filter(a => a.module?.toString() === module._id.toString())
    }));

    // Ensure internship is at the top level
    const processedData = {
      internship: responseData.internship || responseData,
      modules: modulesWithAssignments,
      assignments: assignments,
      enrollments: responseData.enrollments || [],
      stats: responseData.stats || {}
    };

    setData(processedData);

    // Auto-expand all modules
    if (modulesWithAssignments.length > 0) {
      const expanded = {};
      modulesWithAssignments.forEach(m => { expanded[m._id] = true; });
      setExpandedModules(expanded);
    }
  };

  useEffect(() => {
    if (internshipId) {
      fetchInternshipData();
    }
  }, [internshipId]);

  const fetchInternshipData = async () => {
    try {
      const endpoint = role === 'mentor' 
        ? `/mentors/internships/${internshipId}`
        : `/internships/${internshipId}`;
      
      const response = await apiClient.get(endpoint);
      const responseData = response.data.data;

      // For mentor, data comes structured, for admin we need to fetch additional data
      if (role === 'admin') {
        // Fetch modules, assignments, and enrollments separately for admin
        const [modulesRes, assignmentsRes, enrollmentsRes] = await Promise.all([
          apiClient.get(`/modules?internship=${internshipId}`),
          apiClient.get(`/assignments?internship=${internshipId}`),
          apiClient.get(`/enrollments?internship=${internshipId}`)
        ]);

        const modules = modulesRes.data.data || [];
        const assignments = assignmentsRes.data.data || [];
        const enrollments = enrollmentsRes.data.data || [];

        const fullData = {
          internship: responseData,
          modules,
          assignments,
          enrollments,
          stats: {
            totalStudents: enrollments.length,
            activeStudents: enrollments.filter(e => e.status === 'active').length,
            completedStudents: enrollments.filter(e => e.status === 'completed').length,
            totalModules: modules.length,
            totalAssignments: assignments.length
          }
        };

        processData(fullData);
      } else {
        // Mentor data comes pre-structured
        processData(responseData);
      }

      // Call onDataUpdate after processData has set the data
      if (onDataUpdate) {
        // Use responseData directly since state update is async
        onDataUpdate(responseData);
      }
    } catch (error) {
      console.error('Failed to fetch internship data:', error);
      toast.error('Failed to load internship data');
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

  const handleCreateModule = () => {
    if (!canEdit) return;
    setEditingItem(null);
    setModalType('module');
    setShowModal(true);
  };

  const handleEditModule = (module) => {
    if (!canEdit) return;
    setEditingItem(module);
    setModalType('module');
    setShowModal(true);
  };

  const handleDeleteModule = async (moduleId) => {
    if (!canEdit) return;
    if (!confirm('Are you sure you want to delete this module? All assignments within it will also be deleted.')) return;
    
    try {
      await apiClient.delete(`/modules/${moduleId}`);
      toast.success('Module deleted successfully');
      fetchInternshipData();
    } catch (error) {
      console.error('Error deleting module:', error);
      toast.error('Failed to delete module');
    }
  };

  const handlePublishModule = async (moduleId, currentStatus) => {
    if (!canEdit) return;
    
    try {
      await apiClient.patch(`/modules/${moduleId}/publish`, {
        isPublished: !currentStatus
      });
      toast.success(`Module ${!currentStatus ? 'published' : 'unpublished'} successfully`);
      fetchInternshipData();
    } catch (error) {
      console.error('Failed to update module status:', error);
      toast.error('Failed to update module status');
    }
  };

  const handleCreateAssignment = (moduleId) => {
    if (!canEdit) return;
    setEditingItem(null);
    setActiveModuleId(moduleId);
    setModalType('assignment');
    setShowModal(true);
  };

  const handleEditAssignment = (assignment, moduleId) => {
    if (!canEdit) return;
    setEditingItem(assignment);
    setActiveModuleId(moduleId);
    setModalType('assignment');
    setShowModal(true);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!canEdit) return;
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    
    try {
      await apiClient.delete(`/assignments/${assignmentId}`);
      toast.success('Assignment deleted successfully');
      fetchInternshipData();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast.error('Failed to delete assignment');
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (modalType === 'module') {
        if (editingItem) {
          await apiClient.put(`/modules/${editingItem._id}`, formData);
          toast.success('Module updated successfully');
        } else {
          await apiClient.post('/modules', { ...formData, internship: internshipId });
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
            internship: internshipId
          });
          toast.success('Assignment created successfully');
        }
      }
      setShowModal(false);
      setEditingItem(null);
      setActiveModuleId(null);
      fetchInternshipData();
    } catch (error) {
      console.error(`Error saving ${modalType}:`, error);
      toast.error(error.response?.data?.message || `Failed to save ${modalType}`);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load internship data</p>
      </div>
    );
  }

  const { internship, modules = [], assignments = [], enrollments = [], stats = {} } = data;

  // Define tabs based on role
  const tabs = role === 'mentor' 
    ? [
        { id: 'overview', label: 'Overview', icon: FiBook },
        { id: 'curriculum', label: 'Curriculum', icon: FiFileText },
        { id: 'assignments', label: 'Assignments', icon: FiFileText },
        { id: 'interns', label: 'Interns', icon: FiUsers }
      ]
    : [
        { id: 'overview', label: 'Overview', icon: FiBook },
        { id: 'curriculum', label: 'Curriculum', icon: FiFileText },
        { id: 'assignments', label: 'Assignments', icon: FiFileText },
        { id: 'enrollments', label: 'Enrollments', icon: FiUsers }
      ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total {role === 'mentor' ? 'Interns' : 'Students'}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents || 0}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active {role === 'mentor' ? 'Interns' : 'Students'}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeStudents || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedStudents || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiClock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Internship Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Domain</p>
                    <p className="font-medium text-gray-900">{internship.domain}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Level</p>
                    <p className="font-medium text-gray-900 capitalize">{internship.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">
                      {internship.duration?.weeks ? `${internship.duration.weeks} weeks` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      internship.status === 'open' ? 'bg-green-100 text-green-800' :
                      internship.status === 'closed' ? 'bg-red-100 text-red-800' :
                      internship.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {internship.status ? internship.status.charAt(0).toUpperCase() + internship.status.slice(1) : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>

              {internship.learningObjectives && internship.learningObjectives.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Learning Objectives</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {internship.learningObjectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              )}

              {internship.prerequisites && internship.prerequisites.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Prerequisites</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {internship.prerequisites.map((prerequisite, index) => (
                      <li key={index}>{prerequisite}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Curriculum Tab */}
          {activeTab === 'curriculum' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Modules</h3>
                {canEdit && (
                  <button
                    onClick={handleCreateModule}
                    className="btn btn-sm btn-primary inline-flex items-center gap-2"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Module
                  </button>
                )}
              </div>

              {modules && modules.length > 0 ? (
                <div className="space-y-3">
                  {modules.map((module, index) => (
                    <div key={module._id} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                      <div className="p-4 flex items-center justify-between bg-white border-b border-gray-200">
                        <div
                          className="flex items-center gap-3 cursor-pointer flex-1"
                          onClick={() => toggleModule(module._id)}
                        >
                          <button className="text-gray-500 hover:text-gray-700">
                            {expandedModules[module._id] ? <FiChevronUp /> : <FiChevronDown />}
                          </button>
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                              <span className="text-gray-500 font-normal">Module {module.order || index + 1}:</span>
                              {module.title}
                              {!module.isPublished && (
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Draft</span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-1">{module.description}</p>
                          </div>
                        </div>
                        {canEdit && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handlePublishModule(module._id, module.isPublished)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title={module.isPublished ? 'Unpublish' : 'Publish'}
                            >
                              <FiCheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditModule(module)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteModule(module._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {expandedModules[module._id] && (
                        <div className="p-4 space-y-3">
                          {module.assignments && module.assignments.length > 0 ? (
                            module.assignments.map((assignment) => (
                              <div key={assignment._id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors group">
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
                                {canEdit && (
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
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-400 italic text-center py-2">No assignments in this module</p>
                          )}

                          {canEdit && (
                            <button
                              onClick={() => handleCreateAssignment(module._id)}
                              className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all flex items-center justify-center gap-2"
                            >
                              <FiPlus className="w-4 h-4" />
                              Add Assignment
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <FiBook className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No modules yet</p>
                  {canEdit && (
                    <button onClick={handleCreateModule} className="btn btn-sm btn-primary">
                      Create First Module
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">All Assignments</h3>
              </div>

              {assignments && assignments.length > 0 ? (
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div key={assignment._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                          <div className="mt-3 flex gap-4 text-xs text-gray-500">
                            <span>Points: {assignment.totalPoints}</span>
                            {assignment.dueDate && (
                              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                            )}
                            {assignment.module && (
                              <span>Module: {assignment.module.title}</span>
                            )}
                          </div>
                        </div>
                        {canEdit && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditAssignment(assignment, assignment.module?._id)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAssignment(assignment._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No assignments yet</p>
                </div>
              )}
            </div>
          )}

          {/* Interns/Enrollments Tab */}
          {(activeTab === 'interns' || activeTab === 'enrollments') && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Enrolled {role === 'mentor' ? 'Interns' : 'Students'}
              </h3>

              {enrollments && enrollments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {role === 'mentor' ? 'Intern' : 'Student'}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enrolled</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {enrollments.map((enrollment) => (
                        <tr key={enrollment._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar 
                                name={`${enrollment.user?.firstName} ${enrollment.user?.lastName}`}
                                src={enrollment.user?.avatar}
                                size="sm"
                              />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {enrollment.user?.firstName} {enrollment.user?.lastName}
                                </p>
                                <p className="text-xs text-gray-500">{enrollment.user?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(enrollment.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                                <div 
                                  className="bg-primary-600 h-2 rounded-full"
                                  style={{ width: `${enrollment.progressPercentage || 0}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600">{enrollment.progressPercentage || 0}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              enrollment.status === 'active' ? 'bg-green-100 text-green-800' :
                              enrollment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {enrollment.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {enrollment.user?._id ? (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const route = role === 'mentor' 
                                    ? `/mentor/students/${enrollment.user._id}`
                                    : `/admin/users/${enrollment.user._id}`;
                                  router.push(route);
                                }}
                                className="text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer"
                              >
                                View Profile
                              </button>
                            ) : (
                              <span className="text-sm font-medium text-gray-400 cursor-not-allowed">
                                View Profile
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No {role === 'mentor' ? 'interns' : 'students'} enrolled yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingItem ? `Edit ${modalType === 'module' ? 'Module' : 'Assignment'}` : `Add New ${modalType === 'module' ? 'Module' : 'Assignment'}`}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    setActiveModuleId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              {modalType === 'module' ? (
                <ModuleForm
                  initialData={editingItem}
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowModal(false);
                    setEditingItem(null);
                  }}
                  loading={formLoading}
                />
              ) : (
                <AssignmentForm
                  initialData={editingItem}
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    setActiveModuleId(null);
                  }}
                  loading={formLoading}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
