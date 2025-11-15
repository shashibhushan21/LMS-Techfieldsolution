import Link from 'next/link';

export default function FooterLinks() {
  const links = [
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
    { href: '/contact', label: 'Contact' }
  ];

  return (
    <div className="mt-8 text-center text-sm text-gray-600 space-x-4">
      {links.map((link, index) => (
        <span key={link.href}>
          {index > 0 && <span className="mr-4">•</span>}
          <Link 
            href={link.href} 
            className="hover:text-primary-600 transition-colors"
          >
            {link.label}
          </Link>
        </span>
      ))}
    </div>
  );
}
