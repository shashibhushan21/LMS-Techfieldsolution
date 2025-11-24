import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import apiClient from '@/utils/apiClient';
import { FiMail, FiBookOpen, FiTrendingUp, FiSearch } from 'react-icons/fi';
import {
  SectionHeader,
  Card,
  CardContent,
  Avatar,
  Button,
  LoadingSpinner,
  FormInput
} from '@/components/ui';
import { useApiCall } from '@/hooks/useCommon';

export default function MentorStudents() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: students, loading, execute: fetchStudents } = useApiCall(
    () => apiClient.get('/mentors/students'),
    {
      initialData: [],
      errorMessage: 'Failed to fetch students'
    }
  );

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
      } else if (user.role !== 'mentor') {
        router.push('/dashboard');
      } else {
        fetchStudents();
      }
    }
  }, [user, authLoading]);

  const filteredStudents = students.filter(student => {
    const search = searchTerm.toLowerCase();
    return (
      student.firstName?.toLowerCase().includes(search) ||
      student.lastName?.toLowerCase().includes(search) ||
      student.email?.toLowerCase().includes(search)
    );
  });

  if (authLoading || loading) {
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
        <title>My Interns - Mentor Dashboard</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          <SectionHeader
            title="My Interns"
            subtitle="Manage and track intern progress"
          />

          <Card>
            <CardContent className="p-4">
              <FormInput
                icon={FiSearch}
                placeholder="Search interns by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-0"
              />
            </CardContent>
          </Card>

          {filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <Card key={student._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar name={`${student.firstName} ${student.lastName}`} size="md" />
                      <div>
                        <h3 className="text-base font-bold text-gray-900">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-6">
                      <div className="flex items-center gap-2">
                        <FiBookOpen className="w-4 h-4 text-primary-500" />
                        <span>{student.enrollmentCount || 0} Active Internships</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiTrendingUp className="w-4 h-4 text-primary-500" />
                        <span>Avg. Score: {student.averageScore || 'N/A'}%</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/mentor/students/${student._id}`)}
                      >
                        View Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        title="Send message"
                        onClick={() => router.push(`/dashboard/messages?user=${student._id}`)}
                      >
                        <FiMail className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">
                  {searchTerm ? 'No interns found matching your search' : 'No interns assigned yet'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
