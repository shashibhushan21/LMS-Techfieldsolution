import Head from 'next/head';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';
import Card, { CardContent } from '@/components/ui/Card';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <Navbar />
      <main className="bg-white">
        <section className="py-16">
          <div className="container-custom">
            <SectionHeader title="Privacy Policy" className="mb-8" />
            <Card>
              <CardContent>
                <div className="prose max-w-none">
                  <p>This is a placeholder privacy policy. Replace with your legal copy.</p>
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
