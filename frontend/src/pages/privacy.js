import Head from 'next/head';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BRAND } from '@/config/brand';
import { FiShield } from 'react-icons/fi';

export default function Privacy() {
  const lastUpdated = 'November 24, 2025';

  return (
    <>
      <Head>
        <title>Privacy Policy - {BRAND.name}</title>
        <meta name="description" content="Privacy Policy for TechFieldSolution LMS. Learn how we collect, use, and protect your personal information." />
      </Head>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-16">
        <div className="container-custom text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-6">
            <FiShield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we handle your data.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="bg-white py-16">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none">
            
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                1. Introduction
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Welcome to {BRAND.name} ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to it.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                By using our Learning Management System (LMS), you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                2. Information We Collect
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-600 leading-relaxed">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                <li>Create an account (name, email, password)</li>
                <li>Complete your profile (bio, avatar, social links)</li>
                <li>Enroll in internship programs</li>
                <li>Submit assignments and projects</li>
                <li>Communicate with mentors or support</li>
                <li>Participate in discussions and forums</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Device information (browser type, OS, device ID)</li>
                <li>Usage data (pages visited, time spent, features used)</li>
                <li>IP address and location data</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.3 Educational Data</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Course enrollment and progress</li>
                <li>Assignment submissions and grades</li>
                <li>Quiz and assessment results</li>
                <li>Certificate achievements</li>
                <li>Interaction with learning materials</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                3. How We Use Your Information
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We use the collected information for various purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                <li>To provide and maintain our LMS platform</li>
                <li>To personalize your learning experience</li>
                <li>To process enrollments and track progress</li>
                <li>To communicate with you about courses, updates, and support</li>
                <li>To generate certificates upon course completion</li>
                <li>To improve our platform and develop new features</li>
                <li>To ensure platform security and prevent fraud</li>
                <li>To comply with legal obligations</li>
                <li>To send marketing communications (with your consent)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                4. Information Sharing and Disclosure
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 With Your Consent</h3>
              <p className="text-gray-600 leading-relaxed">
                We share information when you explicitly consent to it, such as featuring your project in our showcase.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Service Providers</h3>
              <p className="text-gray-600 leading-relaxed">
                We work with third-party service providers who assist us in operating our platform:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                <li>Cloud hosting services (AWS, Google Cloud)</li>
                <li>Email delivery services (SendGrid, Mailchimp)</li>
                <li>Analytics providers (Google Analytics)</li>
                <li>Payment processors (Stripe, PayPal)</li>
                <li>Content delivery networks (Cloudinary)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.3 Legal Requirements</h3>
              <p className="text-gray-600 leading-relaxed">
                We may disclose your information if required by law or in response to valid requests by public authorities.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                5. Data Security
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and assessments</li>
                <li>Access controls and authentication</li>
                <li>Secure backup and disaster recovery</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                6. Your Privacy Rights
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Request limitation of data processing</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                To exercise these rights, please contact us at <a href="mailto:privacy@techfieldsolution.com" className="text-primary-600 hover:text-primary-700">privacy@techfieldsolution.com</a>.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                7. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies and similar technologies to enhance your experience. You can control cookie preferences through your browser settings. For more details, see our <a href="/cookies" className="text-primary-600 hover:text-primary-700">Cookie Policy</a>.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                8. Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-semibold mb-2">{BRAND.name}</p>
                <p className="text-gray-600">Email: <a href="mailto:privacy@techfieldsolution.com" className="text-primary-600 hover:text-primary-700">privacy@techfieldsolution.com</a></p>
                <p className="text-gray-600">Address: 123 Learning Street, Tech City, TC 12345, India</p>
              </div>
            </section>

          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
