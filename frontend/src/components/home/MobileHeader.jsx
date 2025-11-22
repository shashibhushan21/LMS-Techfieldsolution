import Link from 'next/link';
import Image from 'next/image';

export default function MobileHeader({ brandName }) {
  return (
    <div className="lg:hidden mb-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="relative w-24 h-24">
          <Image
            src="/assets/images/Logo.png"
            alt="TechFieldSolutionLMS Logo"
            fill
            sizes="96px"
            className="object-contain"
            priority
          />
        </div>
      </div>
      <p className="text-gray-600 text-lg">Sign in to continue your learning</p>
    </div>
  );
}
