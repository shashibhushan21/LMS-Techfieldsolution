import Head from 'next/head';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BRAND } from '@/config/brand';
import { FiAlertCircle } from 'react-icons/fi';

export default function Cookies() {
  const lastUpdated = 'November 24, 2025';

  return (
    <>
      <Head>
        <title>Cookie Policy - {BRAND.name}</title>
        <meta name="description" content="Cookie Policy for TechFieldSolution LMS. Learn how we use cookies and tracking technologies." />
      </Head>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-16">
        <div className="container-custom text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-6">
            <FiAlertCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cookie Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Understand how we use cookies and similar technologies on our platform.
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
                1. What Are Cookies?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and provide a better user experience.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Cookies allow websites to recognize your device and remember information about your visit, such as your preferences, login status, and browsing history.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                2. How We Use Cookies
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {BRAND.name} uses cookies to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                <li>Keep you signed in to your account</li>
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our platform</li>
                <li>Improve platform performance and user experience</li>
                <li>Provide personalized content and recommendations</li>
                <li>Analyze traffic and usage patterns</li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                3. Types of Cookies We Use
              </h2>
              
              <div className="space-y-8 mt-6">
                {/* Essential Cookies */}
                <div className="border-l-4 border-green-500 pl-6 py-2">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Essential Cookies (Required)</h3>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    These cookies are necessary for the platform to function and cannot be disabled.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mt-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-gray-700">Cookie Name</th>
                          <th className="text-left py-2 text-gray-700">Purpose</th>
                          <th className="text-left py-2 text-gray-700">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600">
                        <tr className="border-b border-gray-100">
                          <td className="py-2 font-mono text-xs">auth_token</td>
                          <td className="py-2">Maintains your login session</td>
                          <td className="py-2">7 days</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 font-mono text-xs">csrf_token</td>
                          <td className="py-2">Protects against CSRF attacks</td>
                          <td className="py-2">Session</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono text-xs">cookie_consent</td>
                          <td className="py-2">Stores your cookie preferences</td>
                          <td className="py-2">1 year</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="border-l-4 border-blue-500 pl-6 py-2">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Analytics Cookies (Optional)</h3>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    These cookies help us understand how visitors interact with our platform by collecting and reporting information anonymously.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mt-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-gray-700">Cookie Name</th>
                          <th className="text-left py-2 text-gray-700">Purpose</th>
                          <th className="text-left py-2 text-gray-700">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600">
                        <tr className="border-b border-gray-100">
                          <td className="py-2 font-mono text-xs">_ga</td>
                          <td className="py-2">Google Analytics - user identification</td>
                          <td className="py-2">2 years</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 font-mono text-xs">_gid</td>
                          <td className="py-2">Google Analytics - session tracking</td>
                          <td className="py-2">24 hours</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono text-xs">_gat</td>
                          <td className="py-2">Google Analytics - throttling requests</td>
                          <td className="py-2">1 minute</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="border-l-4 border-purple-500 pl-6 py-2">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Functional Cookies (Optional)</h3>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    These cookies enable enhanced functionality and personalization.
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Language preferences</li>
                    <li>Theme settings (light/dark mode)</li>
                    <li>Dashboard layout preferences</li>
                    <li>Recently viewed courses</li>
                  </ul>
                </div>

                {/* Marketing Cookies */}
                <div className="border-l-4 border-orange-500 pl-6 py-2">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">3.4 Marketing Cookies (Optional)</h3>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    These cookies track your activity to provide relevant advertisements and measure campaign effectiveness.
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Facebook Pixel - ad targeting and conversion tracking</li>
                    <li>Google Ads - remarketing and conversion tracking</li>
                    <li>LinkedIn Insight - B2B marketing analytics</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                4. Third-Party Cookies
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Some cookies on our platform are set by third-party services we use:
              </p>
              <div className="mt-4 space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Google Analytics</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We use Google Analytics to understand platform usage. Google Analytics uses cookies to collect anonymous data about page views, session duration, and user behavior.
                  </p>
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-block">
                    Google Privacy Policy →
                  </a>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Cloudinary</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We use Cloudinary for image and video hosting. Cloudinary may set cookies to optimize content delivery.
                  </p>
                  <a href="https://cloudinary.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-block">
                    Cloudinary Privacy Policy →
                  </a>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Social Media Platforms</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    When you share content via social media buttons, those platforms may set their own cookies.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                5. How to Control Cookies
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 Browser Settings</h3>
              <p className="text-gray-600 leading-relaxed">
                Most browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                <li>Delete all cookies from your browser</li>
                <li>Block all cookies from being set</li>
                <li>Block third-party cookies only</li>
                <li>Clear cookies when you close your browser</li>
              </ul>
              
              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                <p className="text-gray-700 font-semibold mb-2">⚠️ Important Note</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Blocking or deleting cookies may prevent you from using certain features of our platform, including logging in to your account and tracking your course progress.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">5.2 Browser-Specific Instructions</h3>
              <div className="space-y-2 mt-3">
                <p className="text-gray-600">
                  <strong>Google Chrome:</strong> Settings → Privacy and Security → Cookies and other site data
                </p>
                <p className="text-gray-600">
                  <strong>Mozilla Firefox:</strong> Options → Privacy & Security → Cookies and Site Data
                </p>
                <p className="text-gray-600">
                  <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
                </p>
                <p className="text-gray-600">
                  <strong>Microsoft Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">5.3 Opt-Out Options</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  <strong>Google Analytics:</strong> Install the{' '}
                  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                    Google Analytics Opt-out Browser Add-on
                  </a>
                </li>
                <li>
                  <strong>Advertising Cookies:</strong> Visit{' '}
                  <a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                    Your Online Choices
                  </a>
                  {' '}or{' '}
                  <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                    DAA WebChoices
                  </a>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                6. Do Not Track Signals
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Some browsers have a "Do Not Track" (DNT) feature that lets you tell websites you do not want to be tracked. Currently, there is no industry standard for how to respond to DNT signals. We do not respond to DNT signals at this time.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                7. Updates to This Policy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, regulatory, or operational reasons. We will notify you of any material changes by posting the new policy on this page with an updated "Last updated" date.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                8. Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you have questions about our use of cookies, please contact us:
              </p>
              <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-semibold mb-2">{BRAND.name}</p>
                <p className="text-gray-600">Email: <a href="mailto:privacy@techfieldsolution.com" className="text-primary-600 hover:text-primary-700">privacy@techfieldsolution.com</a></p>
                <p className="text-gray-600">Address: 123 Learning Street, Tech City, TC 12345, India</p>
              </div>
            </section>

            <div className="p-6 bg-green-50 border-l-4 border-green-400 rounded-r-lg mt-12">
              <p className="text-gray-700 leading-relaxed">
                <strong>Your Privacy Matters:</strong> We are committed to transparency about how we use cookies and giving you control over your data. For more information about how we protect your privacy, please review our <a href="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</a>.
              </p>
            </div>

          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
