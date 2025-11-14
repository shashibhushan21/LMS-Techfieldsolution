import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import apiClient from '@/utils/apiClient';
import { FiClock, FiUsers, FiCalendar, FiBookOpen } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/ui/SectionHeader';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

export default function Internships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    category: '',
    level: '',
    search: '',
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      if (filter.level) params.append('level', filter.level);
      if (filter.search) params.append('search', filter.search);

      const response = await apiClient.get(`/internships?${params.toString()}`);
      setInternships(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInternships();
  };

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
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                name="search"
                placeholder="Search internships..."
                value={filter.search}
                onChange={handleFilterChange}
                className="input"
              />
              <select
                name="category"
                value={filter.category}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All Categories</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Data Science">Data Science</option>
                <option value="AI/ML">AI/ML</option>
                <option value="DevOps">DevOps</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="UI/UX Design">UI/UX Design</option>
              </select>
              <select
                name="level"
                value={filter.level}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <Button type="submit">Search</Button>
            </form>
          </div>

          {/* Internships Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
                        <CardTitle>{internship.title}</CardTitle>
                        <CardDescription>{internship.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FiClock className="w-4 h-4 mr-2" />
                            <span>{internship.duration} weeks</span>
                          </div>
                          <div className="flex items-center">
                            <FiBookOpen className="w-4 h-4 mr-2" />
                            <span>{internship.moduleCount || 0} modules</span>
                          </div>
                          <div className="flex items-center">
                            <FiUsers className="w-4 h-4 mr-2" />
                            <span>{internship.enrollmentCount || 0} enrolled</span>
                          </div>
                          <div className="flex items-center">
                            <FiCalendar className="w-4 h-4 mr-2" />
                            <span>
                              {internship.startDate
                                ? new Date(internship.startDate).toLocaleDateString()
                                : 'Flexible'}
                            </span>
                          </div>
                        </div>
                        {internship.mentor && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                              Mentor: <span className="font-medium">{internship.mentor.name}</span>
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
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">No internships found</p>
              <p className="text-gray-400 mt-2">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
