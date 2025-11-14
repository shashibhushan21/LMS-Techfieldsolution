import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FiBookOpen, FiUsers, FiAward, FiTrendingUp } from 'react-icons/fi';
import { BRAND } from '@/config/brand';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/ui/SectionHeader';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Head>
        <title>{`${BRAND.name} - Learning Management System`}</title>
        <meta name="description" content={`Join ${BRAND.name}'s internship programs and accelerate your career`} />
      </Head>

      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
                Transform Your Career with Expert-Led Internships
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Gain hands-on experience, build your portfolio, and earn industry-recognized certificates
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href={BRAND.urls.internships} variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-neutral-100">
                  Browse Internships
                </Button>
                {!isAuthenticated && (
                  <Button href={BRAND.urls.register} variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                    Get Started Free
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <SectionHeader align="center" title="Why Choose Our Platform?" subtitle="Learn with structure, mentorship, and real outcomes." className="mb-12" />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <FiBookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Structured Learning</h3>
                <p className="text-gray-600">
                  Access curated content, video lessons, and hands-on projects
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <FiUsers className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Mentorship</h3>
                <p className="text-gray-600">
                  Learn from industry professionals with real-world experience
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <FiAward className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Earn Certificates</h3>
                <p className="text-gray-600">
                  Get verified certificates to showcase your achievements
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <FiTrendingUp className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                <p className="text-gray-600">
                  Monitor your learning journey with detailed analytics
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom text-center">
            <SectionHeader align="center" title="Ready to Start Your Journey?" subtitle="Join thousands who leveled up with hands-on internships." className="mb-8" />
            <Button href={BRAND.urls.internships} size="lg">Explore Internships</Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
