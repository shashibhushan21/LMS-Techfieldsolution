import Link from 'next/link';
import { LogoText } from '@/components/ui/Logo';

export default function MobileHeader({ brandName }) {
  return (
    <div className="lg:hidden mb-8 text-center">
      <div className="flex justify-center mb-2">
        <LogoText size="lg" clickable={false} />
      </div>
      <p className="text-gray-600">Sign in to continue your learning</p>
    </div>
  );
}
