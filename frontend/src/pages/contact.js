import Head from 'next/head';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BRAND } from '@/config/brand';
import { FiMail, FiMapPin, FiPhone, FiSend, FiMessageSquare } from 'react-icons/fi';
import { FormInput, FormTextarea, Button, Alert, Card, CardContent } from '@/components/ui';
import { useFormValidation } from '@/hooks/useCommon';

export default function Contact() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const validation = (values) => {
    const errors = {};
    if (!values.name?.trim()) errors.name = 'Name is required';
    if (!values.email?.trim()) errors.email = 'Email is required';
    if (!values.subject?.trim()) errors.subject = 'Subject is required';
    if (!values.message?.trim()) errors.message = 'Message is required';
    return errors;
  };

  const {
    values: formData,
    errors,
    handleChange,
    validate,
    resetForm
  } = useFormValidation(
    { name: '', email: '', subject: '', message: '' },
    validation
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setLoading(false);
      resetForm();

      setTimeout(() => setStatus(null), 5000);
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Contact Us - {BRAND.name}</title>
        <meta name="description" content="Get in touch with TechFieldSolution. We're here to help with any questions about our internship programs." />
      </Head>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-16">
        <div className="container-custom text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-6">
            <FiMessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a question or need support? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <main className="bg-white py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>

                  {status === 'success' && (
                    <Alert variant="success" className="mb-6">
                      <strong>Thank you!</strong> We've received your message and will get back to you within 24-48 hours.
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormInput
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        placeholder="John Doe"
                        required
                      />
                      <FormInput
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <FormInput
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      error={errors.subject}
                      placeholder="How can we help?"
                      required
                    />

                    <FormTextarea
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      error={errors.message}
                      rows={6}
                      placeholder="Tell us more about your inquiry..."
                      required
                    />

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full md:w-auto"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiSend className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">

              {/* Email */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex-center flex-shrink-0">
                      <FiMail className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                      <a href="mailto:info@techfieldsolution.com" className="text-primary-600 hover:text-primary-700">
                        info@techfieldsolution.com
                      </a>
                      <p className="text-sm text-gray-500 mt-1">
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phone */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex-center flex-shrink-0">
                      <FiPhone className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                      <a href="tel:+1234567890" className="text-primary-600 hover:text-primary-700">
                        +1 (234) 567-890
                      </a>
                      <p className="text-sm text-gray-500 mt-1">
                        Mon-Fri from 9am to 6pm
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex-center flex-shrink-0">
                      <FiMapPin className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
                      <p className="text-gray-600">
                        123 Learning Street<br />
                        Tech City, TC 12345<br />
                        India
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Office Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium text-gray-900">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium text-gray-900">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium text-gray-900">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
