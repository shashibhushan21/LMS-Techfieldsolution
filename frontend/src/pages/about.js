import Head from 'next/head';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BRAND } from '@/config/brand';
import { FiTarget, FiUsers, FiAward, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

const stats = [
  { label: 'Active Learners', value: '10,000+', icon: FiUsers },
  { label: 'Internship Programs', value: '50+', icon: FiAward },
  { label: 'Success Rate', value: '95%', icon: FiTrendingUp },
  { label: 'Industry Partners', value: '100+', icon: FiCheckCircle },
];

const values = [
  {
    icon: FiTarget,
    title: 'Mission-Driven',
    description: 'We believe in democratizing quality education and making professional skills accessible to everyone, everywhere.'
  },
  {
    icon: FiUsers,
    title: 'Community-First',
    description: 'Our learners are at the heart of everything we do. We foster a supportive, collaborative environment for growth.'
  },
  {
    icon: FiAward,
    title: 'Excellence',
    description: 'We maintain the highest standards in curriculum design, mentor selection, and learning outcomes.'
  },
  {
    icon: FiTrendingUp,
    title: 'Innovation',
    description: 'We continuously evolve our platform and programs to meet the changing demands of the tech industry.'
  }
];

const team = [
  { name: 'Leadership Team', role: 'Guiding our vision and strategy', count: '5' },
  { name: 'Expert Mentors', role: 'Industry professionals teaching real-world skills', count: '50+' },
  { name: 'Support Staff', role: 'Ensuring smooth learning experiences', count: '20+' }
];

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - {BRAND.name}</title>
        <meta name="description" content={`${BRAND.name} — ${BRAND.tagline}. Learn about our mission to provide expert-led internships and practical learning paths.`} />
      </Head>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About {BRAND.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {BRAND.tagline}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="text-lg leading-relaxed mb-6">
                {BRAND.name} was founded with a simple yet powerful vision: to bridge the gap between 
                academic learning and industry demands. We recognized that traditional education often 
                falls short in preparing students for real-world challenges in the tech industry.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Our platform blends structured curricula with hands-on projects, personalized mentorship, 
                and a supportive community. We focus on practical skills that employers actually look for, 
                ensuring our learners don't just learn—they build portfolios that showcase their abilities.
              </p>
              <p className="text-lg leading-relaxed">
                Today, we're proud to serve thousands of learners worldwide, helping them transform their 
                careers through expert-led internships in web development, data science, AI/ML, and more. 
                Every success story from our community reinforces our commitment to accessible, high-quality 
                tech education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate professionals dedicated to your success
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((group, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {group.count}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {group.name}
                </h3>
                <p className="text-gray-600">
                  {group.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}
