import Head from 'next/head';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BRAND } from '@/config/brand';
import SectionHeader from '@/components/ui/SectionHeader';
import Card, { CardContent } from '@/components/ui/Card';

const faqs = [
  { q: 'How do internships work?', a: 'Enroll in an internship, follow modules weekly, complete assignments, and earn a certificate upon completion.' },
  { q: 'Are internships self-paced?', a: 'Most are flexible, but mentors host regular check-ins and deadlines for deliverables.' },
  { q: 'Do I get a certificate?', a: 'Yes, you receive a verified certificate after successfully completing program requirements.' },
];

export default function FAQ() {
  return (
    <>
      <Head>
        <title>{`FAQ - ${BRAND.name}`}</title>
      </Head>
      <Navbar />
      <main className="bg-white">
        <section className="py-16">
          <div className="container-custom">
            <SectionHeader title="Frequently Asked Questions" className="mb-8" />
            <div className="space-y-4">
              {faqs.map((item, idx) => (
                <Card key={idx}>
                  <CardContent>
                    <h3 className="text-lg font-semibold">{item.q}</h3>
                    <p className="text-neutral-700 mt-1">{item.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
