import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Avatar from '@/components/ui/Avatar';
import apiClient from '@/utils/apiClient';
import { FiMail, FiBookOpen, FiTrendingUp } from 'react-icons/fi';

export default function MentorStudents() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const fetchStudents = async () => {
    try {
      const response = await apiClient.get('/mentors/students');
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
        <div className="space-y-4">
          <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
            <h1 className="text-xl font-bold text-gray-900">My Interns</h1>
            <p className="text-sm text-gray-600 mt-0.5">Manage and track intern progress</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
            <input
              type="text"
              placeholder="Search interns by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <div key={student._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar name={`${student.firstName} ${student.lastName}`} size="md" />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiBookOpen className="w-3.5 h-3.5" />
                      <span>{student.enrollmentCount || 0} Active Internships</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiTrendingUp className="w-3.5 h-3.5" />
                      <span>Avg. Score: {student.averageScore || 'N/A'}%</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => router.push(`/mentor/students/${student._id}`)}
                      className="flex-1 btn btn-sm btn-primary"
                    >
                      View Profile
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      title="Send message"
                    >
                      <FiMail className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">
                {searchTerm ? 'No interns found matching your search' : 'No interns assigned yet'}
              </p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
