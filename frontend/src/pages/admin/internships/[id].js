import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layout/AdminLayout';
import InternshipForm from '@/components/admin/InternshipForm';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function EditInternship() {
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [internship, setInternship] = useState(null);

    useEffect(() => {
        if (id) {
            fetchInternship();
        }
    }, [id]);

    const fetchInternship = async () => {
        try {
            const response = await apiClient.get(`/internships/${id}`);
            setInternship(response.data.data);
        } catch (error) {
            console.error('Error fetching internship:', error);
            toast.error('Failed to load internship details');
            router.push('/admin/internships');
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            await apiClient.put(`/internships/${id}`, formData);
            toast.success('Internship updated successfully');
            router.push('/admin/internships');
        } catch (error) {
            console.error('Error updating internship:', error);
            toast.error(error.response?.data?.message || 'Failed to update internship');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
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
                <title>Edit Internship - TechFieldSolution LMS</title>
            </Head>

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/internships"
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                        <FiArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Internship</h1>
                        <p className="text-sm text-gray-500">Update internship details and settings</p>
                    </div>
                </div>

                <InternshipForm initialData={internship} onSubmit={handleSubmit} loading={loading} />
            </div>
        </AdminLayout>
    );
}
