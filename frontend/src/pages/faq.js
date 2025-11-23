import Head from 'next/head';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BRAND } from '@/config/brand';
import { FiChevronDown, FiChevronUp, FiHelpCircle } from 'react-icons/fi';

const faqCategories = [
  {
    category: 'Getting Started',
    items: [
      {
        q: 'What is TechFieldSolution LMS?',
        a: 'TechFieldSolution LMS is a comprehensive learning management system that provides expert-led internships and practical learning paths. We help students and professionals build real-world skills through structured curricula, mentorship, and hands-on projects.'
      },
      {
        q: 'How do I enroll in an internship?',
        a: 'Simply create an account, browse our available internships, and click "Enroll" on the program that interests you. Once enrolled, you\'ll get immediate access to all course materials and resources.'
      },
      {
        q: 'Is there a fee to join?',
        a: 'We offer both free and premium internships. Free programs provide basic access to learning materials, while premium programs include personalized mentorship, live sessions, and career support.'
      }
    ]
  },
  {
    category: 'Internship Programs',
    items: [
      {
        q: 'How do internships work?',
        a: 'Enroll in an internship, follow weekly modules with video lessons and reading materials, complete hands-on assignments and projects, get feedback from mentors, and earn a verified certificate upon successful completion.'
      },
      {
        q: 'Are internships self-paced or scheduled?',
        a: 'Most of our internships are flexible and self-paced, allowing you to learn at your own speed. However, mentors host regular check-ins, live sessions, and set deadlines for major deliverables to keep you on track.'
      },
      {
        q: 'How long do internships typically last?',
        a: 'Program duration varies from 4 to 12 weeks depending on the complexity and depth of the subject matter. Each internship page clearly indicates the expected time commitment.'
      },
      {
        q: 'Can I enroll in multiple internships at once?',
        a: 'Yes! You can enroll in multiple programs simultaneously. However, we recommend focusing on 1-2 internships at a time to ensure you can dedicate sufficient time and effort to each.'
      }
    ]
  },
  {
    category: 'Certificates & Recognition',
    items: [
      {
        q: 'Do I get a certificate after completion?',
        a: 'Yes, you receive a verified digital certificate after successfully completing all program requirements, including assignments, projects, and assessments. Certificates can be shared on LinkedIn and added to your resume.'
      },
      {
        q: 'Are the certificates recognized by employers?',
        a: 'Our certificates demonstrate practical skills and project completion. Many of our alumni have successfully used these certificates in job applications and interviews. The real value comes from the portfolio projects you build during the internship.'
      }
    ]
  },
  {
    category: 'Support & Mentorship',
    items: [
      {
        q: 'How do I get help if I\'m stuck?',
        a: 'We provide multiple support channels: dedicated discussion forums, weekly mentor office hours, peer study groups, and direct messaging with instructors for premium programs.'
      },
      {
        q: 'What qualifications do mentors have?',
        a: 'Our mentors are industry professionals with 3+ years of experience in their respective fields. They work at leading tech companies and bring real-world insights to their teaching.'
      }
    ]
  },
  {
    category: 'Technical Requirements',
    items: [
      {
        q: 'What do I need to get started?',
        a: 'You need a computer with internet access, a modern web browser (Chrome, Firefox, Safari, or Edge), and willingness to learn. Specific programs may have additional software requirements listed in their descriptions.'
      },
      {
        q: 'Can I access courses on mobile devices?',
        a: 'Yes, our platform is fully responsive and works on tablets and smartphones. However, for the best learning experience and to complete coding assignments, we recommend using a laptop or desktop computer.'
      }
    ]
  }
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-start justify-between text-left hover:bg-gray-50 transition-colors px-1"
      >
        <span className="font-semibold text-gray-900 pr-8">{question}</span>
        {isOpen ? (
          <FiChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
        ) : (
          <FiChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
        )}
      </button>
      {isOpen && (
        <div className="pb-5 px-1 text-gray-600 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <>
      <Head>
        <title>Frequently Asked Questions - {BRAND.name}</title>
        <meta name="description" content="Find answers to common questions about TechFieldSolution LMS internships, certificates, support, and more." />
      </Head>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-16">
        <div className="container-custom text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-6">
            <FiHelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our internship programs and platform
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <main className="bg-white py-16">
        <div className="container-custom max-w-4xl">
          <div className="space-y-12">
            {faqCategories.map((category, idx) => (
              <div key={idx}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                  {category.category}
                </h2>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  {category.items.map((item, itemIdx) => (
                    <FAQItem key={itemIdx} question={item.q} answer={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="mt-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Please reach out to our support team.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-md"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
