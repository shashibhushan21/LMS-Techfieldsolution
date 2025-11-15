import Image from 'next/image';
import Link from 'next/link';

/**
 * Logo Component
 * 
 * Displays the application logo with optional link to homepage
 * Supports different sizes and color variants (for dark/light backgrounds)
 * 
 * @param {Object} props
 * @param {string} props.size - Size variant: 'sm', 'md', 'lg', 'xl' (default: 'md')
 * @param {string} props.variant - Color variant: 'default', 'white', 'dark' (default: 'default')
 * @param {boolean} props.clickable - Whether logo links to homepage (default: true)
 * @param {string} props.className - Additional CSS classes
 */
export default function Logo({ 
  size = 'md', 
  variant = 'default', 
  clickable = true, 
  className = '' 
}) {
  // Size configurations
  const sizes = {
    sm: { width: 120, height: 30, text: 'text-lg' },
    md: { width: 180, height: 45, text: 'text-2xl' },
    lg: { width: 240, height: 60, text: 'text-3xl' },
    xl: { width: 300, height: 75, text: 'text-4xl' }
  };

  const sizeConfig = sizes[size] || sizes.md;

  // Logo image paths based on variant
  const logoSrc = {
    default: '/assets/images/logo.png',
    white: '/assets/images/logo-white.png',
    dark: '/assets/images/logo-dark.png'
  };

  // Text color based on variant
  const textColor = {
    default: 'text-primary-600',
    white: 'text-white',
    dark: 'text-gray-900'
  };

  const LogoContent = () => (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Try to load image logo, fallback to text if not available */}
      <div className="relative">
        <Image
          src={logoSrc[variant] || logoSrc.default}
          alt="TechFieldSolutionLMS Logo"
          width={sizeConfig.width}
          height={sizeConfig.height}
          priority
          className="object-contain"
          onError={(e) => {
            // Hide image on error and show text fallback
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Text fallback - shown if image fails to load */}
        <div 
          className={`${sizeConfig.text} font-heading font-bold ${textColor[variant]}`}
          style={{ display: 'none' }}
          onLoad={(e) => {
            // Show text if image failed
            const img = e.currentTarget.previousElementSibling;
            if (img && img.style.display === 'none') {
              e.currentTarget.style.display = 'block';
            }
          }}
        >
          TFS LMS
        </div>
      </div>
    </div>
  );

  // If clickable, wrap in Link
  if (clickable) {
    return (
      <Link href="/" className="inline-block transition-opacity hover:opacity-80">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
}

/**
 * LogoText Component
 * 
 * Text-only version of the logo (no image)
 * Useful for loading states or when image isn't available
 */
export function LogoText({ 
  size = 'md', 
  variant = 'default', 
  clickable = true,
  className = '',
  fullName = false
}) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const textColor = {
    default: 'text-primary-600',
    white: 'text-white',
    dark: 'text-gray-900'
  };

  const textClass = `font-heading font-bold ${sizeClasses[size]} ${textColor[variant]} ${className}`;
  const text = fullName ? 'TechFieldSolutionLMS' : 'TFS LMS';

  const TextContent = () => (
    <span className={textClass}>{text}</span>
  );

  if (clickable) {
    return (
      <Link href="/" className="inline-block transition-opacity hover:opacity-80">
        <TextContent />
      </Link>
    );
  }

  return <TextContent />;
}
