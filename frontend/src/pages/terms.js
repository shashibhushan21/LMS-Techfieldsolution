import Head from 'next/head';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BRAND } from '@/config/brand';
import { FiFileText } from 'react-icons/fi';

export default function Terms() {
  const lastUpdated = 'November 24, 2025';

  return (
    <>
      <Head>
        <title>Terms of Service - {BRAND.name}</title>
        <meta name="description" content="Terms of Service for TechFieldSolution LMS. Read our terms and conditions for using the platform." />
      </Head>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-16">
        <div className="container-custom text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-6">
            <FiFileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using our platform.
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
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using {BRAND.name} ("Platform," "Service," "we," "us," or "our"), you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Platform.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                We reserve the right to update these Terms at any time. Your continued use of the Platform after changes constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                2. User Accounts
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Account Creation</h3>
              <p className="text-gray-600 leading-relaxed">
                To access certain features, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Be responsible for all activities under your account</li>
                <li>Notify us immediately of unauthorized access</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Account Responsibilities</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>You must be at least 13 years old to create an account</li>
                <li>One person may not maintain more than one account</li>
                <li>You may not transfer your account to another person</li>
                <li>You are responsible for maintaining account confidentiality</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                3. Intellectual Property Rights
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 Platform Content</h3>
              <p className="text-gray-600 leading-relaxed">
                All content on the Platform, including courses, videos, text, graphics, logos, and software, is owned by {BRAND.name} or its licensors and is protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 Limited License</h3>
              <p className="text-gray-600 leading-relaxed">
                We grant you a limited, non-exclusive, non-transferable license to access and use the Platform for personal, non-commercial educational purposes. You may not:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                <li>Copy, modify, or distribute Platform content</li>
                <li>Reverse engineer or decompile any software</li>
                <li>Remove copyright or proprietary notices</li>
                <li>Use content for commercial purposes without permission</li>
                <li>Share your account credentials with others</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                4. User-Generated Content
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Your Content</h3>
              <p className="text-gray-600 leading-relaxed">
                You retain ownership of content you submit (assignments, projects, comments, etc.). By submitting content, you grant us a worldwide, royalty-free license to use, display, and distribute it in connection with the Platform.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Content Standards</h3>
              <p className="text-gray-600 leading-relaxed">
                All user-generated content must:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                <li>Be accurate and not misleading</li>
                <li>Not infringe on intellectual property rights</li>
                <li>Not contain harmful, offensive, or illegal material</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                5. Prohibited Conduct
              </h2>
              <p className="text-gray-600 leading-relaxed">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                <li>Use the Platform for any illegal purpose</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with Platform security features</li>
                <li>Attempt to gain unauthorized access</li>
                <li>Upload viruses or malicious code</li>
                <li>Scrape, crawl, or data mine the Platform</li>
                <li>Engage in fraudulent or deceptive practices</li>
                <li>Share assignment answers or cheat on assessments</li>
                <li>Use the Platform to spam or distribute unsolicited content</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                6. Payments and Refunds
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.1 Pricing</h3>
              <p className="text-gray-600 leading-relaxed">
                Some features and courses may require payment. Prices are displayed in Indian Rupees (INR) and are subject to change with notice.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.2 Refund Policy</h3>
              <p className="text-gray-600 leading-relaxed">
                We offer a 7-day money-back guarantee for paid courses. Refund requests must be submitted within 7 days of purchase and before completing more than 30% of the course content.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                7. Disclaimers
              </h2>
              <div className="p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                <p className="text-gray-700 font-semibold mb-2">THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES</p>
                <p className="text-gray-600 leading-relaxed">
                  We make no warranties regarding the Platform's availability, accuracy, or fitness for a particular purpose. We do not guarantee that the Platform will be error-free, secure, or uninterrupted.
                </p>
              </div>
              <p className="text-gray-600 leading-relaxed mt-4">
                We do not warrant that courses will result in employment, certification, or specific learning outcomes. Your results depend on your effort and circumstances.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                8. Limitation of Liability
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To the maximum extent permitted by law, {BRAND.name} shall not be liable for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Damages resulting from unauthorized access to your account</li>
                <li>Third-party content or services</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                Our total liability shall not exceed the amount you paid to us in the 12 months preceding the claim.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                9. Indemnification
              </h2>
              <p className="text-gray-600 leading-relaxed">
                You agree to indemnify and hold harmless {BRAND.name}, its officers, directors, employees, and agents from any claims, damages, or expenses arising from:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                <li>Your violation of these Terms</li>
                <li>Your use of the Platform</li>
                <li>Your infringement of any third-party rights</li>
                <li>Content you submit to the Platform</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                10. Termination
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.1 By You</h3>
              <p className="text-gray-600 leading-relaxed">
                You may terminate your account at any time by contacting support or using account settings.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.2 By Us</h3>
              <p className="text-gray-600 leading-relaxed">
                We may suspend or terminate your account if you violate these Terms, engage in prohibited conduct, or for any reason at our discretion. Upon termination:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                <li>Your right to access the Platform ceases immediately</li>
                <li>We may delete your account and content</li>
                <li>Certain provisions of these Terms survive termination</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                11. Governing Law and Dispute Resolution
              </h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms are governed by the laws of India. Any disputes shall be resolved through:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                <li>Good faith negotiation between parties</li>
                <li>Mediation if negotiation fails</li>
                <li>Binding arbitration under Indian Arbitration Act</li>
                <li>Jurisdiction in the courts of [Your City], India</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                12. Changes to Terms
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may modify these Terms at any time. We will notify you of material changes via email or Platform notification. Your continued use after changes constitutes acceptance.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                13. Miscellaneous
              </h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Severability:</strong> If any provision is unenforceable, the remaining provisions remain in effect</li>
                <li><strong>Waiver:</strong> Our failure to enforce any right does not waive that right</li>
                <li><strong>Assignment:</strong> You may not assign these Terms; we may assign them without restriction</li>
                <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and us</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                14. Contact Information
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you have questions about these Terms, please contact us:
              </p>
              <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-semibold mb-2">{BRAND.name}</p>
                <p className="text-gray-600">Email: <a href="mailto:legal@techfieldsolution.com" className="text-primary-600 hover:text-primary-700">legal@techfieldsolution.com</a></p>
                <p className="text-gray-600">Support: <a href="mailto:support@techfieldsolution.com" className="text-primary-600 hover:text-primary-700">support@techfieldsolution.com</a></p>
                <p className="text-gray-600">Address: 123 Learning Street, Tech City, TC 12345, India</p>
              </div>
            </section>

            <div className="p-6 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg mt-12">
              <p className="text-gray-700 leading-relaxed">
                <strong>By using {BRAND.name}, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</strong>
              </p>
            </div>

          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
