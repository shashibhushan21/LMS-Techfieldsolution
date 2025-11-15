import Head from 'next/head';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BRAND } from '@/config/brand';
import SectionHeader from '@/components/ui/SectionHeader';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Thanks! We will get back to you.');
  };

  return (
    <>
      <Head>
        <title>Contact - {BRAND.name}</title>
        <meta name="description" content={`Contact ${BRAND.name}`} />
      </Head>
      <Navbar />
      <main className="bg-gray-50">
        <section className="py-16">
          <div className="container-custom grid lg:grid-cols-2 gap-8">
            <div>
              <SectionHeader title="Contact Us" subtitle="We'd love to hear from you." className="mb-6" />
              <Card>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="input" placeholder="Your name" required />
                    <input className="input" type="email" placeholder="Your email" required />
                    <textarea className="input" rows="5" placeholder="Your message" required />
                    <Button type="submit" className="w-full">Send Message</Button>
                    {status && <p className="text-sm text-green-700">{status}</p>}
                  </form>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardContent>
                  <h3 className="text-lg font-semibold mb-2">Other ways to reach us</h3>
                  <p>Email: <a className="text-primary-700" href="mailto:info@techfieldsolution.com">info@techfieldsolution.com</a></p>
                  <p className="mt-2">Twitter: <a className="text-primary-700" href={BRAND.social.twitter}>Follow us</a></p>
                  <p className="mt-2">LinkedIn: <a className="text-primary-700" href={BRAND.social.linkedin}>Connect</a></p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
