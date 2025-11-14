import Link from 'next/link';
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';
import { BRAND } from '@/config/brand';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-3">{BRAND.name}</h3>
            <p className="text-neutral-300">
              {BRAND.tagline}
            </p>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Programs</h4>
            <ul className="space-y-2 text-neutral-300">
              <li><Link href="/internships" className="hover:text-white">All Internships</Link></li>
              <li><Link href="/internships?category=Web%20Development" className="hover:text-white">Web Development</Link></li>
              <li><Link href="/internships?category=Data%20Science" className="hover:text-white">Data Science</Link></li>
              <li><Link href="/internships?category=AI%2FML" className="hover:text-white">AI/ML</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-neutral-300">
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-neutral-300 mb-4">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-white">Cookie Policy</Link></li>
            </ul>
            <div className="flex space-x-4">
              <a href={BRAND.social.github} className="text-neutral-400 hover:text-white" aria-label="GitHub"><FiGithub className="w-6 h-6" /></a>
              <a href={BRAND.social.linkedin} className="text-neutral-400 hover:text-white" aria-label="LinkedIn"><FiLinkedin className="w-6 h-6" /></a>
              <a href={BRAND.social.twitter} className="text-neutral-400 hover:text-white" aria-label="Twitter"><FiTwitter className="w-6 h-6" /></a>
              <a href="mailto:info@techfieldsolution.com" className="text-neutral-400 hover:text-white" aria-label="Email"><FiMail className="w-6 h-6" /></a>
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
