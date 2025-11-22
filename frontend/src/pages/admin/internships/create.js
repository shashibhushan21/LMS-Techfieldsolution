import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layout/AdminLayout';
import InternshipForm from '@/components/admin/InternshipForm';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function CreateInternship() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            await apiClient.post('/internships', formData);
            toast.success('Internship created successfully');
            router.push('/admin/internships');
        } catch (error) {
            console.error('Error creating internship:', error);
            toast.error(error.response?.data?.message || 'Failed to create internship');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <Head>
                <title>Create Internship - TechFieldSolution LMS</title>
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
                        <h1 className="text-2xl font-bold text-gray-900">Create New Internship</h1>
                        <p className="text-sm text-gray-500">Set up a new internship program and assign a mentor</p>
                    </div>
                </div>

                <InternshipForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </AdminLayout>
    );
}
