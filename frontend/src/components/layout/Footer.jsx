import Link from 'next/link';
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';
import { BRAND } from '@/config/brand';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-heading font-bold mb-3">{BRAND.name}</h3>
            <p className="text-neutral-300">
              {BRAND.tagline}
            </p>
          </div>

          {/* Resources */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-neutral-300">
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-neutral-300">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              <a href={BRAND.social.github} className="text-neutral-400 hover:text-white transition-colors" aria-label="GitHub"><FiGithub className="w-6 h-6" /></a>
              <a href={BRAND.social.linkedin} className="text-neutral-400 hover:text-white transition-colors" aria-label="LinkedIn"><FiLinkedin className="w-6 h-6" /></a>
              <a href={BRAND.social.twitter} className="text-neutral-400 hover:text-white transition-colors" aria-label="Twitter"><FiTwitter className="w-6 h-6" /></a>
              <a href="mailto:info@techfieldsolution.com" className="text-neutral-400 hover:text-white transition-colors" aria-label="Email"><FiMail className="w-6 h-6" /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
          <p>&copy; {new Date().getFullYear()} TechFieldSolution. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
