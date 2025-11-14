import Head from 'next/head';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BRAND } from '@/config/brand';
import SectionHeader from '@/components/ui/SectionHeader';
import Card, { CardContent } from '@/components/ui/Card';

export default function About() {
  return (
    <>
      <Head>
        <title>{`About - ${BRAND.name}`}</title>
        <meta name="description" content={`${BRAND.name} — ${BRAND.tagline}`} />
      </Head>
      <Navbar />
      <main className="bg-white">
        <section className="py-16">
          <div className="container-custom">
            <SectionHeader title="About Us" subtitle={BRAND.tagline} className="mb-8" />
            <Card>
              <CardContent>
                <div className="prose max-w-none">
                  <p>
                    {BRAND.name} provides expert-led internships and practical learning paths that help students and professionals
                    build real-world skills. Our platform blends structured curricula, mentorship, and portfolio-ready projects.
                  </p>
                  <p>
                    We focus on outcomes: job-ready skills, hands-on experience, and recognized certificates that validate your
                    growth. Join our community and learn by building.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
