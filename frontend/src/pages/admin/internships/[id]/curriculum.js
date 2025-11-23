import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import InternshipCurriculumManager from '@/components/admin/InternshipCurriculumManager';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';
import { FiArrowLeft } from 'react-icons/fi';

export default function CurriculumManagement() {
    const router = useRouter();
    const { id } = router.query;
    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchInternship();
        }
    }, [id]);

    const fetchInternship = async () => {
        try {
            const response = await apiClient.get(`/internships/${id}`);
            // The response contains internship data at the root level with modules nested
            const internshipData = response.data.data;
            
            // Fetch additional data needed for curriculum manager
            const modulesResponse = await apiClient.get(`/modules?internship=${id}`);
            const assignmentsResponse = await apiClient.get(`/assignments?internship=${id}`);
            const enrollmentsResponse = await apiClient.get(`/enrollments?internship=${id}`);
            
            const modules = modulesResponse.data.data || [];
            const assignments = assignmentsResponse.data.data || [];
            const enrollments = enrollmentsResponse.data.data || [];
            
            setInternship({
                internship: internshipData,
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
            });
        } catch (error) {
            console.error('Error fetching internship:', error);
            toast.error('Failed to load internship details');
        } finally {
            setLoading(false);
        }
    };

    const handleDataUpdate = (updatedData) => {
        if (updatedData.internship) {
            setInternship(updatedData.internship);
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
                <div className="flex items-center justify-between">
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
                </div>

                {/* Curriculum Manager */}
                {id && internship && (
                    <InternshipCurriculumManager 
                        internshipId={id}
                        role="admin"
                        canEdit={true}
                        onDataUpdate={handleDataUpdate}
                        initialData={internship}
                    />
                )}
            </div>
        </AdminLayout>
    );
}
