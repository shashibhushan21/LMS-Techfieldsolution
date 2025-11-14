import Head from 'next/head';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';
import Card, { CardContent } from '@/components/ui/Card';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service</title>
      </Head>
      <Navbar />
      <main className="bg-white">
        <section className="py-16">
          <div className="container-custom">
            <SectionHeader title="Terms of Service" className="mb-8" />
            <Card>
              <CardContent>
                <div className="prose max-w-none">
                  <p>This is a placeholder terms of service page. Replace with your legal copy.</p>
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
