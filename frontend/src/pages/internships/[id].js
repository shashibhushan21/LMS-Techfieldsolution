import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';
import {
  FiClock,
  FiUsers,
  FiCalendar,
  FiBookOpen,
  FiAward,
  FiCheckCircle,
} from 'react-icons/fi';
import { BRAND } from '@/config/brand';
import Button from '@/components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function InternshipDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAuthenticated } = useAuth();
  const [internship, setInternship] = useState(null);
  const [modules, setModules] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInternshipDetails();
    }
  }, [id]);

  const fetchInternshipDetails = async () => {
    try {
      const [internshipRes, modulesRes] = await Promise.all([
        apiClient.get(`/internships/${id}`),
        apiClient.get(`/modules?internship=${id}`),
      ]);

      setInternship(internshipRes.data.data);
      setModules(modulesRes.data.data || []);

      // Check if user is enrolled
      if (isAuthenticated) {
        try {
          const enrollmentRes = await apiClient.get(`/enrollments/user/${user._id}`);
          const userEnrollment = enrollmentRes.data.data.find(
            (e) => e.internship._id === id
          );
          setEnrollment(userEnrollment);
        } catch (error) {
          // User not enrolled
        }
      }
    } catch (error) {
      console.error('Failed to fetch internship details:', error);
      toast.error('Failed to load internship details');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setEnrolling(true);
    try {
      const response = await apiClient.post('/enrollments', {
        internship: id,
      });
      setEnrollment(response.data.data);
      toast.success('Successfully enrolled! Your enrollment is pending approval.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </>
    );
  }

  if (!internship) {
    return (
      <>
        <Navbar />
        <div className="container-custom py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Internship not found</h1>
          <Link href="/internships" className="text-primary-600 hover:text-primary-700">
            ← Back to internships
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`${internship.title} - ${BRAND.name}`}</title>
        <meta name="description" content={internship.description} />
      </Head>

      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="container-custom">
            <div className="max-w-4xl">
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full">
                  {internship.category}
                </span>
                <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full">
                  {internship.level}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{internship.title}</h1>
              <p className="text-xl text-primary-100 mb-6">{internship.description}</p>

              <div className="flex flex-wrap gap-6 text-primary-100">
                <div className="flex items-center">
                  <FiClock className="w-5 h-5 mr-2" />
                  <span>{internship.duration} weeks</span>
                </div>
                <div className="flex items-center">
                  <FiBookOpen className="w-5 h-5 mr-2" />
                  <span>{modules.length} modules</span>
                </div>
                <div className="flex items-center">
                  <FiUsers className="w-5 h-5 mr-2" />
                  <span>{internship.enrollmentCount || 0} enrolled</span>
                </div>
                {internship.startDate && (
                  <div className="flex items-center">
                    <FiCalendar className="w-5 h-5 mr-2" />
                    <span>Starts {new Date(internship.startDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>About This Internship</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-line">{internship.fullDescription || internship.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Outcomes */}
              {internship.learningOutcomes && internship.learningOutcomes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>What You'll Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {internship.learningOutcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start">
                          <FiCheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Curriculum */}
              <Card>
                <CardHeader>
                  <CardTitle>Curriculum</CardTitle>
                </CardHeader>
                <CardContent>
                  {modules.length > 0 ? (
                    <div className="space-y-4">
                      {modules.map((module, index) => (
                        <div
                          key={module._id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">
                                Module {index + 1}: {module.title}
                              </h3>
                              <p className="text-sm text-gray-600">{module.description}</p>
                            </div>
                            {module.duration && (
                              <span className="text-sm text-gray-500 ml-4">
                                {module.duration} hours
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No modules available yet</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardContent className="p-6">
                {/* Enrollment Status */}
                {enrollment ? (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          enrollment.status === 'approved' || enrollment.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : enrollment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {enrollment.status}
                      </span>
                    </div>
                    {enrollment.status === 'approved' || enrollment.status === 'active' ? (
                      <Button href="/dashboard" className="w-full">Go to Dashboard</Button>
                    ) : (
                      <p className="text-sm text-gray-600">
                        Your enrollment is pending approval. You'll be notified once approved.
                      </p>
                    )}
                  </div>
                ) : (
                  <Button onClick={handleEnroll} disabled={enrolling} className="w-full mb-6">
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </Button>
                )}

                {/* Mentor Info */}
                {internship.mentor && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Your Mentor</h3>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-lg">
                          {internship.mentor.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{internship.mentor.name}</p>
                        <p className="text-sm text-gray-500">{internship.mentor.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Certificate */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <div className="flex items-center text-gray-700 mb-2">
                    <FiAward className="w-5 h-5 mr-2 text-primary-600" />
                    <span className="font-medium">Certificate of Completion</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Earn a verified certificate upon successful completion
                  </p>
                </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
