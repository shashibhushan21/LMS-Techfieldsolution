import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import apiClient from '@/utils/apiClient';
import { useAuth } from '@/context/AuthContext';
import { FiClock, FiUsers, FiCalendar, FiBookOpen, FiSearch } from 'react-icons/fi';
import {
  SectionHeader,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  LoadingSpinner,
  FormInput,
  FormSelect
} from '@/components/ui';
import { useApiCall } from '@/hooks/useCommon';

export default function Internships() {
  const [filter, setFilter] = useState({
    category: '',
    level: '',
    search: '',
  });
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const { data: internships, loading, execute: fetchInternships } = useApiCall(
    () => {
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      if (filter.level) params.append('level', filter.level);
      if (filter.search) params.append('search', filter.search);
      return apiClient.get(`/internships?${params.toString()}`);
    },
    {
      initialData: [],
      errorMessage: 'Failed to fetch internships',
      dependencies: [] // Manual trigger for search
    }
  );

  useEffect(() => {
    // Check if user is intern and redirect them
    if (isAuthenticated && user && user.role === 'intern') {
      router.push('/dashboard');
    } else {
      fetchInternships();
    }
  }, [isAuthenticated, user, router]);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInternships();
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Mobile Development', label: 'Mobile Development' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'AI/ML', label: 'AI/ML' },
    { value: 'DevOps', label: 'DevOps' },
    { value: 'Cybersecurity', label: 'Cybersecurity' },
    { value: 'UI/UX Design', label: 'UI/UX Design' },
  ];

  const levelOptions = [
    { value: '', label: 'All Levels' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
  ];

  return (
    <>
      <Head>
        <title>Browse Internships - TechFieldSolution LMS</title>
        <meta name="description" content="Explore our internship programs and start your learning journey" />
      </Head>

      <Navbar />

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom">
          {/* Header */}
          <SectionHeader
            title="Browse Internships"
            subtitle="Discover hands-on learning opportunities across various domains"
            className="mb-8"
          />

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <FormInput
                  name="search"
                  placeholder="Search internships..."
                  value={filter.search}
                  onChange={handleFilterChange}
                  icon={FiSearch}
                  className="mb-0"
                />
                <FormSelect
                  name="category"
                  value={filter.category}
                  onChange={handleFilterChange}
                  options={categoryOptions}
                  className="mb-0"
                />
                <FormSelect
                  name="level"
                  value={filter.level}
                  onChange={handleFilterChange}
                  options={levelOptions}
                  className="mb-0"
                />
                <Button type="submit" className="w-full">Search</Button>
              </form>
            </CardContent>
          </Card>

          {/* Internships Grid */}
          {loading ? (
            <div className="flex-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : internships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {internships.map((internship) => (
                <Link key={internship._id} href={`/internships/${internship._id}`}>
                  <div className="cursor-pointer h-full group">
                    <Card className="overflow-hidden h-full transition-shadow group-hover:shadow-md">
                      {internship.thumbnailUrl && (
                        <img
                          src={internship.thumbnailUrl}
                          alt={internship.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-3 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full">
                            {internship.category}
                          </span>
                          <span className="text-xs text-gray-500">{internship.level}</span>
                        </div>
                        <CardTitle className="text-xl mb-2">{internship.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{internship.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <FiClock className="w-4 h-4 mr-2 text-primary-500" />
                            <span>
                              {typeof internship.duration === 'object'
                                ? `${internship.duration.weeks || 0} weeks`
                                : `${internship.duration} weeks`}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FiBookOpen className="w-4 h-4 mr-2 text-primary-500" />
                            <span>{internship.moduleCount || 0} modules</span>
                          </div>
                          <div className="flex items-center">
                            <FiUsers className="w-4 h-4 mr-2 text-primary-500" />
                            <span>{internship.enrollmentCount || 0} enrolled</span>
                          </div>
                          <div className="flex items-center">
                            <FiCalendar className="w-4 h-4 mr-2 text-primary-500" />
                            <span>
                              {internship.startDate
                                ? new Date(internship.startDate).toLocaleDateString()
                                : 'Flexible'}
                            </span>
                          </div>
                        </div>
                        {internship.mentor && (
                          <div className="pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                              Mentor: <span className="font-medium text-gray-900">{internship.mentor.name}</span>
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 text-lg">No internships found</p>
                <p className="text-gray-400 mt-2">Try adjusting your search filters</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
