import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { FiAlertCircle, FiHome, FiAward } from 'react-icons/fi';

export default function VerifyIndex() {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Certificate Verification - TechFieldSolution LMS</title>
                <meta name="description" content="Verify your certificate authenticity" />
            </Head>

            <Navbar />

            <main className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-16">
                <div className="container mx-auto px-4 max-w-2xl">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
                            <FiAlertCircle className="w-10 h-10 text-amber-600" />
                        </div>

                        <h1 className="text-3xl font-bold text-neutral-900 mb-4">
                            Certificate ID Required
                        </h1>

                        <p className="text-neutral-600 mb-8 text-lg">
                            To verify a certificate, you need to provide a valid certificate ID.
                            The verification link should look like:
                        </p>

                        <div className="bg-neutral-100 rounded-lg p-4 mb-8 font-mono text-sm text-neutral-700 break-all">
                            https://yoursite.com/verify/<span className="text-primary-600 font-semibold">[certificate-id]</span>
                        </div>

                        <div className="space-y-4">
                            <p className="text-neutral-600">
                                If you received a certificate, the verification link should be included in your certificate document.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                                <Button
                                    onClick={() => router.push('/')}
                                    variant="primary"
                                >
                                    <FiHome className="w-4 h-4 mr-2" />
                                    Go to Home
                                </Button>
                                <Button
                                    onClick={() => router.push('/dashboard')}
                                    variant="outline"
                                >
                                    <FiAward className="w-4 h-4 mr-2" />
                                    View My Certificates
                                </Button>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-neutral-200">
                            <h3 className="font-semibold text-neutral-900 mb-3">
                                How to Verify a Certificate
                            </h3>
                            <ol className="text-left text-neutral-600 space-y-2 max-w-md mx-auto">
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">1.</span>
                                    <span>Locate the verification link on your certificate</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">2.</span>
                                    <span>Click the link or copy it to your browser</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">3.</span>
                                    <span>View the verification details and QR code</span>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
