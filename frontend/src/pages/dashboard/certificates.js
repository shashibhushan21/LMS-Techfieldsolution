import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';
import { FiAward, FiDownload, FiCalendar, FiCheckCircle } from 'react-icons/fi';

export default function InternCertificates() {
  const { user } = useAuth();
  const router = useRouter();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'intern') {
      router.push('/dashboard');
      return;
    }
    if (user) {
      fetchCertificates();
    }
  }, [user]);

  const fetchCertificates = async () => {
    try {
      const response = await apiClient.get('/certificates');
      setCertificates(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      toast.error('Certificate PDF not available');
    }
  };

  if (loading) {
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
        <title>My Certificates - Dashboard</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg">
            <h1 className="text-2xl font-bold mb-1">My Certificates</h1>
            <p className="text-primary-100">View and download your earned certificates</p>
          </div>

          {/* Certificates Grid */}
          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate) => (
                <div
                  key={certificate._id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4">
                    <FiAward className="w-8 h-8 text-primary-600" />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                    {certificate.internship?.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <FiCalendar className="w-4 h-4" />
                      <span>Issued: {new Date(certificate.issueDate).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FiCheckCircle className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-3">
                      Certificate ID: {certificate.certificateId}
                    </p>

                    <button
                      onClick={() => handleDownload(certificate.pdfUrl)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      <FiDownload className="w-4 h-4" />
                      Download Certificate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <FiAward className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
              <p className="text-gray-500">
                Complete your internships to earn certificates
              </p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
