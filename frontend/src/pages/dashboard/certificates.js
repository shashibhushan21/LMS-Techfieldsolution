import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import apiClient from '@/utils/apiClient';
import { FiAward, FiDownload, FiCalendar, FiShare2 } from 'react-icons/fi';

export default function MyCertificates() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
      } else {
        fetchCertificates();
      }
    }
  }, [user, authLoading]);

  const fetchCertificates = async () => {
    try {
      const response = await apiClient.get('/certificates/my-certificates');
      setCertificates(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (certificateId) => {
    // TODO: Implement certificate download
    console.log('Download certificate:', certificateId);
  };

  const handleShare = (certificate) => {
    // TODO: Implement certificate sharing
    console.log('Share certificate:', certificate);
  };

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
        <title>My Certificates - Dashboard</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-4">
          <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
            <h1 className="text-xl font-bold text-gray-900">My Certificates</h1>
            <p className="text-sm text-gray-600 mt-0.5">View and download your earned certificates</p>
          </div>

          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map((certificate) => (
                <div
                  key={certificate._id}
                  className="bg-gradient-to-br from-primary-50 to-white border-2 border-primary-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <FiAward className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900">{certificate.internship?.title}</h3>
                      <p className="text-xs text-gray-600">Certificate of Completion</p>
                    </div>
                  </div>

                  <div className="mb-3 pb-3 border-b border-primary-100">
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                      <FiCalendar className="w-3 h-3" />
                      <span>Issued: {new Date(certificate.issuedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Certificate ID: {certificate.certificateId || certificate._id.slice(-8)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(certificate._id)}
                      className="flex-1 btn btn-sm btn-primary flex items-center justify-center gap-1"
                    >
                      <FiDownload className="w-3.5 h-3.5" />
                      Download
                    </button>
                    <button
                      onClick={() => handleShare(certificate)}
                      className="btn btn-sm btn-secondary"
                      title="Share certificate"
                    >
                      <FiShare2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <FiAward className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-1">No certificates earned yet</p>
              <p className="text-sm text-gray-400 mb-4">
                Complete internships to earn certificates
              </p>
              <button
                onClick={() => router.push('/dashboard/internships')}
                className="btn btn-primary"
              >
                View My Internships
              </button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
