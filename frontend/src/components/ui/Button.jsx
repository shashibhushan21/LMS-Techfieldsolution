import Link from 'next/link';
import { forwardRef } from 'react';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const base =
  'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700',
  secondary: 'bg-neutral-900 text-white hover:bg-neutral-800',
  outline: 'border border-neutral-300 text-neutral-900 hover:bg-neutral-50',
  ghost: 'text-neutral-900 hover:bg-neutral-100',
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

const Button = forwardRef(function Button(
  { className, variant = 'primary', size = 'md', href, children, ...props },
  ref
) {
  const cls = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={cls} ref={ref} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref} className={cls} {...props}>
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
